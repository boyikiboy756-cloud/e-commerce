import { Header } from '@/components/header'
import { ADMIN_EMAIL, SITE_NAME } from '@/lib/site'

const faqs = [
  {
    question: 'How do I choose the right fragrance for me?',
    answer: 'Take our Discovery Quiz to get personalized recommendations based on your preferences, or browse our collections to explore different scent families.',
  },
  {
    question: 'What is the difference between Eau de Parfum and Eau de Toilette?',
    answer: 'Eau de Parfum has a higher fragrance concentration (15-20%) and lasts longer, typically 6-8 hours. Eau de Toilette has a lower concentration (5-15%) and lasts about 3-5 hours.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5-7 business days. We also offer express shipping (2-3 business days) at checkout.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with your purchase, you can return it within 30 days for a full refund.',
  },
  {
    question: 'Are your fragrances cruelty-free?',
    answer: `Yes, all ${SITE_NAME} fragrances are cruelty-free and made with ethically sourced ingredients.`,
  },
  {
    question: 'How should I store my fragrance?',
    answer: 'Store fragrances in a cool, dark place away from direct sunlight. Keep the bottle sealed when not in use to preserve the scent.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-foreground/60">
            Find answers to common questions about our products and services
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-serif text-lg text-foreground mb-3">
                {faq.question}
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center bg-muted rounded-lg p-12">
          <h2 className="font-serif text-2xl text-foreground mb-4">
            Still have questions?
          </h2>
          <p className="text-foreground/70 mb-6">
            Our customer support team is here to help
          </p>
          <a
            href={`mailto:${ADMIN_EMAIL}`}
            className="inline-flex px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
          >
            Email {SITE_NAME}
          </a>
        </div>
      </div>
    </div>
  )
}
