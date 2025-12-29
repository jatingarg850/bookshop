import { Card } from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <div className="container-max py-12">
      <h1 className="font-heading text-4xl font-bold mb-8">Terms & Conditions</h1>

      <Card className="space-y-6">
        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">1. Agreement to Terms</h2>
          <p className="text-gray-700">
            By accessing and using the Radhe Stationery website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">2. Use License</h2>
          <p className="text-gray-700">
            Permission is granted to temporarily download one copy of the materials (information or software) on Radhe Stationery's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to decompile or reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">3. Disclaimer</h2>
          <p className="text-gray-700">
            The materials on Radhe Stationery's website are provided on an 'as is' basis. Radhe Stationery makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">4. Limitations</h2>
          <p className="text-gray-700">
            In no event shall Radhe Stationery or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Radhe Stationery's website.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">5. Accuracy of Materials</h2>
          <p className="text-gray-700">
            The materials appearing on Radhe Stationery's website could include technical, typographical, or photographic errors. Radhe Stationery does not warrant that any of the materials on its website are accurate, complete, or current. Radhe Stationery may make changes to the materials contained on its website at any time without notice.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">6. Links</h2>
          <p className="text-gray-700">
            Radhe Stationery has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Radhe Stationery of the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">7. Modifications</h2>
          <p className="text-gray-700">
            Radhe Stationery may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold mb-3">8. Governing Law</h2>
          <p className="text-gray-700">
            These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>
      </Card>
    </div>
  );
}
