import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Defaults — used until an admin overrides a service's image.
export const DEFAULT_SERVICE_IMAGES = {
  'web-design':     'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=75&fit=crop',
  'graphic-design': 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=75&fit=crop',
  'ui-ux':          'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=75&fit=crop',
  'seo':            'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=600&q=75&fit=crop',
  'branding':       'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=75&fit=crop',
  'analytics':      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=75&fit=crop',
  'social-media-management': 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=75&fit=crop',
}

export function useServiceImages() {
  const [images, setImages] = useState(DEFAULT_SERVICE_IMAGES)
  const [loading, setLoading] = useState(true)

  const fetchImages = async () => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase.from('service_images').select('*')
      if (!err && data && data.length > 0) {
        const map = { ...DEFAULT_SERVICE_IMAGES }
        data.forEach(row => { map[row.slug] = row.image_url })
        setImages(map)
      }
    } catch { /* keep defaults */ }
    setLoading(false)
  }

  useEffect(() => { fetchImages() }, [])

  // Admin — set (or replace) the image for a given service slug.
  const setImage = async (slug, image_url) => {
    try {
      const { data, error: err } = await supabase
        .from('service_images')
        .upsert({ slug, image_url }, { onConflict: 'slug' })
        .select().single()
      if (!err) setImages(prev => ({ ...prev, [slug]: image_url }))
      return { data, error: err }
    } catch (e) { return { data: null, error: { message: e.message } } }
  }

  // Admin — remove the override, reverting to the default image.
  const resetImage = async (slug) => {
    try {
      const { error: err } = await supabase.from('service_images').delete().eq('slug', slug)
      if (!err) setImages(prev => ({ ...prev, [slug]: DEFAULT_SERVICE_IMAGES[slug] }))
      return { error: err }
    } catch (e) { return { error: { message: e.message } } }
  }

  return { images, loading, refetch: fetchImages, setImage, resetImage }
}
