import { supabase } from '@/lib/supabase'

export const portfolioService = {
  getAll: () => supabase.from('portfolio').select('*').order('created_at', { ascending: false }),
  getById: (id) => supabase.from('portfolio').select('*').eq('id', id).single(),
  create: (item) => supabase.from('portfolio').insert([item]).select().single(),
  update: (id, updates) => supabase.from('portfolio').update(updates).eq('id', id).select().single(),
  delete: (id) => supabase.from('portfolio').delete().eq('id', id),
  uploadImage: async (file, path) => {
    const { error } = await supabase.storage.from('portfolio-images').upload(path, file, { upsert: true })
    if (error) return { url: null, error }
    const { data: { publicUrl } } = supabase.storage.from('portfolio-images').getPublicUrl(path)
    return { url: publicUrl, error: null }
  },
}
