import { Mapel, AppState } from './types';

export const DAFTAR_MAPEL: Mapel[] = [
  { id: 'm1', nama: 'Pendidikan Agama dan Budi Pekerti', singkatan: 'PAI' },
  { id: 'm2', nama: 'Pendidikan Pancasila', singkatan: 'PPKn' },
  { id: 'm3', nama: 'Bahasa Indonesia', singkatan: 'B.Indo' },
  { id: 'm4', nama: 'Matematika', singkatan: 'MTK' },
  { id: 'm5', nama: 'Ilmu Pengetahuan Alam dan Sosial', singkatan: 'IPAS' },
  { id: 'm6', nama: 'Pendidikan Jasmani, Olahraga, dan Kesehatan', singkatan: 'PJOK' },
  { id: 'm7', nama: 'Seni dan Budaya', singkatan: 'Seni' },
  { id: 'm8', nama: 'Bahasa Inggris', singkatan: 'B.Ing' },
  { id: 'm9', nama: 'Muatan Lokal', singkatan: 'Mulok' },
];

export const INITIAL_STATE: AppState = {
  isAuthenticated: false,
  sekolah: {
    nama: 'SDN Legokmenteng Waringinkurung',
    npsn: '20601234',
    nss: '',
    nis: '',
    alamat: 'Jl. Legokmenteng, Waringinkurung, Kab. Serang',
    desaKelurahanJenis: 'desa',
    desaKelurahanNama: 'Waringinkurung',
    kecamatan: 'Waringinkurung',
    kabupatenKotaJenis: 'kabupaten',
    kabupatenKotaNama: 'Serang',
    provinsi: 'Banten',
    kodePos: '42161',
    telepon: '',
    email: '',
    website: '',
    kepsek: 'Ahmad Sudirman, S.Pd',
    nipKepsek: '19700101 199512 1 001',
    waKepalaSekolah: '',
    waliKelas: 'Siti Aminah, S.Pd',
    nipWaliKelas: '19850202 201001 2 002',
    waGuru: '',
    tahunAjaran: '2023/2024',
    semester: '1',
    fase: 'B',
    kelas: '4',
    ruangRombel: 'A',
    lokasiTitimangsa: 'kabupaten_kota',
    tanggalBiodata: '2024-07-15',
    tanggalRapor: '2024-12-20',
    bobotSumatifLingkup: 75,
    bobotSumatifSemester: 25,
  },
  siswa: [
    { id: 's1', nama: 'Ahmad Budi Santoso', nisn: '0123456789', jk: 'L' },
    { id: 's2', nama: 'Siti Nurhaliza', nisn: '0123456790', jk: 'P' },
    { id: 's3', nama: 'Kevin Pratama', nisn: '0123456791', jk: 'L' },
  ],
  tujuanPembelajaran: [
    { id: 'tp1', mapelId: 'm3', kode: 'TP.BI.1', deskripsi: 'Menganalisis teks narasi dengan baik' },
    { id: 'tp2', mapelId: 'm3', kode: 'TP.BI.2', deskripsi: 'Menulis teks deskripsi sesuai kaidah kebahasaan' },
    { id: 'tp3', mapelId: 'm4', kode: 'TP.MTK.1', deskripsi: 'Menyelesaikan operasi hitung pecahan' },
    { id: 'tp4', mapelId: 'm4', kode: 'TP.MTK.2', deskripsi: 'Mengukur luas bangun datar jajar genjang' },
  ],
  nilai: {
    's1': {
      'm3': { tpScores: { 'tp1': 85, 'tp2': 90 }, sumatifAkhir: 88 },
      'm4': { tpScores: { 'tp3': 75, 'tp4': 80 }, sumatifAkhir: 78 }
    },
    's2': {
      'm3': { tpScores: { 'tp1': 92, 'tp2': 88 }, sumatifAkhir: 90 },
      'm4': { tpScores: { 'tp3': 85, 'tp4': 95 }, sumatifAkhir: 88 }
    },
    's3': {
      'm3': { tpScores: { 'tp1': 70, 'tp2': 75 }, sumatifAkhir: 72 },
      'm4': { tpScores: { 'tp3': 60, 'tp4': 65 }, sumatifAkhir: 65 }
    }
  },
  projek: [
    { id: 'p1', tema: 'Kearifan Lokal', deskripsi: 'Melestarikan Makanan Khas Daerah' },
  ],
  dimensiProjek: [
    { id: 'd1', projekId: 'p1', nama: 'Bergotong royong' },
    { id: 'd2', projekId: 'p1', nama: 'Kreatif' },
    { id: 'd3', projekId: 'p1', nama: 'Bernalar Kritis' },
  ],
  nilaiP5: {
    's1': { 'd1': 'BSH', 'd2': 'SB', 'd3': 'BSH' },
    's2': { 'd1': 'SAB', 'd2': 'SAB', 'd3': 'BSH' },
    's3': { 'd1': 'MB', 'd2': 'MB', 'd3': 'SB' },
  }
};
