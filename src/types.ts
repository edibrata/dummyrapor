export interface Sekolah {
  nama: string;
  npsn: string;
  nss?: string;
  nis?: string;
  alamat: string;
  desaKelurahanJenis?: string;
  desaKelurahanNama?: string;
  kecamatan?: string;
  kabupatenKotaJenis?: string;
  kabupatenKotaNama?: string;
  provinsi?: string;
  kodePos?: string;
  telepon?: string;
  email?: string;
  website?: string;
  kepsek: string;
  nipKepsek: string;
  waKepalaSekolah?: string;
  waliKelas: string;
  nipWaliKelas: string;
  waGuru?: string;
  tahunAjaran: string;
  semester: string;
  fase: string;
  kelas: string;
  ruangRombel?: string;
  allowedKelas?: (string | number)[];
  lokasiTitimangsa?: string;
  tanggalBiodata?: string;
  tanggalRapor?: string;
  bobotSumatifLingkup?: number;
  bobotSumatifSemester?: number;
}

export interface Siswa {
  id: string;
  nama: string;
  nisn: string;
  jk: 'L' | 'P';
}

export interface Mapel {
  id: string;
  nama: string;
  singkatan: string;
}

export interface TujuanPembelajaran {
  id: string;
  mapelId: string;
  kode: string;
  deskripsi: string;
}

export interface NilaiMapelSiswa {
  tpScores: Record<string, number | null>; // tpId -> score (0-100)
  sumatifAkhir: number | null;
}

export interface DataProjek {
  id: string;
  tema: string;
  deskripsi: string;
}

export interface DimensiProjek {
  id: string;
  projekId: string;
  nama: string;
}

export type NilaiProjek = 'MB' | 'SB' | 'BSH' | 'SAB' | '';

export interface AppState {
  isAuthenticated: boolean;
  sekolah: Sekolah;
  siswa: Siswa[];
  tujuanPembelajaran: TujuanPembelajaran[];
  // studentId -> mapelId -> NilaiMapelSiswa
  nilai: Record<string, Record<string, NilaiMapelSiswa>>;
  projek: DataProjek[];
  dimensiProjek: DimensiProjek[];
  // studentId -> dimensiId -> NilaiProjek
  nilaiP5: Record<string, Record<string, NilaiProjek>>;
}
