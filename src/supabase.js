import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zjjnrwdkzhuutiqbkzlh.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_lKJBxlraGSkkDDnZJ1VprA_vRYJLkbx'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
