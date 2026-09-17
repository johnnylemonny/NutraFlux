import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import type { Translations } from '@/locales/en'

interface FaqSectionProps {
  t: Translations
  className?: string
}

export function FaqSection({ t, className = '' }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
  ]

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className={`relative overflow-hidden rounded-4xl border border-(--border-soft) bg-(--surface-elevated) p-6 sm:p-10 shadow-xs ${className}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-(--tone-soft-surface) text-(--tone-strong)">
            <HelpCircle className="size-6" />
          </div>
          <h2
            id="faq-title"
            className="text-2xl font-bold tracking-tight text-(--foreground) sm:text-3xl"
          >
            {t.faq.title}
          </h2>
          <p className="mt-2 text-sm text-(--muted-foreground)">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-(--border-soft) bg-(--surface-subtle) transition-colors hover:border-(--border-strong)"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-(--foreground) transition active:scale-[0.99] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-(--muted-foreground) transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-(--tone-strong)' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-sm leading-relaxed text-(--muted-foreground) border-t border-(--border-soft)/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
