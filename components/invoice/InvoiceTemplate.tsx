'use client';

import React from 'react';

interface InvoiceItem {
  name: string;
  sku?: string;
  quantity: number;
  priceAtPurchase: number;
  total: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  taxAmount?: number;
}

interface InvoiceData {
  invoiceNumber: string;
  orderId: string;
  createdAt: string;
  storeName: string;
  storeAddress: string;
  storeCity: string;
  storeState: string;
  storePincode: string;
  storePAN?: string;
  storeGST?: string;
  storePhone?: string;
  storeEmail?: string;
  storeLogo?: string;
  billingName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPincode: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  shippingPhone: string;
  shippingEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  cgst: number;
  sgst: number;
  igst: number;
  taxRate: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
}

export const InvoiceTemplate = React.forwardRef<HTMLDivElement, { data: InvoiceData }>(
  ({ data }, ref) => {
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

    return (
      <div
        ref={ref}
        className="bg-white p-8 font-sans text-sm"
        style={{ width: '210mm', margin: '0 auto' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            {data.storeLogo && (
              <img src={data.storeLogo} alt="Store Logo" className="h-12 mb-2" />
            )}
            <h1 className="text-2xl font-bold">{data.storeName}</h1>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">Tax Invoice/Bill of Supply/Cash Memo</h2>
            <p className="text-xs text-gray-600">(Triplicate for Supplier)</p>
          </div>
        </div>

        {/* Seller Details */}
        <div className="mb-6 pb-4 border-b">
          <p className="font-bold mb-1">Sold By:</p>
          <p className="font-semibold">{data.storeName}</p>
          <p className="text-xs">{data.storeAddress}</p>
          <p className="text-xs">{data.storeCity}, {data.storeState} {data.storePincode}</p>
          <p className="text-xs">IN</p>
          {data.storePAN && <p className="text-xs mt-1">PAN No: {data.storePAN}</p>}
          {data.storeGST && <p className="text-xs">GST Registration No: {data.storeGST}</p>}
        </div>

        {/* Billing & Shipping */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <p className="font-bold mb-2">Billing Address:</p>
            <p className="text-xs font-semibold">{data.billingName}</p>
            <p className="text-xs">{data.billingAddress}</p>
            <p className="text-xs">{data.billingCity}, {data.billingState} {data.billingPincode}</p>
            <p className="text-xs">IN</p>
            {data.storeGST && <p className="text-xs mt-1">State/UT Code: {data.billingState}</p>}
          </div>
          <div>
            <p className="font-bold mb-2">Shipping Address:</p>
            <p className="text-xs font-semibold">{data.shippingName}</p>
            <p className="text-xs">{data.shippingAddress}</p>
            <p className="text-xs">{data.shippingCity}, {data.shippingState} {data.shippingPincode}</p>
            <p className="text-xs">IN</p>
            {data.storeGST && <p className="text-xs mt-1">State/UT Code: {data.shippingState}</p>}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-2 gap-8 mb-6 bg-gray-50 p-4">
          <div>
            <p className="text-xs"><strong>Order Number:</strong> {data.orderId}</p>
            <p className="text-xs"><strong>Order Date:</strong> {new Date(data.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
          <div className="text-right">
            <p className="text-xs"><strong>Invoice Number:</strong> {data.invoiceNumber}</p>
            <p className="text-xs"><strong>Invoice Date:</strong> {new Date(data.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-6 border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-400">
              <th className="text-left py-2 px-2 text-xs font-bold">Sl. No</th>
              <th className="text-left py-2 px-2 text-xs font-bold">Description</th>
              <th className="text-center py-2 px-2 text-xs font-bold">Unit Price</th>
              <th className="text-center py-2 px-2 text-xs font-bold">Qty</th>
              <th className="text-right py-2 px-2 text-xs font-bold">Net Amount</th>
              <th className="text-center py-2 px-2 text-xs font-bold">Tax Rate</th>
              <th className="text-right py-2 px-2 text-xs font-bold">Tax Charges</th>
              <th className="text-right py-2 px-2 text-xs font-bold">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => {
              const itemTax = item.taxAmount || 0;
              return (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="py-2 px-2 text-xs">{idx + 1}</td>
                  <td className="py-2 px-2 text-xs">
                    <p className="font-semibold">{item.name}</p>
                    {item.sku && <p className="text-gray-600">HSN: {item.sku}</p>}
                  </td>
                  <td className="text-center py-2 px-2 text-xs">₹{item.priceAtPurchase.toFixed(2)}</td>
                  <td className="text-center py-2 px-2 text-xs">{item.quantity}</td>
                  <td className="text-right py-2 px-2 text-xs">₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</td>
                  <td className="text-center py-2 px-2 text-xs">
                    {item.cgst ? `CGST ${item.cgst}%` : ''}
                    {item.sgst ? `${item.cgst ? ' + ' : ''}SGST ${item.sgst}%` : ''}
                    {item.igst ? `${item.cgst || item.sgst ? ' + ' : ''}IGST ${item.igst}%` : ''}
                  </td>
                  <td className="text-right py-2 px-2 text-xs">₹{itemTax.toFixed(2)}</td>
                  <td className="text-right py-2 px-2 text-xs font-semibold">₹{item.total.toFixed(2)}</td>
                </tr>
              );
            })}
            {data.shippingCost > 0 && (
              <tr className="border-b border-gray-300">
                <td colSpan={2} className="py-2 px-2 text-xs font-semibold">Shipping Charges</td>
                <td className="text-center py-2 px-2 text-xs">₹{data.shippingCost.toFixed(2)}</td>
                <td className="text-center py-2 px-2 text-xs">1</td>
                <td className="text-right py-2 px-2 text-xs">₹{data.shippingCost.toFixed(2)}</td>
                <td className="text-center py-2 px-2 text-xs">0% GST</td>
                <td className="text-right py-2 px-2 text-xs">₹0.00</td>
                <td className="text-right py-2 px-2 text-xs font-semibold">₹{data.shippingCost.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-80">
            <div className="flex justify-between py-2 border-t border-gray-400">
              <span className="text-xs font-semibold">Subtotal:</span>
              <span className="text-xs">₹{data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-xs font-semibold">Shipping:</span>
              <span className="text-xs">₹{data.shippingCost.toFixed(2)}</span>
            </div>
            {data.cgst > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-xs font-semibold">CGST:</span>
                <span className="text-xs">₹{data.cgst.toFixed(2)}</span>
              </div>
            )}
            {data.sgst > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-xs font-semibold">SGST:</span>
                <span className="text-xs">₹{data.sgst.toFixed(2)}</span>
              </div>
            )}
            {data.igst > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-xs font-semibold">IGST:</span>
                <span className="text-xs">₹{data.igst.toFixed(2)}</span>
              </div>
            )}
            {data.cgst === 0 && data.sgst === 0 && data.igst === 0 && (
              <div className="flex justify-between py-2">
                <span className="text-xs font-semibold">Tax:</span>
                <span className="text-xs">₹{data.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-t-2 border-gray-300 font-bold text-lg">
              <span>TOTAL:</span>
              <span>₹{data.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="mb-6 p-3 bg-gray-50 border border-gray-300">
          <p className="text-xs font-semibold">Amount in Words:</p>
          <p className="text-xs font-bold">{amountInWords(data.totalAmount)} only</p>
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-2 gap-8 mb-6 text-xs">
          <div>
            <p><strong>Payment Method:</strong> {data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            <p><strong>Payment Status:</strong> {data.paymentStatus}</p>
          </div>
          <div className="text-right">
            <p><strong>Place of Supply:</strong> {data.shippingState}</p>
            <p><strong>Place of Delivery:</strong> {data.shippingState}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 text-center text-xs text-gray-600">
          <p>Whether tax is payable under reverse charge - No</p>
          <p className="mt-2">Thank you for your business!</p>
        </div>

        {/* Signature */}
        <div className="mt-8 text-right">
          <p className="text-xs">For {data.storeName}:</p>
          <div className="h-12 mt-2"></div>
          <p className="text-xs font-semibold">Authorized Signatory</p>
        </div>
      </div>
    );
  }
);

InvoiceTemplate.displayName = 'InvoiceTemplate';
