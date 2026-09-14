import React, { useState, useRef } from 'react';
import { useAppStore } from '@/store';
import { Siswa } from '@/types';
import { Plus, Trash2, GripVertical, Upload, Download, UploadCloud } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function TabDataDasarMurid() {
  const { state, updateState } = useAppStore();
  const siswa = state.siswa || [];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const _siswa = [...siswa];
    const draggedItemContent = _siswa.splice(dragItem.current, 1)[0];
    _siswa.splice(dragOverItem.current, 0, draggedItemContent);
    updateState('siswa', _siswa);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      { NIS: '992', NISN: '3133316342', NAMA_MURID: 'BAGUS CANDRA ALFIANO', JENIS_KELAMIN: 'Laki-Laki', TEMPAT_LAHIR: 'Pandeglang', TANGGAL_LAHIR: '2013-12-30', ALAMAT: 'Kp. Mesjid', NAMA_WALI_ORTU: 'Aden Fitriana' },
      { NIS: '990', NISN: '3132101248', NAMA_MURID: 'MAULANA YUSUP', JENIS_KELAMIN: 'Laki-Laki', TEMPAT_LAHIR: 'Pandeglang', TANGGAL_LAHIR: '2013-10-27', ALAMAT: 'Kp. Jayasakti', NAMA_WALI_ORTU: 'Tatang' }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Murid");
    
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const filename = `E-Rapor Edi Brata Template Data Murid ${yyyy}${mm}${dd} ${hh}.${min}.${ss}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(worksheet);
        
        const newSiswas: Siswa[] = [];
        
        rows.forEach((row, index) => {
          const nis = row['NIS'];
          const nisn = row['NISN'];
          const nama = row['NAMA_MURID'];
          const jk = row['JENIS_KELAMIN'];
          const tptLahir = row['TEMPAT_LAHIR'];
          const tglLahir = row['TANGGAL_LAHIR'];
          const alamat = row['ALAMAT'];
          const wali = row['NAMA_WALI_ORTU'];
          
          if (nama && (nisn || nis)) {
            newSiswas.push({
              id: 's_' + Date.now() + '_' + index,
              nis: nis ? String(nis).trim() : '',
              nisn: nisn ? String(nisn).trim() : '',
              nama: String(nama).trim(),
              jk: String(jk).trim().toLowerCase() === 'perempuan' ? 'Perempuan' : 'Laki-Laki',
              tempatLahir: tptLahir ? String(tptLahir).trim() : '',
              tanggalLahir: tglLahir ? String(tglLahir).trim() : '',
              alamat: alamat ? String(alamat).trim() : '',
              namaWali: wali ? String(wali).trim() : ''
            });
          }
        });

        if (newSiswas.length > 0) {
          updateState('siswa', [...siswa, ...newSiswas]);
        }
      } catch (err) {
        console.error("Error importing file", err);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAddSiswa = () => {
    const s: Siswa = {
      id: 's' + Date.now(),
      nama: 'Siswa Baru',
      nisn: '',
      jk: 'Laki-Laki',
    };
    updateState('siswa', [...siswa, s]);
  };

  const handleUpdate = (id: string, field: keyof Siswa, value: string) => {
    updateState('siswa', siswa.map(s => s.id === id ? { ...s, [field]: value as any } : s));
  };

  const handlePhotoUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      // Tentukan ukuran maksimal (fokus pada pas foto vertikal)
      const MAX_HEIGHT = 200;
      let width = img.width;
      let height = img.height;

      // Logika resize proporsional
      if (height > MAX_HEIGHT) {
        const scale = MAX_HEIGHT / height;
        width = Math.round(width * scale);
        height = MAX_HEIGHT;
      }

      // Buat kanvas untuk kompresi
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Isi background dengan warna putih (menghindari background hitam transparan pada PNG ke JPEG)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        // Gambar ulang
        ctx.drawImage(img, 0, 0, width, height);
        
        // Ekspor ke Base64 dengan kompresi JPEG 60%
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        
        // Simpan ke state
        handleUpdate(id, 'fotoBase64', compressedBase64);
      }
      
      // Bersihkan memori browser
      URL.revokeObjectURL(objectUrl);
    };
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === siswa.length && siswa.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(siswa.map(s => s.id));
    }
  };

  const handleDeleteSelected = () => {
    const deletedSiswa = siswa.filter(s => selectedIds.includes(s.id));
    const newTrashItems = deletedSiswa.map(s => ({
      id: 'trash_' + Date.now() + Math.random().toString(36).substring(2, 9),
      originalId: s.id,
      type: 'siswa' as const,
      label: `Siswa: ${s.nama} (${s.nisn || s.nis || '-'})`,
      data: s,
      deletedAt: new Date().toISOString()
    }));
    
    updateState('trash', [...(state.trash || []), ...newTrashItems]);
    const newSiswaArray = siswa.filter(s => !selectedIds.includes(s.id));
    updateState('siswa', newSiswaArray);
    setSelectedIds([]);
  };

  return (
    <div className="w-full">
      <div className="px-6 py-5 border-b border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-slate-800">Pendaftaran & Pengelolaan Data Murid</h3>
          <p className="text-[11px] text-gray-500 mt-1">Kelola data murid utama (Nama, NIS, NISN, Ortu, dan TTL).</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={handleImportClick} 
            className="w-8 h-8 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg shadow-sm border border-emerald-200 transition focus:outline-none group/tooltip relative"
          >
            <Upload className="w-4 h-4" />
            <span className="absolute opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all bg-slate-800 text-white text-[10px] font-medium rounded px-2 py-1 top-full mt-1.5 right-0 whitespace-nowrap z-50 pointer-events-none shadow-sm before:absolute before:-top-1 before:right-3 before:border-4 before:border-transparent before:border-b-slate-800">
              Import Excel
            </span>
          </button>
          <button 
            onClick={handleDownloadTemplate} 
            className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg shadow-sm border border-gray-200 transition focus:outline-none group/tooltip relative"
          >
            <Download className="w-4 h-4" />
            <span className="absolute opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all bg-slate-800 text-white text-[10px] font-medium rounded px-2 py-1 top-full mt-1.5 right-0 whitespace-nowrap z-50 pointer-events-none shadow-sm before:absolute before:-top-1 before:right-3 before:border-4 before:border-transparent before:border-b-slate-800">
              Template Excel
            </span>
          </button>
          <button 
            onClick={handleAddSiswa} 
            className="w-8 h-8 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition group/tooltip relative"
          >
            <Plus className="w-4 h-4" />
            <span className="absolute opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all bg-slate-800 text-white text-[10px] font-medium rounded px-2 py-1 top-full mt-1.5 right-0 whitespace-nowrap z-50 pointer-events-none shadow-sm before:absolute before:-top-1 before:right-3 before:border-4 before:border-transparent before:border-b-slate-800">
              Tambah Murid Baru
            </span>
          </button>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-indigo-50/80 border-b border-indigo-100 px-6 py-3 flex items-center justify-between animate-in fade-in duration-200">
          <span className="text-indigo-700 font-bold text-sm">{selectedIds.length} data murid terpilih</span>
          <button 
            onClick={handleDeleteSelected}
            className="flex items-center gap-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Hapus Terpilih
          </button>
        </div>
      )}

      <div className="overflow-auto bg-white rounded-b-2xl border-t border-gray-200" style={{ maxHeight: 'calc(100vh - 280px)' }}>
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-[#F8FAFC] text-slate-500 font-bold border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-3 py-2 w-10 text-center">
                <input 
                  type="checkbox" 
                  checked={siswa.length > 0 && selectedIds.length === siswa.length}
                  onChange={handleToggleSelectAll}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer" 
                />
              </th>
              <th className="px-2 py-2 w-8 text-center text-[10px] uppercase tracking-wider">Gsr</th>
              <th className="px-3 py-1.5 w-10 text-center text-[10px] uppercase tracking-wider">No</th>
              <th className="px-4 py-1.5 w-12 text-center text-[10px] uppercase tracking-wider">Foto</th>
              <th className="px-4 py-1.5 w-24 text-center text-[10px] uppercase tracking-wider">NIS</th>
              <th className="px-4 py-1.5 w-28 text-center text-[10px] uppercase tracking-wider">NISN</th>
              <th className="px-6 py-1.5 text-center text-[10px] uppercase tracking-wider">Nama Murid</th>
              <th className="px-4 py-1.5 text-center text-[10px] uppercase tracking-wider">J.Kelamin</th>
              <th className="px-6 py-1.5 text-center text-[10px] uppercase tracking-wider">Tempat, Tanggal Lahir</th>
              <th className="px-4 py-1.5 text-center text-[10px] uppercase tracking-wider">Alamat</th>
              <th className="px-4 py-1.5 text-center text-[10px] uppercase tracking-wider">Wali/Ortu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {siswa.length === 0 ? (
              <tr><td colSpan={11} className="px-6 py-8 text-center text-slate-400">Belum ada data murid</td></tr>
            ) : null}
            {siswa.map((s, i) => (
              <tr 
                key={s.id} 
                draggable
                onDragStart={() => (dragItem.current = i)}
                onDragEnter={() => (dragOverItem.current = i)}
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault()}
                className={`hover:bg-slate-50/80 transition-colors group ${selectedIds.includes(s.id) ? 'bg-indigo-50/30' : ''}`}
              >
                <td className="px-3 py-1.5 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(s.id)}
                    onChange={() => handleToggleSelect(s.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer" 
                  />
                </td>
                <td className="px-2 py-1.5 text-center text-slate-300 cursor-grab active:cursor-grabbing hover:text-slate-500">
                  <GripVertical className="w-3 h-3 mx-auto" />
                </td>
                <td className="px-3 py-1.5 text-center text-gray-400 font-mono text-[11px]">{i + 1}</td>
                <td className="px-4 py-1.5 text-center">
                  <label className="cursor-pointer group/photo relative block w-8 h-10 mx-auto rounded shadow-sm border border-slate-200 overflow-hidden bg-slate-100">
                    {s.fotoBase64 ? (
                      <img className="w-full h-full object-cover" alt="Foto" src={s.fotoBase64} />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                        <UploadCloud className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
                      <Upload className="w-3 h-3" />
                    </div>
                    <input accept="image/png, image/jpeg" className="hidden" type="file" onChange={(e) => handlePhotoUpload(s.id, e)} />
                  </label>
                </td>
                <td className="px-4 py-1.5">
                  <input
                    type="text"
                    value={s.nis || ''}
                    onChange={(e) => handleUpdate(s.id, 'nis', e.target.value)}
                    placeholder="NIS"
                    className="w-full px-1.5 py-0.5 border border-transparent hover:border-gray-200 focus:border-indigo-400 rounded outline-none font-mono text-[11px] bg-transparent focus:bg-white transition-colors text-center text-slate-800"
                  />
                </td>
                <td className="px-4 py-1.5">
                  <input
                    type="text"
                    value={s.nisn || ''}
                    onChange={(e) => handleUpdate(s.id, 'nisn', e.target.value)}
                    placeholder="NISN"
                    className="w-full px-1.5 py-0.5 border border-transparent hover:border-gray-200 focus:border-indigo-400 rounded outline-none font-mono text-[11px] bg-transparent focus:bg-white transition-colors text-center text-slate-800"
                  />
                </td>
                <td className="px-6 py-1.5">
                  <input
                    type="text"
                    value={s.nama || ''}
                    onChange={(e) => handleUpdate(s.id, 'nama', e.target.value)}
                    placeholder="Nama Lengkap"
                    className="w-full px-1.5 py-0.5 border border-transparent hover:border-gray-200 focus:border-indigo-400 rounded outline-none font-bold uppercase text-[11px] bg-transparent focus:bg-white transition-colors text-slate-800 min-w-[150px]"
                  />
                </td>
                <td className="px-4 py-1.5 text-center">
                  <select
                    value={s.jk || 'Laki-Laki'}
                    onChange={(e) => handleUpdate(s.id, 'jk', e.target.value as 'Laki-Laki' | 'Perempuan')}
                    className="w-full px-1 py-0.5 border border-transparent hover:border-gray-200 focus:border-indigo-400 rounded outline-none bg-transparent hover:bg-slate-50 focus:bg-white transition-colors text-[11px] text-slate-700 cursor-pointer min-w-[80px]"
                  >
                    <option value="Laki-Laki">Laki-Laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </td>
                <td className="px-6 py-1.5">
                  <div className="flex gap-1 items-center">
                    <input
                      type="text"
                      value={s.tempatLahir || ''}
                      onChange={(e) => handleUpdate(s.id, 'tempatLahir', e.target.value)}
                      placeholder="Tempat"
                      className="w-24 px-1.5 py-0.5 border border-transparent hover:border-gray-200 focus:border-indigo-400 rounded outline-none text-[11px] bg-transparent focus:bg-white transition-colors text-slate-700"
                    />
                    <span className="text-gray-400 text-[10px]">,</span>
                    <input
                      type="date"
                      value={s.tanggalLahir || ''}
                      onChange={(e) => handleUpdate(s.id, 'tanggalLahir', e.target.value)}
                      className="w-28 px-1.5 py-0.5 border border-transparent hover:border-gray-200 focus:border-indigo-400 rounded outline-none text-[11px] bg-transparent focus:bg-white transition-colors text-slate-700"
                    />
                  </div>
                </td>
                <td className="px-4 py-1.5">
                  <input
                    type="text"
                    value={s.alamat || ''}
                    onChange={(e) => handleUpdate(s.id, 'alamat', e.target.value)}
                    placeholder="Alamat"
                    className="w-full px-1.5 py-0.5 border border-transparent hover:border-gray-200 focus:border-indigo-400 rounded outline-none text-[11px] bg-transparent focus:bg-white transition-colors text-slate-700 min-w-[120px]"
                  />
                </td>
                <td className="px-4 py-1.5">
                  <input
                    type="text"
                    value={s.namaWali || ''}
                    onChange={(e) => handleUpdate(s.id, 'namaWali', e.target.value)}
                    placeholder="Nama Wali"
                    className="w-full px-1.5 py-0.5 border border-transparent hover:border-gray-200 focus:border-indigo-400 rounded outline-none text-[11px] bg-transparent focus:bg-white transition-colors text-slate-700 min-w-[100px]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
