import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return null
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)
    return file
  }

  const upload = async (file, folder = 'portfolio', bucket = 'portfolio-images') => {
    if (!file) return { url: null, error: 'No file selected' }
    setUploading(true)
    setError(null)
    try {
      const ext = file.name.split('.').pop()
      const path = `${folder}/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
      if (uploadErr) { setError(uploadErr.message); setUploading(false); return { url: null, error: uploadErr.message } }
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
      setUploading(false)
      return { url: publicUrl, error: null }
    } catch (e) {
      setError(e.message)
      setUploading(false)
      return { url: null, error: e.message }
    }
  }

  const reset = () => { setPreview(null); setError(null) }

  return { uploading, preview, error, handleFileChange, upload, reset }
}
