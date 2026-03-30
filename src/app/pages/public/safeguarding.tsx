export function SafeguardingPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Safeguarding Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Tech Derby is committed to creating a safe, welcoming environment for all
            community members, especially young people and vulnerable adults.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Our Commitment
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                We recognize our responsibility to safeguard the welfare of all participants
                in our community, particularly:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Young people under 18</li>
                <li>Students and early-career professionals</li>
                <li>Vulnerable adults</li>
                <li>Anyone who may be at risk</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Safe Event Environment
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                We ensure our events are safe through:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Designated Safeguarding Officers:</strong> Trained team members present at all events</li>
                <li><strong>Venue Selection:</strong> Safe, accessible, and appropriate venues</li>
                <li><strong>Adult Supervision:</strong> Appropriate adult-to-young person ratios</li>
                <li><strong>Clear Policies:</strong> Code of Conduct enforced at all events</li>
                <li><strong>Emergency Procedures:</strong> Clear protocols for incidents</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Volunteer and Speaker Safeguarding
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                All volunteers and speakers working with young people:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Complete safeguarding training</li>
                <li>Agree to our Code of Conduct</li>
                <li>Undergo DBS checks where appropriate</li>
                <li>Receive clear guidance on appropriate behavior</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Online Safety
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                For our digital community platforms:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Moderated community spaces</li>
                <li>Privacy settings and controls</li>
                <li>Reporting mechanisms for inappropriate content</li>
                <li>Guidelines for safe online interaction</li>
                <li>No unsupervised private messaging with minors</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Parental Consent
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                For participants under 18:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Parental/guardian consent required for membership and event attendance</li>
                <li>Parents informed of event details and timings</li>
                <li>Emergency contact information collected</li>
                <li>Photography/media consent obtained separately</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Recognizing and Reporting Concerns
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                We train our team to recognize signs of:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Physical, emotional, or sexual abuse</li>
                <li>Neglect or exploitation</li>
                <li>Bullying or harassment</li>
                <li>Radicalization or extremism</li>
              </ul>
              <p className="mt-4">
                <strong>If you have concerns about a young person or vulnerable adult,
                please contact:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Our Designated Safeguarding Officer: <a href="mailto:safeguarding@techderby.io" className="text-primary hover:underline">safeguarding@techderby.io</a></li>
                <li>In emergencies, contact the police on 999</li>
                <li>For non-emergency concerns, contact local authorities</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Confidentiality and Information Sharing
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                We maintain confidentiality, but will share information with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Relevant authorities when required to protect a child or vulnerable adult</li>
                <li>Parents/guardians when appropriate</li>
                <li>Other safeguarding professionals on a need-to-know basis</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Policy Review
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                This safeguarding policy is reviewed annually and updated in line with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Changes in legislation</li>
                <li>Best practice guidance</li>
                <li>Lessons learned from incidents</li>
                <li>Feedback from the community</li>
              </ul>
            </div>
          </section>

          <section className="bg-primary/10 border border-primary/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-foreground mb-3">
              Report a Concern
            </h3>
            <p className="text-muted-foreground mb-4">
              If you have any safeguarding concerns, please contact us immediately:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> <a href="mailto:safeguarding@techderby.io" className="text-primary hover:underline">safeguarding@techderby.io</a></p>
              <p><strong>In-person:</strong> Speak to any Tech Derby team member at an event</p>
              <p><strong>Emergency:</strong> Call 999 or contact local safeguarding authorities</p>
            </div>
          </section>

          <section className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground">
              Last updated: March 7, 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
