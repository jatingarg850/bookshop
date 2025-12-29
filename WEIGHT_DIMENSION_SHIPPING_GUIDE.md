# Weight and Dimension-Based Shipping Configuration Guide

## Overview

The system now supports flexible shipping cost calculation based on:
1. **Weight-based rates** - Calculate shipping based on total order weight in grams
2. **Dimension-based rates** - Calculate shipping based on total order volume in cm³
3. **Default flat rate** - Fallback to a fixed shipping cost

## How It Works

### Shipping Cost Calculation Priority

The system calculates shipping costs in this order:

1. **Free Shipping Check** - If order subtotal >= free shipping threshold, shipping is free
2. **Weight-Based Rates** - If configured, uses weight-based rates (in grams)
3. **Dimension-Based Rates** - If configured, uses dimension-based rates (in cm³)
4. **Default Shipping Cost** - Falls back to the default flat rate

### Weight Calculation

- **Actual Weight**: Product weight in grams, kilograms, ounces, or pounds
- **Volumetric Weight**: Calculated from dimensions (Length × Width × Height) / 5000
- **Effective Weight**: Maximum of actual weight or volumetric weight
- **Total Order Weight**: Sum of all items' effective weights × quantities (converted to grams)

### Volume Calculation

- **Item Volume**: Length × Width × Height (in cm³)
- **Total Order Volume**: Sum of all items' volumes × quantities

## Admin Configuration

### Access Settings

1. Go to **Admin Dashboard** → **Settings**
2. Scroll to **Shipping Settings** section

### Configure Weight-Based Rates

1. Click **Add Weight Rate** button
2. Enter:
   - **Min Weight (g)**: Minimum weight in grams for this rate
   - **Max Weight (g)**: Maximum weight in grams for this rate
   - **Cost (₹)**: Shipping cost for this weight range
3. Add multiple rates for different weight ranges
4. Example:
   - 0g - 500g: ₹50
   - 500g - 2000g: ₹100
   - 2000g - 5000g: ₹150

### Configure Dimension-Based Rates

1. Click **Add Dimension Rate** button
2. Enter:
   - **Min Volume (cm³)**: Minimum volume for this rate
   - **Max Volume (cm³)**: Maximum volume for this rate
   - **Cost (₹)**: Shipping cost for this volume range
3. Add multiple rates for different volume ranges
4. Example:
   - 0 cm³ - 5000 cm³: ₹50
   - 5000 cm³ - 20000 cm³: ₹100
   - 20000 cm³ - 50000 cm³: ₹150

### Configure Default Settings

- **Shipping Cost (₹)**: Default flat rate (used if no weight/dimension rates match)
- **Free Shipping Above (₹)**: Order amount for free shipping

## Product Configuration

For weight and dimension-based shipping to work, products must have:

### Weight Information
- **Weight**: Numeric value
- **Weight Unit**: g, kg, mg, oz, or lb

### Dimension Information
- **Length**: Numeric value
- **Width**: Numeric value
- **Height**: Numeric value
- **Unit**: cm, mm, in, or m

## Example Scenarios

### Scenario 1: Light Book (Weight-Based)
- Product: Book
- Weight: 500g
- Quantity: 2
- Total Weight: 1000g
- Shipping Rate: 500g - 2000g = ₹100
- **Shipping Cost: ₹100**

### Scenario 2: Large Box (Dimension-Based)
- Product: Stationery Set
- Dimensions: 30cm × 20cm × 15cm = 9000 cm³
- Quantity: 1
- Total Volume: 9000 cm³
- Shipping Rate: 5000-20000 cm³ = ₹100
- **Shipping Cost: ₹100**

### Scenario 3: Free Shipping
- Subtotal: ₹600
- Free Shipping Above: ₹500
- **Shipping Cost: FREE**

## Technical Details

### Files Modified

1. **lib/db/models/Settings.ts**
   - Added `weightBasedRates` array (rates in grams)
   - Added `dimensionBasedRates` array (rates in cm³)

2. **lib/utils/shippingCalculator.ts**
   - Added `calculateOrderWeightInGrams()` function
   - Added `calculateOrderVolume()` function
   - Updated `calculateShippingCost()` to use grams for weight-based rates
   - Updated `ShippingSettings` interface

3. **app/admin/settings/page.tsx**
   - Added UI for managing weight-based rates (in grams)
   - Added UI for managing dimension-based rates (in cm³)

4. **app/api/admin/settings/route.ts**
   - Updated to save/retrieve weight and dimension rates

5. **app/api/orders/route.ts**
   - Updated to calculate weight in grams and volume
   - Uses gram-based rates for shipping calculation

## Best Practices

1. **Set Product Dimensions**: Always set product dimensions for accurate volumetric weight calculation
2. **Use Consistent Units**: Use grams for weight, cm for dimensions
3. **Test Rates**: Test shipping calculations with sample orders
4. **Order Rates**: Arrange weight/dimension rates in ascending order for clarity
5. **Fallback Rate**: Always set a default shipping cost as fallback

## Troubleshooting

### Shipping Cost Not Changing
- Check if weight/dimension rates are configured
- Verify product weight and dimensions are set
- Check if order subtotal exceeds free shipping threshold

### Unexpected Shipping Cost
- Verify the weight/dimension calculation matches your expectations
- Check if multiple rates overlap
- Ensure rates are in correct order (min to max)
- Remember: weight is in grams, not kg

## API Integration

When creating orders, the system automatically:
1. Fetches product weight and dimension data
2. Calculates total order weight in grams and volume in cm³
3. Applies appropriate shipping rate based on grams/volume
4. Falls back to default rate if needed

No additional configuration needed in checkout or order creation.
