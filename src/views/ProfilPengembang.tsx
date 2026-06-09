export default function ProfilPengembang() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">Profil Pengembang</h2>
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-slate-100 pb-6 mb-6">
        <div className="w-32 h-32 rounded-full shadow-md border-4 border-indigo-50 bg-indigo-100 flex items-center justify-center overflow-hidden shrink-0">
           <img src="https://placehold.co/150x150/4f46e5/ffffff?text=EB" alt="Edi Brata" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="text-center md:text-left flex-grow">
            <h2 className="text-2xl font-bold text-slate-800 leading-tight">Edi Brata</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Carita, Pandeglang Banten</p>
            <p className="text-xs text-slate-500 mt-1">S1 Pend. Bahasa Inggris, S2 Pend. Bahasa Inggris, S1 PGSD</p>
            <div className="mt-4 flex justify-center md:justify-start space-x-4">
                <a href="https://www.tiktok.com/@edibrataeb" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">TikTok</a>
                <span className="text-slate-300">•</span>
                <a href="https://www.instagram.com/edibrata/" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Instagram</a>
                <span className="text-slate-300">•</span>
                <a href="https://web.facebook.com/uebrata" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Facebook</a>
            </div>
            <p className="text-sm text-indigo-600 font-medium mt-2">edibratabanten@gmail.com</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
              <div>
                  <h4 className="font-semibold text-sm text-indigo-800 uppercase tracking-wider mb-3">Peran & Pengalaman</h4>
                  <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                      <li>Guru sejak 2003</li>
                      <li>Guru Penggerak 2021 dan Pengajar Praktik Guru Penggerak 2022</li>
                      <li>Kepala Sekolah Penggerak 2022</li>
                      <li>Instruktur dan Pamong PPG</li>
                      <li>10 Tahun Dosen</li>
                      <li>Instruktur/Fasilitator Kurikulum</li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-semibold text-sm text-indigo-800 uppercase tracking-wider mb-3">Keahlian Teknis</h4>
                  <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                      <li>Pengembang Aplikasi Pembelajaran dan Penilaian</li>
                      <li>Google Certified Educator & Ko-Kapten Belajar.id</li>
                      <li>Pengembang Konten MPI Direktorat SD Kemdikdasmen</li>
                  </ul>
              </div>
          </div>
          <div className="space-y-6">
              <div>
                  <h4 className="font-semibold text-sm text-indigo-800 uppercase tracking-wider mb-3">Kontribusi Nasional</h4>
                  <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                      <li>Narasumber Berbagi Praktik Baik Kemdikdasmen</li>
                      <li>Tim Pengembang Panduan Direktorat SD Kemdikdasmen</li>
                      <li>Tim Pengembang Modul Ajar Direktorat SD Kemdikdasmen</li>
                      <li>Validator Aksi Nyata PMM</li>
                      <li>Fasilitator Direktorat SD Kemdikdasmen</li>
                  </ul>
              </div>
          </div>
      </div>
    </div>
  )
}
