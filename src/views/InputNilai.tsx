import { useState } from 'react';
import { useAppStore } from '@/store';
import { DAFTAR_MAPEL } from '@/constants';

export default function InputNilai() {
  const { state, updateState } = useAppStore();
  const [selectedMapel, setSelectedMapel] = useState<string>(DAFTAR_MAPEL[0].id);

  const { siswa, tujuanPembelajaran, nilai } = state;
  const mapelTps = tujuanPembelajaran.filter(tp => tp.mapelId === selectedMapel);

  const handleScoreChange = (studentId: string, type: 'tp' | 'sumatifAkhir', tpId: string | undefined, val: string) => {
    const numVal = val === '' ? null : Number(val);
    if (numVal !== null && (numVal < 0 || numVal > 100)) return;

    const studentScores = nilai[studentId] || {};
    const mapelScores = studentScores[selectedMapel] || { tpScores: {}, sumatifAkhir: null };

    if (type === 'tp' && tpId) {
      mapelScores.tpScores = { ...mapelScores.tpScores, [tpId]: numVal };
    } else if (type === 'sumatifAkhir') {
      mapelScores.sumatifAkhir = numVal;
    }

    updateState('nilai', {
      ...nilai,
      [studentId]: {
        ...studentScores,
        [selectedMapel]: mapelScores,
      }
    });
  };

  const getScore = (studentId: string, type: 'tp' | 'sumatifAkhir', tpId?: string) => {
    const s = nilai[studentId]?.[selectedMapel];
    if (!s) return '';
    if (type === 'tp' && tpId) return s.tpScores[tpId] ?? '';
    if (type === 'sumatifAkhir') return s.sumatifAkhir ?? '';
    return '';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">Input Nilai Akademik</h2>

      <div className="mb-6 max-w-xs">
        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mata Pelajaran</label>
        <select value={selectedMapel} onChange={(e) => setSelectedMapel(e.target.value)} className="w-full border border-slate-200 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          {DAFTAR_MAPEL.map(m => (
            <option key={m.id} value={m.id}>{m.nama}</option>
          ))}
        </select>
      </div>

      {mapelTps.length === 0 ? (
        <div className="p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-sm">
          Silakan tambahkan Tujuan Pembelajaran (TP) terlebih dahulu untuk mata pelajaran ini di menu "Tujuan Pembelajaran".
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 flex-1">
          <div className="overflow-auto w-full">
            <table className="w-full border-collapse text-sm whitespace-nowrap">
              <thead className="bg-slate-100 sticky top-0 z-10">
                <tr className="text-slate-600">
                  <th rowSpan={2} className="border border-slate-200 p-3 w-12 text-center bg-slate-100">No</th>
                  <th rowSpan={2} className="border border-slate-200 p-3 text-left w-48 bg-slate-100 sticky left-0 z-10 shadow-[1px_0_0_0_#e2e8f0]">Nama Siswa</th>
                  <th colSpan={mapelTps.length} className="border border-slate-200 p-2 text-center text-[10px] bg-indigo-50 font-bold uppercase tracking-wider">Nilai Formatif (NA Sumatif Materi)</th>
                  <th rowSpan={2} className="border border-slate-200 p-2 text-center w-24 bg-amber-50 text-[10px] font-bold uppercase tracking-wider">Sumatif<br/>Akhir Sem.</th>
                </tr>
                <tr className="text-slate-600">
                  {mapelTps.map((tp, idx) => (
                    <th key={tp.id} title={tp.deskripsi} className="border border-slate-200 p-2 w-16 text-center text-xs font-medium bg-slate-50 cursor-help">
                      TP {idx + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {siswa.map((s, i) => (
                  <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="border border-slate-200 p-3 text-center font-mono text-slate-400">{i + 1}</td>
                    <td className="border border-slate-200 p-3 truncate font-medium sticky left-0 bg-white group-hover:bg-indigo-50/30 group-focus-within:bg-indigo-50/30 z-10 shadow-[1px_0_0_0_#e2e8f0]">{s.nama}</td>
                    {mapelTps.map(tp => (
                      <td key={tp.id} className="border border-slate-200 p-0 text-center relative focus-within:bg-white">
                        <input 
                          type="number" 
                          min="0" max="100"
                          value={getScore(s.id, 'tp', tp.id)} 
                          onChange={(e) => handleScoreChange(s.id, 'tp', tp.id, e.target.value)}
                          className="w-full h-full p-2 outline-none text-center bg-transparent focus:bg-white" 
                        />
                      </td>
                    ))}
                    <td className="border border-slate-200 p-0 text-center font-semibold relative bg-amber-50/30 focus-within:bg-white">
                      <input 
                        type="number" 
                        min="0" max="100"
                        value={getScore(s.id, 'sumatifAkhir')} 
                        onChange={(e) => handleScoreChange(s.id, 'sumatifAkhir', undefined, e.target.value)}
                        className="w-full h-full p-2 outline-none text-center bg-transparent focus:bg-white text-indigo-700 font-bold focus:shadow-inner" 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center text-[11px] text-slate-500">
            <p>Petunjuk: Gunakan tombol <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded shadow-sm font-bold mx-1">TAB</kbd> untuk berpindah kolom dengan cepat.</p>
          </div>
        </div>
      )}
    </div>
  );
}
