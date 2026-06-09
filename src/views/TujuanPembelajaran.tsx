import { useState } from 'react';
import { useAppStore } from '@/store';
import { DAFTAR_MAPEL } from '@/constants';
import { TujuanPembelajaran } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

export default function TujuanPembelajaranView() {
  const { state, updateState } = useAppStore();
  const [selectedMapel, setSelectedMapel] = useState<string>(DAFTAR_MAPEL[0].id);

  const tps = state.tujuanPembelajaran.filter(tp => tp.mapelId === selectedMapel);

  const handleAdd = () => {
    const newTp: TujuanPembelajaran = {
      id: 'tp' + Date.now(),
      mapelId: selectedMapel,
      kode: `TP.${selectedMapel}.${tps.length + 1}`,
      deskripsi: 'Deskripsi TP baru...'
    };
    updateState('tujuanPembelajaran', [...state.tujuanPembelajaran, newTp]);
  };

  const handleUpdate = (id: string, field: keyof TujuanPembelajaran, value: string) => {
    updateState('tujuanPembelajaran', state.tujuanPembelajaran.map(tp => 
      tp.id === id ? { ...tp, [field]: value } : tp
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus Tujuan Pembelajaran ini?')) {
      updateState('tujuanPembelajaran', state.tujuanPembelajaran.filter(tp => tp.id !== id));
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">Tujuan Pembelajaran (TP)</h2>

      <div className="mb-6 max-w-sm">
        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Pilih Mata Pelajaran</label>
        <select value={selectedMapel} onChange={(e) => setSelectedMapel(e.target.value)} className="w-full border border-slate-200 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          {DAFTAR_MAPEL.map(m => (
            <option key={m.id} value={m.id}>{m.nama}</option>
          ))}
        </select>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-semibold text-slate-700 text-sm">Daftar TP - {DAFTAR_MAPEL.find(m => m.id === selectedMapel)?.nama}</h3>
        <button onClick={handleAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-md flex items-center gap-2">
          <Plus size={16} /> Tambah TP
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-100 sticky top-0 z-10">
            <tr className="text-slate-600">
              <th className="border border-slate-200 p-3 w-12 text-center bg-slate-100">No</th>
              <th className="border border-slate-200 p-3 text-left w-32 bg-slate-100">Kode TP</th>
              <th className="border border-slate-200 p-3 text-left bg-slate-100">Deskripsi Tujuan Pembelajaran</th>
              <th className="border border-slate-200 p-3 w-16 text-center bg-slate-100">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tps.length === 0 ? (
              <tr><td colSpan={4} className="border border-slate-200 p-4 text-center text-slate-400">Belum ada Tujuan Pembelajaran untuk mata pelajaran ini.</td></tr>
            ) : null}
            {tps.map((tp, i) => (
              <tr key={tp.id} className="hover:bg-indigo-50/30 transition-colors align-top">
                <td className="border border-slate-200 p-3 text-center font-mono text-slate-400">{i + 1}</td>
                <td className="border border-slate-200 p-0">
                  <input type="text" value={tp.kode} onChange={(e) => handleUpdate(tp.id, 'kode', e.target.value)} className="w-full p-3 font-medium outline-none bg-transparent focus:bg-white" />
                </td>
                <td className="border border-slate-200 p-0">
                  <textarea value={tp.deskripsi} onChange={(e) => handleUpdate(tp.id, 'deskripsi', e.target.value)} className="w-full p-3 outline-none bg-transparent focus:bg-white resize-y min-h-[40px] block" rows={2} />
                </td>
                <td className="border border-slate-200 p-3 text-center align-middle">
                  <button onClick={() => handleDelete(tp.id)} className="text-red-500 hover:text-red-700 mx-auto block transition-colors">
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
