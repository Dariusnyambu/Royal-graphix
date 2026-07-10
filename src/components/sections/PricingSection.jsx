import { Check, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeader from '@/components/ui/SectionHeader'
import { PRICING_PLANS } from '@/lib/constants'

export default function PricingSection() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(4rem,8vw,6rem) clamp(1rem,5vw,4rem)' }}>
      <SectionHeader
        tag="Pricing"
        title="Transparent Pricing"
        subtitle="No hidden fees. Choose a plan that fits your growth stage."
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem',
      }}>
        {PRICING_PLANS.map((plan, i) => (
          <div
            key={plan.name}
            className="reveal"
            style={{
              background: 'var(--surface)',
              border: `1px solid ${plan.featured ? 'var(--red)' : 'var(--border)'}`,
              borderRadius: 16, padding: '2rem',
              position: 'relative', overflow: 'hidden',
              transitionDelay: `${i * 0.1}s`,
              transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
              transform: plan.featured ? 'scale(1.02)' : 'none',
            }}
          >
            {plan.featured && (
              <div style={{
                position: 'absolute', top: 16, right: -24,
                background: 'var(--red)', color: 'white',
                fontSize: '0.7rem', fontWeight: 700,
                padding: '4px 36px', transform: 'rotate(45deg)',
                transformOrigin: 'right center', letterSpacing: '0.05em',
              }}>
                Most Popular
              </div>
            )}

            <div style={{
              fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: 'var(--red)', marginBottom: '0.75rem',
            }}>
              {plan.name}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '2.5rem',
              fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.25rem', color: 'var(--text)',
            }}>
              {plan.price}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {plan.period}
            </div>

            <ul style={{ listStyle: 'none', marginBottom: '2rem' }}>
              {plan.features.map(f => (
                <li key={f} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: '0.875rem', padding: '0.4rem 0', color: 'var(--text-muted)',
                }}>
                  <Check size={14} color='var(--red)' strokeWidth={2.5} style={{flexShrink:0}} />
                  {f}
                </li>
              ))}
            </ul>

            <Link to="/contact" style={{ textDecoration: 'none', display: 'block' }}>
              <button style={{
                width: '100%', padding: '0.7rem',
                background: plan.featured ? 'var(--red)' : 'transparent',
                color: plan.featured ? 'white' : 'var(--text)',
                border: plan.featured ? 'none' : '1px solid var(--border)',
                borderRadius: 10, fontWeight: 600, fontSize: '0.9rem',
                cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s',
              }}
                onMouseEnter={e => {
                  if (plan.featured) e.currentTarget.style.background = 'var(--red-dark)'
                  else { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }
                }}
                onMouseLeave={e => {
                  if (plan.featured) e.currentTarget.style.background = 'var(--red)'
                  else { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }
                }}
              >
                Get Started →
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
