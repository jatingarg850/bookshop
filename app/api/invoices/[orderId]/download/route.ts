import { NextRequest, NextResponse } from 'next/server';
import { generateInvoiceNumber } from '@/lib/utils/invoice';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/db/models/Order';
import mongoose from 'mongoose';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    await connectDB();
    const order = mongoose.Types.ObjectId.isValid(orderId)
      ? await Order.findById(orderId)
      : await Order.findOne({ _id: orderId });
    if (!order) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const html = generateInvoiceHTML({
      invoiceNumber: generateInvoiceNumber(),
      orderId: order._id,
      createdAt: order.createdAt,
      storeName: 'Radhe Stationery',
      storeAddress: '',
      storeCity: '',
      storeState: '',
      storePincode: '',
      storePAN: '',
      storeGST: '',
      storePhone: '',
      storeEmail: '',
      storeLogo: '',
      billingName: order.shippingDetails.name,
      billingAddress: order.shippingDetails.address,
      billingCity: order.shippingDetails.city,
      billingState: order.shippingDetails.state,
      billingPincode: order.shippingDetails.pincode,
      shippingName: order.shippingDetails.name,
      shippingAddress: order.shippingDetails.address,
      shippingCity: order.shippingDetails.city,
      shippingState: order.shippingDetails.state,
      shippingPincode: order.shippingDetails.pincode,
      shippingPhone: order.shippingDetails.phone,
      shippingEmail: order.shippingDetails.email,
      items: order.items.map((item: any) => ({
        name: item.name,
        sku: item.sku,
        quantity: Number(item.quantity || 0),
        priceAtPurchase: Number(item.priceAtPurchase || 0),
        total: Number(item.priceAtPurchase || 0) * Number(item.quantity || 0),
        cgst: item.cgst,
        sgst: item.sgst,
        igst: item.igst,
        taxAmount: 0,
      })),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      cgst: order.cgst || 0,
      sgst: order.sgst || 0,
      igst: order.igst || 0,
      taxRate: 18,
      totalAmount: order.totalAmount,
      paymentMethod: order.payment.method,
      paymentStatus: order.payment.status,
    });

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="invoice-${orderId}.html"`,
      },
    });
  } catch (error: any) {
    console.error('Invoice download error:', error);
    return NextResponse.json(
      { error: 'Failed to download invoice' },
      { status: 500 }
    );
  }
}

function generateInvoiceHTML(data: any): string {
  const amountInWords = (amount: number) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand', 'Lakh', 'Crore'];

    const convertBelowThousand = (num: number): string => {
      if (num === 0) return '';
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
      return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + convertBelowThousand(num % 100) : '');
    };

    let num = Math.floor(amount);
    if (num === 0) return 'Zero';

    let result = '';
    let scaleIndex = 0;

    while (num > 0) {
      const remainder = num % 1000;
      if (remainder !== 0) {
        result = convertBelowThousand(remainder) + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + (result ? ' ' + result : '');
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return result.trim();
  };

  const itemsHTML = data.items
    .map(
      (item: any, idx: number) => {
        const price = Number(item.priceAtPurchase || 0);
        const qty = Number(item.quantity || 0);
        const lineTotal = price * qty;
        const taxAmount = Number(item.taxAmount || 0);
        const total = Number(item.total || lineTotal);
        return `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${idx + 1}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">
        <strong>${item.name}</strong>
        ${item.sku ? `<br/><span style="color: #666; font-size: 12px;">HSN: ${item.sku}</span>` : ''}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">₹${price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${qty}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${lineTotal.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">
        ${item.cgst ? `CGST ${item.cgst}%` : ''}
        ${item.sgst ? `${item.cgst ? ' + ' : ''}SGST ${item.sgst}%` : ''}
        ${item.igst ? `${item.cgst || item.sgst ? ' + ' : ''}IGST ${item.igst}%` : ''}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${taxAmount.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">₹${total.toFixed(2)}</td>
    </tr>
  `
      }
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${data.invoiceNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .invoice-container {
      background-color: white;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
    }
    .store-info h1 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }
    .invoice-title {
      text-align: right;
    }
    .invoice-title h2 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }
    .invoice-title p {
      margin: 5px 0 0 0;
      font-size: 12px;
      color: #666;
    }
    .seller-details {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f9f9f9;
      border-left: 4px solid #333;
    }
    .seller-details strong {
      display: block;
      margin-bottom: 5px;
    }
    .seller-details p {
      margin: 3px 0;
      font-size: 13px;
    }
    .addresses {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    .address-block {
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .address-block strong {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .address-block p {
      margin: 3px 0;
      font-size: 13px;
    }
    .order-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f0f0f0;
      border-radius: 4px;
    }
    .order-details p {
      margin: 5px 0;
      font-size: 13px;
    }
    .order-details strong {
      font-weight: bold;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    table thead {
      background-color: #333;
      color: white;
    }
    table th {
      padding: 12px;
      text-align: left;
      font-weight: bold;
      font-size: 13px;
    }
    table td {
      padding: 10px;
      font-size: 13px;
    }
    .totals {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }
    .totals-box {
      width: 350px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #ddd;
      font-size: 13px;
    }
    .total-row.final {
      border-top: 2px solid #333;
      border-bottom: 2px solid #333;
      font-weight: bold;
      font-size: 16px;
      padding: 12px 0;
    }
    .amount-words {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .amount-words p {
      margin: 5px 0;
      font-size: 13px;
    }
    .amount-words strong {
      font-weight: bold;
    }
    .payment-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
      font-size: 13px;
    }
    .footer {
      border-top: 1px solid #ddd;
      padding-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
      margin-bottom: 30px;
    }
    .signature {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      font-size: 13px;
    }
    .signature-block {
      text-align: center;
    }
    .signature-line {
      border-top: 1px solid #333;
      width: 150px;
      margin: 30px auto 5px;
    }
    @media print {
      body {
        background-color: white;
      }
      .invoice-container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="store-info">
        ${data.storeLogo ? `<img src="${data.storeLogo}" alt="Logo" style="height: 50px; margin-bottom: 10px;">` : ''}
        <h1>${data.storeName}</h1>
      </div>
      <div class="invoice-title">
        <h2>Tax Invoice/Bill of Supply/Cash Memo</h2>
        <p>(Triplicate for Supplier)</p>
      </div>
    </div>

    <!-- Seller Details -->
    <div class="seller-details">
      <strong>Sold By:</strong>
      <p><strong>${data.storeName}</strong></p>
      <p>${data.storeAddress}</p>
      <p>${data.storeCity}, ${data.storeState} ${data.storePincode}</p>
      <p>IN</p>
      ${data.storePAN ? `<p>PAN No: ${data.storePAN}</p>` : ''}
      ${data.storeGST ? `<p>GST Registration No: ${data.storeGST}</p>` : ''}
    </div>

    <!-- Addresses -->
    <div class="addresses">
      <div class="address-block">
        <strong>Billing Address:</strong>
        <p><strong>${data.billingName}</strong></p>
        <p>${data.billingAddress}</p>
        <p>${data.billingCity}, ${data.billingState} ${data.billingPincode}</p>
        <p>IN</p>
        ${data.storeGST ? `<p>State/UT Code: ${data.billingState}</p>` : ''}
      </div>
      <div class="address-block">
        <strong>Shipping Address:</strong>
        <p><strong>${data.shippingName}</strong></p>
        <p>${data.shippingAddress}</p>
        <p>${data.shippingCity}, ${data.shippingState} ${data.shippingPincode}</p>
        <p>IN</p>
        ${data.storeGST ? `<p>State/UT Code: ${data.shippingState}</p>` : ''}
      </div>
    </div>

    <!-- Order Details -->
    <div class="order-details">
      <div>
        <p><strong>Order Number:</strong> ${data.orderId}</p>
        <p><strong>Order Date:</strong> ${new Date(data.createdAt).toLocaleDateString('en-IN')}</p>
      </div>
      <div style="text-align: right;">
        <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
        <p><strong>Invoice Date:</strong> ${new Date(data.createdAt).toLocaleDateString('en-IN')}</p>
      </div>
    </div>

    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th>Sl. No</th>
          <th>Description</th>
          <th>Unit Price</th>
          <th>Qty</th>
          <th>Net Amount</th>
          <th>Tax Rate</th>
          <th>Tax Charges</th>
          <th>Total Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <div class="totals-box">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>₹${data.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Shipping:</span>
          <span>₹${data.shippingCost.toFixed(2)}</span>
        </div>
        ${data.cgst > 0 ? `<div class="total-row"><span>CGST:</span><span>₹${data.cgst.toFixed(2)}</span></div>` : ''}
        ${data.sgst > 0 ? `<div class="total-row"><span>SGST:</span><span>₹${data.sgst.toFixed(2)}</span></div>` : ''}
        ${data.igst > 0 ? `<div class="total-row"><span>IGST:</span><span>₹${data.igst.toFixed(2)}</span></div>` : ''}
        ${data.cgst === 0 && data.sgst === 0 && data.igst === 0 ? `<div class="total-row"><span>Tax:</span><span>₹${data.tax.toFixed(2)}</span></div>` : ''}
        <div class="total-row final">
          <span>TOTAL:</span>
          <span>₹${data.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <!-- Amount in Words -->
    <div class="amount-words">
      <p><strong>Amount in Words:</strong></p>
      <p><strong>${amountInWords(data.totalAmount)} only</strong></p>
    </div>

    <!-- Payment Details -->
    <div class="payment-details">
      <div>
        <p><strong>Payment Method:</strong> ${data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
        <p><strong>Payment Status:</strong> ${data.paymentStatus}</p>
      </div>
      <div style="text-align: right;">
        <p><strong>Place of Supply:</strong> ${data.shippingState}</p>
        <p><strong>Place of Delivery:</strong> ${data.shippingState}</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Whether tax is payable under reverse charge - No</p>
      <p>Thank you for your business!</p>
    </div>

    <!-- Signature -->
    <div class="signature">
      <div class="signature-block">
        <div class="signature-line"></div>
        <p>Authorized Signatory</p>
      </div>
      <div class="signature-block">
        <p>For ${data.storeName}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
