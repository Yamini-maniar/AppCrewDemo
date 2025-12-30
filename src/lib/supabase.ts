import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'REMOVED';
const SUPABASE_ANON_KEY =
  'REMOVED';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
