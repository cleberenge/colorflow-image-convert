// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://atzepfeyncuypbfzzuda.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0emVwZmV5bmN1eXBiZnp6dWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTcyNDUsImV4cCI6MjA2NDEzMzI0NX0.pI0w9wejoDoTm4cBVZJypDrUPi8ok3nbqRI3g1OLk_g";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);