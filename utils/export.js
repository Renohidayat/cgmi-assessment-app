// ============================================================
// utils/export.js
// CSV / Excel export utilities
// ============================================================

/**
 * Convert an array of assessment objects to a CSV string.
 */
export function assessmentsToCsv(assessments) {
  const headers = [
    'No', 'Nama', 'Organisasi', 'Tanggal Submisi',
    'Kepemimpinan', 'Pengambilan Keputusan', 'Transparansi',
    'Manajemen Risiko', 'Pengelolaan Sumber Daya', 'Kinerja dan Evaluasi',
    'Rata-Rata Total', 'Level Kematangan',
  ];

  const rows = assessments.map((a, i) => {
    const spd = a.scoresPerDimension || {};
    const date = a.submittedAt?.toDate
      ? a.submittedAt.toDate().toLocaleDateString('id-ID')
      : (a.submittedAt ? new Date(a.submittedAt).toLocaleDateString('id-ID') : '-');

    return [
      i + 1,
      `"${a.userName || '-'}"`,
      `"${a.organization || '-'}"`,
      date,
      spd['Kepemimpinan']           ?? 0,
      spd['Pengambilan Keputusan']  ?? 0,
      spd['Transparansi']           ?? 0,
      spd['Manajemen Risiko']       ?? 0,
      spd['Pengelolaan Sumber Daya']?? 0,
      spd['Kinerja dan Evaluasi']   ?? 0,
      a.totalAverageScore           ?? 0,
      `"${a.maturityLevel || '-'}"`,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Trigger a browser download of the CSV file.
 */
export function downloadCsv(csvContent, filename = 'cgmi-data-responden.csv') {
  const BOM  = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * One-shot helper – build CSV from assessments and trigger download.
 */
export function exportAssessments(assessments) {
  const csv = assessmentsToCsv(assessments);
  downloadCsv(csv);
}
