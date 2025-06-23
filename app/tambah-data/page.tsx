'use client';

import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function TambahDataPage() {
  const [formData, setFormData] = useState({
    nama_tersangka: '',
    lkn: '',
    barang_bukti: '',
    sp_han: '',
    pasal_nomor: '',
    pasal_ayat: '',
    masa_tahanan: '',
    nama_penyidik: '',
    keterangan: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine pasal and ayat
      const pasal = `${formData.pasal_nomor} (${formData.pasal_ayat})`;
      
      const { error } = await supabase
        .from('daftar_tahanan')
        .insert({
          nama_tersangka: formData.nama_tersangka,
          lkn: formData.lkn || null,
          barang_bukti: formData.barang_bukti || null,
          sp_han: formData.sp_han,
          pasal: pasal,
          masa_tahanan: parseInt(formData.masa_tahanan),
          nama_penyidik: formData.nama_penyidik,
          keterangan: formData.keterangan || null
        });

      if (error) throw error;

      setSuccess(true);
      toast.success('Data tahanan berhasil ditambahkan');
      
      // Reset form
      setFormData({
        nama_tersangka: '',
        lkn: '',
        barang_bukti: '',
        sp_han: '',
        pasal_nomor: '',
        pasal_ayat: '',
        masa_tahanan: '',
        nama_penyidik: '',
        keterangan: ''
      });
    } catch (error) {
      console.error('Error adding data:', error);
      toast.error('Gagal menambahkan data tahanan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-blue-600 p-2">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tambah Data Tahanan</h1>
              <p className="text-gray-600">Tambahkan data tahanan narkoba baru ke sistem</p>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl">Form Data Tahanan</CardTitle>
            <CardDescription>
              Isi semua informasi yang diperlukan dengan lengkap dan akurat
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Data tahanan berhasil ditambahkan ke sistem
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nama_tersangka">Nama Tersangka <span className="text-red-500">*</span></Label>
                  <Input
                    id="nama_tersangka"
                    value={formData.nama_tersangka}
                    onChange={(e) => handleInputChange('nama_tersangka', e.target.value)}
                    placeholder="Masukkan nama tersangka"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lkn">LKN (Laporan Kejadian Narkoba)</Label>
                  <Input
                    id="lkn"
                    type="date"
                    value={formData.lkn}
                    onChange={(e) => handleInputChange('lkn', e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barang_bukti">Barang Bukti</Label>
                  <Input
                    id="barang_bukti"
                    value={formData.barang_bukti}
                    onChange={(e) => handleInputChange('barang_bukti', e.target.value)}
                    placeholder="Contoh: 5 Gram Sabu"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sp_han">SP-HAN <span className="text-red-500">*</span></Label>
                  <Input
                    id="sp_han"
                    type="date"
                    value={formData.sp_han}
                    onChange={(e) => handleInputChange('sp_han', e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Melanggar Pasal <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 min-w-12">Pasal</span>
                        <Input
                          value={formData.pasal_nomor}
                          onChange={(e) => handleInputChange('pasal_nomor', e.target.value)}
                          placeholder="114"
                          required
                          className="h-11"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 min-w-12">Ayat</span>
                        <Input
                          value={formData.pasal_ayat}
                          onChange={(e) => handleInputChange('pasal_ayat', e.target.value)}
                          placeholder="1"
                          required
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="masa_tahanan">Masa Tahanan <span className="text-red-500">*</span></Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="masa_tahanan"
                      type="number"
                      value={formData.masa_tahanan}
                      onChange={(e) => handleInputChange('masa_tahanan', e.target.value)}
                      placeholder="20"
                      required
                      min="1"
                      className="h-11"
                    />
                    <span className="text-sm font-medium text-gray-700 min-w-12">Hari</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nama_penyidik">Nama Penyidik <span className="text-red-500">*</span></Label>
                  <Input
                    id="nama_penyidik"
                    value={formData.nama_penyidik}
                    onChange={(e) => handleInputChange('nama_penyidik', e.target.value)}
                    placeholder="Masukkan nama penyidik"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keterangan">Keterangan</Label>
                  <Select onValueChange={(value) => handleInputChange('keterangan', value)} value={formData.keterangan}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Pilih keterangan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sidik">Sidik</SelectItem>
                      <SelectItem value="tahap 1">Tahap 1</SelectItem>
                      <SelectItem value="tahap 2">Tahap 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      nama_tersangka: '',
                      lkn: '',
                      barang_bukti: '',
                      sp_han: '',
                      pasal_nomor: '',
                      pasal_ayat: '',
                      masa_tahanan: '',
                      nama_penyidik: '',
                      keterangan: ''
                    });
                    setSuccess(false);
                  }}
                  disabled={loading}
                  className="h-11 px-6"
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-8 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Menyimpan...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Tambahkan</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}