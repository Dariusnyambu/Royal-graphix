import { supabase } from '@/lib/supabase'

export const contactsService = {
  getAll: () => supabase.from('contacts').select('*').order('created_at', { ascending: false }),
  create: (contact) => supabase.from('contacts').insert([contact]).select().single(),
  delete: (id) => supabase.from('contacts').delete().eq('id', id),
}
