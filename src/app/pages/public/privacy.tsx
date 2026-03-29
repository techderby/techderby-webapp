export function PrivacyPage() {
  return (
    <div className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-600 mb-8">Last updated: February 19, 2026</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Introduction</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Tech Derby ("we", "our", or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, and safeguard your personal information.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed mb-4">We collect information that you provide directly to us, including:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
            <li>Name and contact information</li>
            <li>Professional information (job title, company, skills)</li>
            <li>Event registration and attendance data</li>
            <li>Communications with us</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
            <li>Provide and improve our services</li>
            <li>Send you updates about events and programmes</li>
            <li>Facilitate networking within the community</li>
            <li>Respond to your inquiries</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Data Protection</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We implement appropriate technical and organizational measures to protect your personal data 
            against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Your Rights</h2>
          <p className="text-gray-600 leading-relaxed mb-4">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at privacy@techderby.org
          </p>
        </div>
      </div>
    </div>
  );
}
