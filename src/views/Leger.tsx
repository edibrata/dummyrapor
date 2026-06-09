import { useAppStore } from '@/store';
import { DAFTAR_MAPEL } from '@/constants';

export default function Leger() {
  const { state } = useAppStore();
  const { siswa, nilai, tujuanPembelajaran } = state;

  const getNilaiAkhir = (studentId: string, mapelId: string) => {
    const s = nilai[studentId]?.[mapelId];
    if (!s) return null;

    const mapelTps = tujuanPembelajaran.filter(tp => tp.mapelId === mapelId);
    let totalTp = 0;
    let countTp = 0;

    mapelTps.forEach(tp => {
      const score = s.tpScores[tp.id];
      if (typeof score === 'number') {
        totalTp += score;
        countTp++;
      }
    });

    const avgFormatif = countTp > 0 ? totalTp / countTp : 0;
    const sumatif = s.sumatifAkhir ?? 0;

    if (countTp === 0 && s.sumatifAkhir === null) return null;

    // Sederhananya, jika nilai salah satu kosong, kita hitung rata-rata dari yang ada
    let totalComponents = 0;
    let finalScore = 0;

    if (countTp > 0) {
      finalScore += avgFormatif;
      totalComponents++;
    }
    if (s.sumatifAkhir !== null) {
      finalScore += sumatif;
      totalComponents++;
    }

    if (totalComponents === 0) return null;
    return Math.round(finalScore / totalComponents);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-8rem)]">
      <h2 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100 shrink-0">Leger Nilai (Rekapitulasi)</h2>

      <div className="overflow-hidden rounded-xl border border-slate-200 flex-1">
        <div className="overflow-auto w-full h-full">
          <table className="w-full border-collapse text-sm whitespace-nowrap">
            <thead className="bg-slate-100 sticky top-0 z-20">
              <tr className="text-slate-600">
                <th rowSpan={2} className="border border-slate-200 p-3 w-10 text-center sticky left-0 z-30 bg-slate-100">No</th>
                <th rowSpan={2} className="border border-slate-200 p-3 text-left w-48 sticky left-10 z-30 bg-slate-100 shadow-[1px_0_0_0_#e2e8f0]">Nama Siswa</th>
                <th colSpan={DAFTAR_MAPEL.length} className="border border-slate-200 p-2 text-center text-[10px] uppercase font-bold tracking-wider">Nilai Rapor Mata Pelajaran</th>
                <th rowSpan={2} className="border border-slate-200 p-3 w-20 text-center font-bold bg-indigo-50 text-[10px] uppercase tracking-wider">Jumlah</th>
                <th rowSpan={2} className="border border-slate-200 p-3 w-20 text-center font-bold bg-amber-50 text-[10px] uppercase tracking-wider">Rerata</th>
              </tr>
              <tr className="text-slate-600">
                {DAFTAR_MAPEL.map((m) => (
                  <th key={m.id} title={m.nama} className="border border-slate-200 p-2 w-16 text-center text-xs font-semibold bg-slate-50 cursor-help">
                    {m.singkatan}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {siswa.map((s, i) => {
                let totalScore = 0;
                let countScore = 0;

                const mapelScores = DAFTAR_MAPEL.map(m => {
                  const final = getNilaiAkhir(s.id, m.id);
                  if (final !== null) {
                    totalScore += final;
                    countScore++;
                  }
                  return final;
                });

                const rataRata = countScore > 0 ? (totalScore / countScore).toFixed(1) : null;
                const bulatRata = countScore > 0 ? Math.round(totalScore / countScore) : null;

                return (
                  <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="border border-slate-200 p-3 text-center sticky left-0 bg-white z-10 font-mono text-slate-400">{i + 1}</td>
                    <td className="border border-slate-200 p-3 truncate sticky left-10 bg-white z-10 shadow-[1px_0_0_0_#e2e8f0] font-medium">{s.nama}</td>
                    
                    {mapelScores.map((score, idx) => (
                      <td key={idx} className="border border-slate-200 p-3 text-center text-slate-700">
                        {score !== null ? score : <span className="text-slate-300">-</span>}
                      </td>
                    ))}
                    
                    <td className="border border-slate-200 p-3 text-center font-bold text-slate-500 bg-indigo-50/30">
                      {totalScore || '-'}
                    </td>
                    <td className="border border-slate-200 p-3 text-center font-bold text-indigo-700 bg-amber-50/30">
                      {bulatRata !== null ? bulatRata : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
