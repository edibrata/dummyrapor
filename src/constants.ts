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

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

let defaultTahunAjaran = "";
let defaultSemester = "";

if (currentMonth >= 0 && currentMonth <= 5) {
  // Jan - Jun
  defaultTahunAjaran = `${currentYear - 1}/${currentYear}`;
  defaultSemester = "1";
} else {
  // Jul - Dec
  defaultTahunAjaran = `${currentYear}/${currentYear + 1}`;
  defaultSemester = "2";
}

export const INITIAL_STATE: AppState = {
  isAuthenticated: false,
  sekolah: {
    nama: '',
    npsn: '',
    nss: '',
    nis: '',
    alamat: '',
    desaKelurahanJenis: 'desa',
    desaKelurahanNama: '',
    kecamatan: '',
    kabupatenKotaJenis: 'kabupaten',
    kabupatenKotaNama: '',
    provinsi: '',
    kodePos: '',
    telepon: '',
    email: '',
    website: '',
    kepsek: '',
    nipKepsek: '',
    waKepalaSekolah: '',
    waliKelas: '',
    nipWaliKelas: '',
    waGuru: '',
    tahunAjaran: defaultTahunAjaran,
    semester: defaultSemester,
    fase: '',
    kelas: '',
    ruangRombel: '',
    lokasiTitimangsa: 'kabupaten_kota',
    tanggalBiodata: '',
    tanggalRapor: '',
    bobotSumatifLingkup: 75,
    bobotSumatifSemester: 25,
  },
  siswa: [],
  tujuanPembelajaran: [],
  nilai: {},
  projek: [],
  dimensiProjek: [],
  nilaiP5: {}
};
