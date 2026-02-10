/**
 * Shipping and Tax Calculator
 * Handles weight-based shipping, dimension-based calculations, and product-level tax rates
 */

interface ShippingSettings {
  shippingCost: number;
  freeShippingAbove: number;
  weightBasedRates?: Array<{
    minWeight: number;
    maxWeight: number;
    cost: number;
  }>;
  dimensionBasedRates?: Array<{
    minVolume: number;
    maxVolume: number;
    cost: number;
  }>;
}

interface ProductItem {
  productId?: string;
  weight?: number;
  weightUnit?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    breadth?: number;
    unit?: string;
  };
  cgst?: number;
  sgst?: number;
  igst?: number;
  quantity: number;
  price?: number;
}

interface TaxRates {
  cgst: number;
  sgst: number;
  igst: number;
}

/**
 * Convert weight to kg for standardized calculation
 */
export function convertWeightToKg(weight: number, unit: string = 'g'): number {
  const conversions: Record<string, number> = {
    'g': 0.001,
    'kg': 1,
    'mg': 0.000001,
    'oz': 0.0283495,
    'lb': 0.453592,
  };
  return weight * (conversions[unit] || 0.001);
}

/**
 * Calculate volumetric weight from dimensions
 * Formula: (Length × Width × Height) / 5000 (standard divisor)
 */
export function calculateVolumetricWeight(
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    breadth?: number;
    unit?: string;
  }
): number {
  if (!dimensions || !dimensions.length || !dimensions.width || !dimensions.height) {
    return 0;
  }

  // Convert to cm if needed
  const unit = dimensions.unit || 'cm';
  const conversions: Record<string, number> = {
    'cm': 1,
    'mm': 0.1,
    'in': 2.54,
    'm': 100,
  };

  const multiplier = conversions[unit] || 1;
  const length = dimensions.length * multiplier;
  const width = dimensions.width * multiplier;
  const height = dimensions.height * multiplier;

  // Volumetric weight in kg (cm³ / 5000)
  return (length * width * height) / 5000 / 1000;
}

/**
 * Get effective weight (actual or volumetric, whichever is greater)
 */
export function getEffectiveWeight(
  actualWeight?: number,
  weightUnit?: string,
  dimensions?: any
): number {
  let actualWeightKg = 0;
  if (actualWeight && actualWeight > 0) {
    actualWeightKg = convertWeightToKg(actualWeight, weightUnit || 'g');
  }

  const volumetricWeightKg = calculateVolumetricWeight(dimensions);

  // Return the greater of the two (actual or volumetric)
  // No minimum enforcement here - let calculateOrderWeight handle that
  return Math.max(actualWeightKg, volumetricWeightKg);
}

/**
 * Calculate total order weight in grams
 */
export function calculateOrderWeightInGrams(items: Array<ProductItem>): number {
  return items.reduce((total, item) => {
    const itemWeightKg = getEffectiveWeight(item.weight, item.weightUnit, item.dimensions);
    const itemWeightGrams = itemWeightKg * 1000; // Convert kg to grams
    return total + itemWeightGrams * item.quantity;
  }, 0);
}

/**
 * Calculate total order weight (in kg, for backward compatibility)
 */
export function calculateOrderWeight(items: Array<ProductItem>): number {
  if (!items || items.length === 0) {
    return 0.5; // Default minimum weight
  }

  const totalWeight = items.reduce((total, item) => {
    const itemWeight = getEffectiveWeight(item.weight, item.weightUnit, item.dimensions);
    return total + itemWeight * (item.quantity || 1);
  }, 0);

  // Return actual weight if calculated, otherwise use minimum
  return totalWeight > 0 ? totalWeight : 0.5;
}

/**
 * Calculate total order volume in cm³
 */
export function calculateOrderVolume(items: Array<ProductItem>): number {
  return items.reduce((total, item) => {
    if (!item.dimensions?.length || !item.dimensions?.width || !item.dimensions?.height) {
      return total;
    }
    
    const unit = item.dimensions.unit || 'cm';
    const conversions: Record<string, number> = {
      'cm': 1,
      'mm': 0.1,
      'in': 2.54,
      'm': 100,
    };
    
    const multiplier = conversions[unit] || 1;
    const length = item.dimensions.length * multiplier;
    const width = item.dimensions.width * multiplier;
    const height = item.dimensions.height * multiplier;
    
    const itemVolume = length * width * height;
    return total + itemVolume * item.quantity;
  }, 0);
}

/**
 * Calculate shipping cost based on weight (in grams), dimensions, and settings
 */
export function calculateShippingCost(
  subtotal: number,
  totalWeightGrams: number,
  settings: ShippingSettings,
  totalVolume?: number
): number {
  // Check free shipping threshold
  if (subtotal >= settings.freeShippingAbove) {
    return 0;
  }

  // If weight-based rates are configured, use them (rates are in grams)
  if (settings.weightBasedRates && settings.weightBasedRates.length > 0) {
    for (const rate of settings.weightBasedRates) {
      if (totalWeightGrams >= rate.minWeight && totalWeightGrams <= rate.maxWeight) {
        return rate.cost;
      }
    }
    // If weight exceeds all ranges, use the last rate
    const lastRate = settings.weightBasedRates[settings.weightBasedRates.length - 1];
    if (totalWeightGrams > lastRate.maxWeight) {
      return lastRate.cost;
    }
  }

  // If dimension-based rates are configured, use them
  if (totalVolume !== undefined && settings.dimensionBasedRates && settings.dimensionBasedRates.length > 0) {
    for (const rate of settings.dimensionBasedRates) {
      if (totalVolume >= rate.minVolume && totalVolume <= rate.maxVolume) {
        return rate.cost;
      }
    }
    // If volume exceeds all ranges, use the last rate
    const lastRate = settings.dimensionBasedRates[settings.dimensionBasedRates.length - 1];
    if (totalVolume > lastRate.maxVolume) {
      return lastRate.cost;
    }
  }

  // Fall back to default shipping cost
  return settings.shippingCost;
}

/**
 * Get tax rates for a product (product-level or fallback to global)
 */
export function getTaxRates(
  product: ProductItem,
  globalTaxRate: number
): TaxRates {
  // If product has specific tax rates, use them
  if (product.cgst !== undefined || product.sgst !== undefined || product.igst !== undefined) {
    return {
      cgst: product.cgst || 0,
      sgst: product.sgst || 0,
      igst: product.igst || 0,
    };
  }

  // Fall back to global tax rate (split equally for CGST/SGST)
  const halfRate = globalTaxRate / 2;
  return {
    cgst: halfRate,
    sgst: halfRate,
    igst: globalTaxRate,
  };
}

/**
 * Calculate tax for an item
 */
export function calculateItemTax(
  itemPrice: number,
  quantity: number,
  taxRates: TaxRates
): {
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
} {
  const itemTotal = itemPrice * quantity;
  const cgst = (itemTotal * taxRates.cgst) / 100;
  const sgst = (itemTotal * taxRates.sgst) / 100;
  const igst = (itemTotal * taxRates.igst) / 100;

  return {
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    total: Math.round((cgst + sgst + igst) * 100) / 100,
  };
}

/**
 * Calculate total tax for order
 */
export function calculateOrderTax(
  items: Array<ProductItem & { priceAtPurchase: number }>,
  globalTaxRate: number
): {
  itemTaxes: Array<{
    productId: string;
    cgst: number;
    sgst: number;
    igst: number;
    total: number;
  }>;
  totalTax: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
} {
  let totalTax = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;
  const itemTaxes = [];

  for (const item of items) {
    const taxRates = getTaxRates(item, globalTaxRate);
    const itemTax = calculateItemTax(item.priceAtPurchase, item.quantity, taxRates);

    itemTaxes.push({
      productId: item.productId || '',
      cgst: itemTax.cgst,
      sgst: itemTax.sgst,
      igst: itemTax.igst,
      total: itemTax.total,
    });

    totalTax += itemTax.total;
    totalCGST += itemTax.cgst;
    totalSGST += itemTax.sgst;
    totalIGST += itemTax.igst;
  }

  return {
    itemTaxes,
    totalTax: Math.round(totalTax * 100) / 100,
    totalCGST: Math.round(totalCGST * 100) / 100,
    totalSGST: Math.round(totalSGST * 100) / 100,
    totalIGST: Math.round(totalIGST * 100) / 100,
  };
}
