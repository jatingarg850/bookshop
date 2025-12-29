import { Card } from '@/components/ui/Card';

export default function ReturnPolicyPage() {
  return (
    <div className="container-max py-12">
      <h1 className="font-heading text-4xl font-bold mb-8">Return Policy</h1>

      <Card className="space-y-6">
        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">30-Day Return Guarantee</h2>
          <p className="text-gray-700">
            At Radhe Stationery, we want you to be completely satisfied with your purchase. If you're not happy with any item, you can return it within 30 days of delivery for a full refund or exchange.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">Return Conditions</h2>
          <p className="text-gray-700 mb-3">Items must meet the following conditions to be eligible for return:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Unused and in original condition</li>
            <li>In original packaging with all accessories</li>
            <li>Returned within 30 days of delivery</li>
            <li>With proof of purchase (order number)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">How to Return</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Contact our support team at support@radhestationery.com</li>
            <li>Provide your order number and reason for return</li>
            <li>Pack the item securely in its original packaging</li>
            <li>Ship it to the address provided by our support team</li>
            <li>Once received and inspected, we'll process your refund</li>
          </ol>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">Refund Processing</h2>
          <p className="text-gray-700">
            Refunds are processed within 7-10 business days after we receive and inspect your returned item. The refund will be credited to your original payment method.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">Non-Returnable Items</h2>
          <p className="text-gray-700">
            The following items cannot be returned:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
            <li>Used or damaged items</li>
            <li>Items without original packaging</li>
            <li>Items returned after 30 days</li>
            <li>Customized or personalized items</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">Contact Us</h2>
          <p className="text-gray-700">
            For any questions about returns, please contact us at support@radhestationery.com
          </p>
        </section>
      </Card>
    </div>
  );
}
