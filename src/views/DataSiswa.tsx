import { useState } from 'react';
import { useAppStore } from '@/store';
import { Siswa } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

export default function DataSiswa() {
  const { state, updateState } = useAppStore();
  const { siswa } = state;

  const [newSiswa, setNewSiswa] = useState<Partial<Siswa>>({ nama: '', nisn: '', jk: 'L' });

  const handleAdd = () => {
    if (!newSiswa.nama) return;
    const s: Siswa = {
      id: 's' + Date.now(),
      nama: newSiswa.nama,
      nisn: newSiswa.nisn || '',
      jk: (newSiswa.jk as 'L' | 'P') || 'L',
    };
    updateState('siswa', [...siswa, s]);
    setNewSiswa({ nama: '', nisn: '', jk: 'L' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus siswa ini?')) {
      updateState('siswa', siswa.filter((s) => s.id !== id));
    }
  };

  const handleUpdate = (id: string, field: keyof Siswa, value: string) => {
    updateState('siswa', siswa.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">Data Siswa</h2>

      <div className="flex gap-4 mb-6 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nama Siswa</label>
          <input type="text" value={newSiswa.nama} onChange={(e) => setNewSiswa({ ...newSiswa, nama: e.target.value })} placeholder="Masukkan nama..." className="w-full border border-slate-200 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">NISN</label>
          <input type="text" value={newSiswa.nisn} onChange={(e) => setNewSiswa({ ...newSiswa, nisn: e.target.value })} placeholder="NISN" className="w-full border border-slate-200 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">J.Kelamin</label>
          <select value={newSiswa.jk} onChange={(e) => setNewSiswa({ ...newSiswa, jk: e.target.value as 'L'|'P' })} className="w-full border border-slate-200 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <option value="L">L</option>
            <option value="P">P</option>
          </select>
        </div>
        <button onClick={handleAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-md flex items-center gap-2">
          <Plus size={16} /> Tambah Siswa
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-100 sticky top-0 z-10">
            <tr className="text-slate-600">
              <th className="border border-slate-200 p-3 w-12 text-center bg-slate-100">No</th>
              <th className="border border-slate-200 p-3 text-left bg-slate-100">Nama Lengkap</th>
              <th className="border border-slate-200 p-3 w-32 bg-slate-100">NISN</th>
              <th className="border border-slate-200 p-3 w-20 text-center bg-slate-100">L/P</th>
              <th className="border border-slate-200 p-3 w-20 text-center bg-slate-100">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {siswa.length === 0 ? (
              <tr><td colSpan={5} className="border border-slate-200 p-4 text-center text-slate-400">Belum ada data siswa</td></tr>
            ) : null}
            {siswa.map((s, i) => (
              <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors">
                <td className="border border-slate-200 p-3 text-center font-mono text-slate-400">{i + 1}</td>
                <td className="border border-slate-200 p-0">
                  <input type="text" value={s.nama} onChange={(e) => handleUpdate(s.id, 'nama', e.target.value)} className="w-full p-3 font-medium outline-none bg-transparent focus:bg-white" />
                </td>
                <td className="border border-slate-200 p-0">
                  <input type="text" value={s.nisn} onChange={(e) => handleUpdate(s.id, 'nisn', e.target.value)} className="w-full p-3 outline-none bg-transparent focus:bg-white text-slate-600" />
                </td>
                <td className="border border-slate-200 p-0 text-center">
                  <select value={s.jk} onChange={(e) => handleUpdate(s.id, 'jk', e.target.value as 'L'|'P')} className="w-full p-3 outline-none bg-transparent focus:bg-white text-center appearance-none text-slate-600">
                    <option value="L">L</option>
                    <option value="P">P</option>
                  </select>
                </td>
                <td className="border border-slate-200 p-3 text-center">
                  <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 mx-auto block transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
