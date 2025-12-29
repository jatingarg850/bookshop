# Invoice System Implementation - Complete Guide

## Overview
The invoice system has been completely redesigned to support:
- **Product-level tax rates** (CGST, SGST, IGST) with fallback to global GST
- **Weight-based shipping calculation** using actual product weight and dimensions
- **Volumetric weight calculation** for dimensional packages
- **Detailed tax breakdown** on invoices (CGST/SGST/IGST separately)
- **Professional invoice templates** matching GST compliance standards

## Key Components

### 1. Shipping Calculator (`lib/utils/shippingCalculator.ts`)
Handles all shipping and tax calculations:

#### Functions:
- `convertWeightToKg()` - Converts weight from any unit (g, kg, mg, oz, lb) to kg
- `calculateVolumetricWeight()` - Calculates volumetric weight from dimensions
- `getEffectiveWeight()` - Returns the greater of actual or volumetric weight
- `calculateOrderWeight()` - Sums up total weight for all items in order
- `calculateShippingCost()` - Determines shipping based on weight and settings
- `getTaxRates()` - Gets product-level or global tax rates
- `calculateItemTax()` - Calculates CGST/SGST/IGST for individual items
- `calculateOrderTax()` - Calculates total tax breakdown for entire order

#### Shipping Logic:
1. Check if order qualifies for free shipping (above threshold)
2. If weight-based rates configured, use them
3. Otherwise, use default shipping cost

#### Tax Logic:
1. Check if product has CGST/SGST/IGST defined
2. If yes, use product-level rates
3. If no, use global GST rate (split as CGST/SGST)

### 2. Updated Models

#### Order Model (`lib/db/models/Order.ts`)
New fields added:
```typescript
items: [{
  weight?: number;
  weightUnit?: string;
  dimensions?: { length, width, height, breadth, unit };
  cgst?: number;
  sgst?: number;
  igst?: number;
}];
cgst?: number;      // Total CGST for order
sgst?: number;      // Total SGST for order
igst?: number;      // Total IGST for order
totalWeight?: number; // Total order weight in kg
```

#### Invoice Model (`lib/db/models/Invoice.ts`)
New fields added:
```typescript
items: [{
  cgst?: number;
  sgst?: number;
  igst?: number;
  taxAmount?: number;
}];
cgst: number;       // Total CGST
sgst: number;       // Total SGST
igst: number;       // Total IGST
```

### 3. API Endpoints

#### Order Creation (`app/api/orders/route.ts`)
- Fetches product weight, dimensions, and tax rates
- Calculates total order weight
- Determines shipping cost based on weight
- Calculates per-product and total taxes
- Creates order with all tax details
- For COD orders: Creates invoice and delivery record immediately

#### Payment Verification (`app/api/payments/verify/route.ts`)
- Verifies Razorpay payment signature
- Calculates taxes using product-level rates
- Creates invoice with detailed tax breakdown
- Creates delivery record with tracking

#### Invoice Fetch (`app/api/invoices/[orderId]/route.ts`)
- Retrieves invoice data
- Formats for display with store settings
- Includes all tax details

#### Invoice Download (`app/api/invoices/[orderId]/download/route.ts`)
- Generates HTML invoice for download
- Includes all tax breakdowns
- Professional GST-compliant format

### 4. Invoice Templates

#### React Component (`components/invoice/InvoiceTemplate.tsx`)
- Displays invoice with product-level tax rates
- Shows CGST/SGST/IGST separately
- Includes amount in words (Indian format)
- Print-friendly styling
- Responsive design

#### HTML Template (in download route)
- Standalone HTML for email/download
- Professional styling
- GST compliance format
- Includes all required fields

## Admin Configuration

### Settings Panel (`app/admin/settings/page.tsx`)
Configure:
- Global GST Rate (%)
- Default Shipping Cost (₹)
- Free Shipping Threshold (₹)
- Weight-based shipping rates (optional)

### Product Management (`app/admin/products/[id]/page.tsx`)
Set per-product:
- Weight (with unit: g, kg, mg, oz, lb)
- Dimensions (length, width, height, breadth with unit: cm, mm, in, m)
- CGST Rate (%)
- SGST Rate (%)
- IGST Rate (%)
- HSN Code

## Invoice Format

### Header Section
- Store logo and name
- Invoice title and type
- Seller details with PAN/GST

### Address Section
- Billing address
- Shipping address
- State/UT codes

### Order Details
- Order number and date
- Invoice number and date

### Items Table
| Sl. No | Description | Unit Price | Qty | Net Amount | Tax Rate | Tax Charges | Total Amount |
|--------|-------------|------------|-----|------------|----------|-------------|--------------|
| 1 | Product Name | ₹100 | 2 | ₹200 | CGST 9% + SGST 9% | ₹36 | ₹236 |

### Totals Section
- Subtotal
- Shipping Cost
- CGST (if applicable)
- SGST (if applicable)
- IGST (if applicable)
- **Total Amount**

### Additional Info
- Amount in words (Indian format)
- Payment method and status
- Place of supply and delivery
- Reverse charge note
- Authorized signature

## Workflow

### For Razorpay Orders:
1. Customer adds items to cart
2. Checkout page calculates shipping based on weight
3. Order created with pending status
4. Payment gateway opens
5. After successful payment:
   - Order status → confirmed
   - Stock reduced
   - Invoice created with tax breakdown
   - Delivery record created
   - Customer redirected to confirmation page

### For COD Orders:
1. Customer adds items to cart
2. Checkout page calculates shipping based on weight
3. Order created with confirmed status
4. Stock reduced immediately
5. Invoice created with tax breakdown
6. Delivery record created
7. Customer redirected to confirmation page

## Tax Calculation Examples

### Example 1: Product with specific tax rates
```
Product: Pen (CGST: 5%, SGST: 5%, IGST: 10%)
Price: ₹100
Quantity: 2
Net Amount: ₹200
CGST (5%): ₹10
SGST (5%): ₹10
IGST (10%): ₹20
Total Tax: ₹40
Total: ₹240
```

### Example 2: Product with global tax rate
```
Product: Notebook (No specific rates, uses global 18% GST)
Price: ₹50
Quantity: 1
Net Amount: ₹50
CGST (9%): ₹4.50
SGST (9%): ₹4.50
Total Tax: ₹9
Total: ₹59
```

## Shipping Calculation Examples

### Example 1: Weight-based
```
Product 1: Weight 500g, Qty 2 = 1kg
Product 2: Weight 250g, Qty 1 = 0.25kg
Total Weight: 1.25kg

Weight-based rates:
- 0-1kg: ₹50
- 1-2kg: ₹75
- 2-5kg: ₹100

Shipping Cost: ₹75 (falls in 1-2kg range)
```

### Example 2: Volumetric weight
```
Product: Dimensions 30cm × 20cm × 10cm
Volumetric Weight = (30 × 20 × 10) / 5000 / 1000 = 0.012kg
Actual Weight: 0.5kg
Effective Weight: 0.5kg (actual is greater)
```

## Features

✅ Product-level tax rates (CGST/SGST/IGST)
✅ Global GST fallback
✅ Weight-based shipping calculation
✅ Volumetric weight calculation
✅ Detailed tax breakdown on invoices
✅ Professional GST-compliant format
✅ Print-friendly invoices
✅ HTML download option
✅ Amount in words (Indian format)
✅ Support for COD and Razorpay
✅ Automatic invoice generation
✅ Delivery tracking integration

## Files Modified/Created

### Created:
- `lib/utils/shippingCalculator.ts` - Shipping and tax calculation utilities
- `components/invoice/InvoiceTemplate.tsx` - React invoice component
- `app/api/invoices/[orderId]/route.ts` - Invoice fetch API
- `app/api/invoices/[orderId]/download/route.ts` - Invoice download API

### Modified:
- `lib/db/models/Order.ts` - Added weight and tax fields
- `lib/db/models/Invoice.ts` - Added detailed tax fields
- `app/api/orders/route.ts` - Updated to use new calculator
- `app/api/payments/verify/route.ts` - Updated to use new calculator
- `app/order-confirmation/[id]/page.tsx` - Updated to use new template

## Testing Checklist

- [ ] Create order with products having different tax rates
- [ ] Verify tax calculation is correct
- [ ] Check shipping cost based on weight
- [ ] Verify invoice displays correct tax breakdown
- [ ] Test print functionality
- [ ] Test download functionality
- [ ] Verify COD order creates invoice immediately
- [ ] Verify Razorpay order creates invoice after payment
- [ ] Check amount in words conversion
- [ ] Verify GST compliance format
