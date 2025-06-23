import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          password: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password?: string;
          name?: string;
          created_at?: string;
        };
      };
      daftar_tahanan: {
        Row: {
          id: number;
          nama_tersangka: string;
          lkn: string | null;
          barang_bukti: string | null;
          sp_han: string;
          pasal: string;
          masa_tahanan: number;
          nama_penyidik: string;
          keterangan: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          nama_tersangka: string;
          lkn?: string | null;
          barang_bukti?: string | null;
          sp_han: string;
          pasal: string;
          masa_tahanan: number;
          nama_penyidik: string;
          keterangan?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          nama_tersangka?: string;
          lkn?: string | null;
          barang_bukti?: string | null;
          sp_han?: string;
          pasal?: string;
          masa_tahanan?: number;
          nama_penyidik?: string;
          keterangan?: string | null;
          created_at?: string;
        };
      };
    };
  };
};