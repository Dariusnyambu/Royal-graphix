import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Monitor, Palette, Layout, Search, Pen, BarChart2, Megaphone, Upload, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { SERVICES } from '@/lib/constants'
import { useServiceImages, DEFAULT_SERVICE_IMAGES } from '@/hooks/useServiceImages'
import { useImageUpload } from '@/hooks/useImageUpload'
import Skeleton from '@/components/ui/Skeleton'

const SERVICE_ICONS = {
  'web-design':    Monitor,
  'graphic-design':Palette,
  'ui-ux':         Layout,
  'seo':           Search,
  'branding':      Pen,
  'analytics':     BarChart2,
  'social-media-management': Megaphone,
}

export default function AdminServices() {
  const { images, loading, setImage, resetImage } = useServiceImages()
  const { upload } = useImageUpload()
  const [savingSlug, setSavingSlug] = useState(null)

  const handleFile = async (slug, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSavingSlug(slug)
    const { url, error } = await upload(file, 'services', 'service-images')
    if (error) { toast.error('Image upload failed'); setSavingSlug(null); return }
    const { error: saveErr } = await setImage(slug, url)
    setSavingSlug(null)
    if (saveErr) { toast.error('Could not save image'); return }
    toast.success('Service image updated')
    e.target.value = ''
  }

  const handleReset = async (slug) => {
    const { error } = await resetImage(slug)
    if (error) { toast.error('Could not reset image'); return }
    toast.success('Reverted to default image')
  }

  return (
    <>
      <Helmet><title>Services — Royal Graphix Admin</title></Helmet>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>Service Images</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
          Change the image shown for each service on the public Services section.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} height={220} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {SERVICES.map(service => {
            const Icon = SERVICE_ICONS[service.slug] || Monitor
            const isCustom = images[service.slug] !== DEFAULT_SERVICE_IMAGES[service.slug]
            const isSaving = savingSlug === service.slug
            return (
              <div key={service.slug} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ height: 150, position: 'relative', overflow: 'hidden', background: 'var(--bg2)' }}>
                  <img src={images[service.slug]} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isSaving ? 0.5 : 1 }} />
                  <div style={{ position: 'absolute', bottom: 10, left: 10, width: 34, height: 34, borderRadius: 9, background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} color="white" strokeWidth={1.8} />
                  </div>
                  {isCustom && (
                    <div style={{ position: 'absolute', top: 10, right: 10, padding: '2px 9px', borderRadius: 100, background: 'rgba(16,185,129,0.9)', fontSize: '0.65rem', fontWeight: 700, color: 'white', textTransform: 'uppercase' }}>Custom</div>
                  )}
                </div>
                <div style={{ padding: '1.1rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.9rem' }}>{service.title}</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <label style={{ flex: 1, textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'var(--red)', color: 'white', border: 'none', padding: '0.55rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      <Upload size={13} /> {isSaving ? 'Uploading…' : 'Replace'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(service.slug, e)} disabled={isSaving} />
                    </label>
                    {isCustom && (
                      <button onClick={() => handleReset(service.slug)} title="Reset to default" style={{ width: 36, border: '1px solid var(--border)', background: 'transparent', borderRadius: 8, cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RotateCcw size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
