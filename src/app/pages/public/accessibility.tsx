export function AccessibilityPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Accessibility Statement
          </h1>
          <p className="text-lg text-muted-foreground">
            Tech Derby is committed to ensuring digital accessibility for all members,
            partners, and visitors. We strive to meet WCAG 2.2 Level AA standards.
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
                We believe technology should be accessible to everyone, regardless of
                ability. This commitment extends to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Our website and digital platforms</li>
                <li>Physical event venues and spaces</li>
                <li>Communication materials and content</li>
                <li>Community programmes and activities</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Website Accessibility
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Our website is designed with the following accessibility features:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Keyboard Navigation:</strong> Full functionality accessible via keyboard</li>
                <li><strong>Screen Reader Compatibility:</strong> Semantic HTML and ARIA labels</li>
                <li><strong>Color Contrast:</strong> Minimum 4.5:1 contrast ratio for text</li>
                <li><strong>Resizable Text:</strong> Content remains readable when text size is increased</li>
                <li><strong>Focus Indicators:</strong> Clear visual focus states for all interactive elements</li>
                <li><strong>Alternative Text:</strong> Descriptive alt text for all images</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Event Accessibility
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                We work to ensure our events are accessible:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Wheelchair accessible venues</li>
                <li>BSL interpretation available upon request</li>
                <li>Quiet spaces for those who need them</li>
                <li>Dietary requirements accommodated</li>
                <li>Clear signage and wayfinding</li>
                <li>Live captions for presentations (where possible)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Standards Compliance
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Our website aims to conform to the Web Content Accessibility Guidelines
                (WCAG) 2.2 Level AA. We regularly audit our platform and work to address
                any identified issues.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Feedback and Support
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                We welcome feedback on the accessibility of Tech Derby. If you encounter
                accessibility barriers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email us at: <a href="mailto:accessibility@techderby.io" className="text-primary hover:underline">accessibility@techderby.io</a></li>
                <li>Contact us through our <a href="/contact" className="text-primary hover:underline">contact form</a></li>
                <li>Speak to a team member at any event</li>
              </ul>
              <p className="mt-4">
                We aim to respond to accessibility feedback within 5 working days and
                strive to resolve issues as quickly as possible.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ongoing Improvements
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Accessibility is an ongoing journey. We are committed to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Regular accessibility audits and testing</li>
                <li>Training for team members and volunteers</li>
                <li>Incorporating accessibility into our design process</li>
                <li>Listening to and learning from our community</li>
              </ul>
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
