'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { List, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Tahanan {
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
}

export default function DaftarTahananPage() {
  const [tahanan, setTahanan] = useState<Tahanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTahanan, setEditingTahanan] = useState<Tahanan | null>(null);
  const [editForm, setEditForm] = useState({
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchTahanan();
  }, []);

  const fetchTahanan = async () => {
    try {
      const { data, error } = await supabase
        .from('daftar_tahanan')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTahanan(data || []);
    } catch (error) {
      console.error('Error fetching tahanan:', error);
      toast.error('Gagal mengambil data tahanan');
    } finally {
      setLoading(false);
    }
  };

  const calculateRemainingDays = (spHan: string, masaTahanan: number) => {
    const spHanDate = new Date(spHan);
    const endDate = new Date(spHanDate);
    endDate.setDate(endDate.getDate() + masaTahanan);
    
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('daftar_tahanan')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTahanan(prev => prev.filter(t => t.id !== id));
      toast.success('Data tahanan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting tahanan:', error);
      toast.error('Gagal menghapus data tahanan');
    }
  };

  const handleEdit = (tahanan: Tahanan) => {
    const [pasal_nomor, pasal_ayat] = tahanan.pasal.split(' (');
    setEditForm({
      nama_tersangka: tahanan.nama_tersangka,
      lkn: tahanan.lkn || '',
      barang_bukti: tahanan.barang_bukti || '',
      sp_han: tahanan.sp_han,
      pasal_nomor: pasal_nomor,
      pasal_ayat: pasal_ayat?.replace(')', '') || '',
      masa_tahanan: tahanan.masa_tahanan.toString(),
      nama_penyidik: tahanan.nama_penyidik,
      keterangan: tahanan.keterangan || ''
    });
    setEditingTahanan(tahanan);
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingTahanan) return;

    try {
      const pasal = `${editForm.pasal_nomor} (${editForm.pasal_ayat})`;
      
      const { error } = await supabase
        .from('daftar_tahanan')
        .update({
          nama_tersangka: editForm.nama_tersangka,
          lkn: editForm.lkn || null,
          barang_bukti: editForm.barang_bukti || null,
          sp_han: editForm.sp_han,
          pasal: pasal,
          masa_tahanan: parseInt(editForm.masa_tahanan),
          nama_penyidik: editForm.nama_penyidik,
          keterangan: editForm.keterangan || null
        })
        .eq('id', editingTahanan.id);

      if (error) throw error;

      setEditDialogOpen(false);
      fetchTahanan();
      toast.success('Data tahanan berhasil diupdate');
    } catch (error) {
      console.error('Error updating tahanan:', error);
      toast.error('Gagal mengupdate data tahanan');
    }
  };

  const filteredTahanan = tahanan.filter(t =>
    t.nama_tersangka.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.nama_penyidik.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.pasal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mobile-header">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2">
              <List className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Daftar Tahanan</h1>
              <p className="text-sm md:text-base text-gray-600">Kelola data tahanan narkoba</p>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0 mobile-card">
          <CardHeader className="xs-mobile-header">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg md:text-xl">Data Tahanan Narkoba</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Total {filteredTahanan.length} tahanan terdaftar
                </CardDescription>
              </div>
              <div className="w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama tersangka, penyidik, atau pasal..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full md:w-80 h-11 md:h-12 mobile-search touch-input ios-input android-input xs-mobile-input"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="xs-mobile-padding">
            <div className="mobile-table-container">
              <Table className="mobile-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs md:text-sm">No</TableHead>
                    <TableHead className="text-xs md:text-sm">Nama Tersangka</TableHead>
                    <TableHead className="text-xs md:text-sm">LKN</TableHead>
                    <TableHead className="text-xs md:text-sm">Barang Bukti</TableHead>
                    <TableHead className="text-xs md:text-sm">SP-HAN</TableHead>
                    <TableHead className="text-xs md:text-sm">Pasal</TableHead>
                    <TableHead className="text-xs md:text-sm">Masa Tahanan</TableHead>
                    <TableHead className="text-xs md:text-sm">Sisa Hari</TableHead>
                    <TableHead className="text-xs md:text-sm">Penyidik</TableHead>
                    <TableHead className="text-xs md:text-sm">Keterangan</TableHead>
                    <TableHead className="text-center text-xs md:text-sm">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTahanan.map((t, index) => {
                    const remainingDays = calculateRemainingDays(t.sp_han, t.masa_tahanan);
                    return (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium text-xs md:text-sm mobile-table-cell">{index + 1}</TableCell>
                        <TableCell className="font-medium text-xs md:text-sm mobile-table-cell">{t.nama_tersangka}</TableCell>
                        <TableCell className="text-xs md:text-sm mobile-table-cell">
                          {t.lkn ? new Date(t.lkn).toLocaleDateString('id-ID') : '-'}
                        </TableCell>
                        <TableCell className="text-xs md:text-sm mobile-table-cell">{t.barang_bukti || '-'}</TableCell>
                        <TableCell className="text-xs md:text-sm mobile-table-cell">
                          {new Date(t.sp_han).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell className="text-xs md:text-sm mobile-table-cell">{t.pasal}</TableCell>
                        <TableCell className="text-xs md:text-sm mobile-table-cell">{t.masa_tahanan} Hari</TableCell>
                        <TableCell className="mobile-table-cell">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium mobile-status-badge ${
                            remainingDays > 7 
                              ? 'bg-green-100 text-green-800' 
                              : remainingDays > 0 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {remainingDays > 0 ? `${remainingDays} Hari` : 'Selesai'}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs md:text-sm mobile-table-cell">{t.nama_penyidik}</TableCell>
                        <TableCell className="mobile-table-cell">
                          {t.keterangan && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mobile-status-badge">
                              {t.keterangan}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="mobile-table-cell">
                          <div className="flex items-center justify-center gap-1 md:gap-2 mobile-action-buttons">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(t)}
                              className="h-8 w-8 p-0 touch-button"
                            >
                              <Edit className="h-3 w-3 md:h-4 md:w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200 touch-button"
                                >
                                  <Trash2 className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="mobile-dialog">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-lg md:text-xl">Hapus Data Tahanan</AlertDialogTitle>
                                  <AlertDialogDescription className="text-sm md:text-base">
                                    Apakah Anda yakin ingin menghapus data tahanan <strong>{t.nama_tersangka}</strong>? 
                                    Tindakan ini tidak dapat dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col md:flex-row gap-2">
                                  <AlertDialogCancel className="w-full md:w-auto touch-button">Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(t.id)}
                                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 touch-button"
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filteredTahanan.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-sm md:text-base">
                    {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data tahanan'}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-4xl mobile-dialog">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">Edit Data Tahanan</DialogTitle>
              <DialogDescription className="text-sm md:text-base">
                Ubah informasi tahanan yang diperlukan
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 mobile-form-grid">
              <div className="space-y-2">
                <Label htmlFor="edit_nama_tersangka" className="text-sm md:text-base">Nama Tersangka</Label>
                <Input
                  id="edit_nama_tersangka"
                  value={editForm.nama_tersangka}
                  onChange={(e) => setEditForm(prev => ({ ...prev, nama_tersangka: e.target.value }))}
                  className="h-11 md:h-12 touch-input ios-input android-input xs-mobile-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_lkn" className="text-sm md:text-base">LKN</Label>
                <Input
                  id="edit_lkn"
                  type="date"
                  value={editForm.lkn}
                  onChange={(e) => setEditForm(prev => ({ ...prev, lkn: e.target.value }))}
                  className="h-11 md:h-12 touch-input ios-input android-input xs-mobile-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_barang_bukti" className="text-sm md:text-base">Barang Bukti</Label>
                <Input
                  id="edit_barang_bukti"
                  value={editForm.barang_bukti}
                  onChange={(e) => setEditForm(prev => ({ ...prev, barang_bukti: e.target.value }))}
                  className="h-11 md:h-12 touch-input ios-input android-input xs-mobile-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_sp_han" className="text-sm md:text-base">SP-HAN</Label>
                <Input
                  id="edit_sp_han"
                  type="date"
                  value={editForm.sp_han}
                  onChange={(e) => setEditForm(prev => ({ ...prev, sp_han: e.target.value }))}
                  className="h-11 md:h-12 touch-input ios-input android-input xs-mobile-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm md:text-base">Pasal</Label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm">Pasal</span>
                    <Input
                      value={editForm.pasal_nomor}
                      onChange={(e) => setEditForm(prev => ({ ...prev, pasal_nomor: e.target.value }))}
                      className="h-11 md:h-12 touch-input ios-input android-input xs-mobile-input"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm">Ayat</span>
                    <Input
                      value={editForm.pasal_ayat}
                      onChange={(e) => setEditForm(prev => ({ ...prev, pasal_ayat: e.target.value }))}
                      className="h-11 md:h-12 touch-input ios-input android-input xs-mobile-input"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_masa_tahanan" className="text-sm md:text-base">Masa Tahanan</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit_masa_tahanan"
                    type="number"
                    value={editForm.masa_tahanan}
                    onChange={(e) => setEditForm(prev => ({ ...prev, masa_tahanan: e.target.value }))}
                    className="h-11 md:h-12 touch-input ios-input android-input xs-mobile-input"
                  />
                  <span className="text-xs md:text-sm">Hari</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_nama_penyidik" className="text-sm md:text-base">Nama Penyidik</Label>
                <Input
                  id="edit_nama_penyidik"
                  value={editForm.nama_penyidik}
                  onChange={(e) => setEditForm(prev => ({ ...prev, nama_penyidik: e.target.value }))}
                  className="h-11 md:h-12 touch-input ios-input android-input xs-mobile-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_keterangan" className="text-sm md:text-base">Keterangan</Label>
                <Select 
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, keterangan: value }))} 
                  value={editForm.keterangan}
                >
                  <SelectTrigger className="h-11 md:h-12 touch-input">
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
            <div className="flex flex-col md:flex-row justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setEditDialogOpen(false)}
                className="w-full md:w-auto touch-button"
              >
                Batal
              </Button>
              <Button 
                onClick={handleUpdate} 
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 touch-button ios-button android-button"
              >
                Simpan Perubahan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}