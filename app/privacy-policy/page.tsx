import { Card } from '@/components/ui/Card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container-max py-12">
      <h1 className="font-heading text-4xl font-bold mb-8">Privacy Policy</h1>

      <Card className="space-y-6">
        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">1. Introduction</h2>
          <p className="text-gray-700">
            Radhe Stationery ("we", "us", "our", or "Company") operates the radhestationery.com website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">2. Information Collection and Use</h2>
          <p className="text-gray-700 mb-3">
            We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Personal Data: Name, email address, phone number, shipping address</li>
            <li>Payment Information: Credit card details (processed securely through Razorpay)</li>
            <li>Usage Data: Browser type, IP address, pages visited, time spent</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">3. Use of Data</h2>
          <p className="text-gray-700">
            Radhe Stationery uses the collected data for various purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information to improve our Service</li>
            <li>To monitor the usage of our Service</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">4. Security of Data</h2>
          <p className="text-gray-700">
            The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">5. Changes to This Privacy Policy</h2>
          <p className="text-gray-700">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">6. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at support@radhestationery.com
          </p>
        </section>
      </Card>
    </div>
  );
}
