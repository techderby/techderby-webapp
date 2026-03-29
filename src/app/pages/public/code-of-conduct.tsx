export function CodeOfConductPage() {
  return (
    <div className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Code of Conduct</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            Tech Derby is committed to providing a welcoming, safe, and inclusive environment for all members.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Our Pledge</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We pledge to make participation in our community a harassment-free experience for everyone, 
            regardless of age, body size, disability, ethnicity, gender identity and expression, 
            level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Expected Behavior</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
            <li>Be respectful and considerate</li>
            <li>Be collaborative and supportive</li>
            <li>Be mindful of your words and actions</li>
            <li>Accept constructive criticism gracefully</li>
            <li>Focus on what is best for the community</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Unacceptable Behavior</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
            <li>Harassment, intimidation, or discrimination</li>
            <li>Offensive comments or personal attacks</li>
            <li>Unwelcome sexual attention or advances</li>
            <li>Trolling or sustained disruption</li>
            <li>Publishing others' private information</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Enforcement</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Violations of this Code of Conduct may result in removal from events, 
            temporary suspension, or permanent ban from the community.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Reporting</h2>
          <p className="text-gray-600 leading-relaxed">
            If you experience or witness unacceptable behavior, please report it to conduct@techderby.org
          </p>
        </div>
      </div>
    </div>
  );
}
