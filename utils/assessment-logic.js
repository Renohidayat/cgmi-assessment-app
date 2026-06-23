// ============================================================
// utils/assessment-logic.js
// Core assessment logic: questions, scoring, maturity, recommendations
// ============================================================

export const DIMENSIONS = [
  { key: 'leadership',   label: 'Kepemimpinan' },
  { key: 'decision',     label: 'Pengambilan Keputusan' },
  { key: 'transparency', label: 'Transparansi' },
  { key: 'risk',         label: 'Manajemen Risiko' },
  { key: 'resource',     label: 'Pengelolaan Sumber Daya' },
  { key: 'performance',  label: 'Kinerja dan Evaluasi' },
];

export const LIKERT_LABELS = {
  1: 'Sangat Tidak Setuju',
  2: 'Tidak Setuju',
  3: 'Netral',
  4: 'Setuju',
  5: 'Sangat Setuju',
};

// 30 Default questions (5 per dimension) – seeded via Admin Panel
export const DEFAULT_QUESTIONS = [
  // ── Kepemimpinan ──────────────────────────────────────────
  { id: 'q1',  dimension: 'Kepemimpinan',           dimensionKey: 'leadership',   order: 1,
    text: 'Pimpinan organisasi kami secara aktif mendorong kerjasama antar instansi dalam setiap kebijakan yang dibuat.' },
  { id: 'q2',  dimension: 'Kepemimpinan',           dimensionKey: 'leadership',   order: 2,
    text: 'Terdapat komitmen kepemimpinan yang jelas untuk mendukung tata kelola kolaboratif.' },
  { id: 'q3',  dimension: 'Kepemimpinan',           dimensionKey: 'leadership',   order: 3,
    text: 'Pimpinan kami mampu menyelesaikan konflik antar mitra kolaborasi secara efektif.' },
  { id: 'q4',  dimension: 'Kepemimpinan',           dimensionKey: 'leadership',   order: 4,
    text: 'Visi kepemimpinan dalam organisasi kami selaras dengan tujuan kolaborasi jangka panjang.' },
  { id: 'q5',  dimension: 'Kepemimpinan',           dimensionKey: 'leadership',   order: 5,
    text: 'Pimpinan secara rutin mengevaluasi kemajuan inisiatif kolaboratif dan memberikan arahan strategis.' },

  // ── Pengambilan Keputusan ─────────────────────────────────
  { id: 'q6',  dimension: 'Pengambilan Keputusan',  dimensionKey: 'decision',     order: 1,
    text: 'Keputusan dalam kolaborasi diambil berdasarkan data dan bukti yang valid.' },
  { id: 'q7',  dimension: 'Pengambilan Keputusan',  dimensionKey: 'decision',     order: 2,
    text: 'Semua pihak yang berkepentingan dilibatkan dalam proses pengambilan keputusan bersama.' },
  { id: 'q8',  dimension: 'Pengambilan Keputusan',  dimensionKey: 'decision',     order: 3,
    text: 'Terdapat mekanisme formal untuk menyelesaikan perbedaan pendapat antar mitra.' },
  { id: 'q9',  dimension: 'Pengambilan Keputusan',  dimensionKey: 'decision',     order: 4,
    text: 'Proses pengambilan keputusan bersifat transparan dan dapat dipahami oleh semua pihak.' },
  { id: 'q10', dimension: 'Pengambilan Keputusan',  dimensionKey: 'decision',     order: 5,
    text: 'Keputusan kolaboratif diimplementasikan secara konsisten oleh semua mitra yang terlibat.' },

  // ── Transparansi ──────────────────────────────────────────
  { id: 'q11', dimension: 'Transparansi',            dimensionKey: 'transparency', order: 1,
    text: 'Informasi mengenai program dan anggaran kolaborasi dapat diakses oleh publik.' },
  { id: 'q12', dimension: 'Transparansi',            dimensionKey: 'transparency', order: 2,
    text: 'Laporan kemajuan kolaborasi dipublikasikan secara berkala kepada pemangku kepentingan.' },
  { id: 'q13', dimension: 'Transparansi',            dimensionKey: 'transparency', order: 3,
    text: 'Organisasi kami menggunakan platform digital untuk meningkatkan transparansi data.' },
  { id: 'q14', dimension: 'Transparansi',            dimensionKey: 'transparency', order: 4,
    text: 'Terdapat mekanisme pengaduan yang jelas bagi masyarakat terkait program kolaborasi.' },
  { id: 'q15', dimension: 'Transparansi',            dimensionKey: 'transparency', order: 5,
    text: 'Semua mitra kolaborasi memiliki akses yang sama terhadap informasi yang relevan.' },

  // ── Manajemen Risiko ──────────────────────────────────────
  { id: 'q16', dimension: 'Manajemen Risiko',        dimensionKey: 'risk',         order: 1,
    text: 'Terdapat penilaian risiko bersama yang dilakukan sebelum memulai program kolaborasi.' },
  { id: 'q17', dimension: 'Manajemen Risiko',        dimensionKey: 'risk',         order: 2,
    text: 'Organisasi kami memiliki rencana mitigasi risiko yang didokumentasikan dengan baik.' },
  { id: 'q18', dimension: 'Manajemen Risiko',        dimensionKey: 'risk',         order: 3,
    text: 'Risiko dalam kolaborasi diidentifikasi dan dilaporkan secara berkala kepada pimpinan.' },
  { id: 'q19', dimension: 'Manajemen Risiko',        dimensionKey: 'risk',         order: 4,
    text: 'Terdapat pembagian tanggung jawab yang jelas terkait pengelolaan risiko antar mitra.' },
  { id: 'q20', dimension: 'Manajemen Risiko',        dimensionKey: 'risk',         order: 5,
    text: 'Organisasi kami belajar dari kegagalan masa lalu untuk meningkatkan manajemen risiko.' },

  // ── Pengelolaan Sumber Daya ───────────────────────────────
  { id: 'q21', dimension: 'Pengelolaan Sumber Daya', dimensionKey: 'resource',     order: 1,
    text: 'Sumber daya (anggaran, SDM, infrastruktur) dialokasikan secara adil antar mitra kolaborasi.' },
  { id: 'q22', dimension: 'Pengelolaan Sumber Daya', dimensionKey: 'resource',     order: 2,
    text: 'Terdapat kesepakatan tertulis mengenai kontribusi sumber daya dari setiap mitra.' },
  { id: 'q23', dimension: 'Pengelolaan Sumber Daya', dimensionKey: 'resource',     order: 3,
    text: 'Penggunaan sumber daya dalam kolaborasi dipantau dan dievaluasi secara rutin.' },
  { id: 'q24', dimension: 'Pengelolaan Sumber Daya', dimensionKey: 'resource',     order: 4,
    text: 'Organisasi kami memiliki kapasitas yang cukup untuk mendukung inisiatif kolaboratif.' },
  { id: 'q25', dimension: 'Pengelolaan Sumber Daya', dimensionKey: 'resource',     order: 5,
    text: 'Terdapat mekanisme berbagi sumber daya yang efisien antar instansi terkait.' },

  // ── Kinerja dan Evaluasi ──────────────────────────────────
  { id: 'q26', dimension: 'Kinerja dan Evaluasi',    dimensionKey: 'performance',  order: 1,
    text: 'Terdapat indikator kinerja utama (KPI) yang jelas untuk mengukur keberhasilan kolaborasi.' },
  { id: 'q27', dimension: 'Kinerja dan Evaluasi',    dimensionKey: 'performance',  order: 2,
    text: 'Evaluasi kinerja kolaborasi dilakukan secara periodik oleh semua pihak yang terlibat.' },
  { id: 'q28', dimension: 'Kinerja dan Evaluasi',    dimensionKey: 'performance',  order: 3,
    text: 'Hasil evaluasi digunakan sebagai dasar perbaikan program kolaborasi selanjutnya.' },
  { id: 'q29', dimension: 'Kinerja dan Evaluasi',    dimensionKey: 'performance',  order: 4,
    text: 'Terdapat sistem pelaporan kinerja yang terintegrasi antar mitra kolaborasi.' },
  { id: 'q30', dimension: 'Kinerja dan Evaluasi',    dimensionKey: 'performance',  order: 5,
    text: 'Prestasi kolaborasi diakui dan diapresiasi oleh semua pihak yang terlibat.' },
];

export const MATURITY_LEVELS = [
  { min: 1.00, max: 1.80, level: 1, label: 'Level 1 – Initial (Ad Hoc)',
    color: '#ef4444', bg: '#fef2f2', badge: 'bg-red-100 text-red-700 border-red-200',
    icon: '🔴',
    description: 'Kolaborasi bersifat ad hoc dan tidak terstruktur. Tidak ada proses formal yang diterapkan secara konsisten.' },
  { min: 1.81, max: 2.60, level: 2, label: 'Level 2 – Managed',
    color: '#f97316', bg: '#fff7ed', badge: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: '🟠',
    description: 'Beberapa proses kolaborasi mulai dikelola, namun masih terbatas pada unit tertentu.' },
  { min: 2.61, max: 3.40, level: 3, label: 'Level 3 – Defined',
    color: '#eab308', bg: '#fefce8', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: '🟡',
    description: 'Proses kolaborasi telah didefinisikan dan didokumentasikan secara formal di seluruh organisasi.' },
  { min: 3.41, max: 4.20, level: 4, label: 'Level 4 – Integrated',
    color: '#3b82f6', bg: '#eff6ff', badge: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: '🔵',
    description: 'Kolaborasi terintegrasi dengan baik dan diukur menggunakan metrik yang jelas dan terstandarisasi.' },
  { min: 4.21, max: 5.00, level: 5, label: 'Level 5 – Optimized',
    color: '#22c55e', bg: '#f0fdf4', badge: 'bg-green-100 text-green-700 border-green-200',
    icon: '🟢',
    description: 'Kolaborasi bersifat proaktif, inovatif, dan terus dioptimalkan berdasarkan data dan pembelajaran berkelanjutan.' },
];

export const RECOMMENDATIONS = {
  leadership: {
    label: 'Kepemimpinan', threshold: 3.0,
    text: 'Susun program pengembangan kepemimpinan kolaboratif lintas instansi. Pertimbangkan pelatihan bersama dan forum koordinasi rutin antarpimpinan untuk memperkuat komitmen dan visi kolaborasi.',
    icon: '👥',
  },
  decision: {
    label: 'Pengambilan Keputusan', threshold: 3.0,
    text: 'Terapkan mekanisme musyawarah multi-pihak berbasis data. Bentuk forum pengambilan keputusan bersama yang melibatkan semua pemangku kepentingan dengan protokol yang jelas dan transparan.',
    icon: '⚖️',
  },
  transparency: {
    label: 'Transparansi', threshold: 3.0,
    text: 'Bangun portal informasi publik bersama yang terintegrasi. Publikasikan laporan kemajuan secara berkala dan sediakan mekanisme umpan balik masyarakat untuk meningkatkan akuntabilitas.',
    icon: '🔍',
  },
  risk: {
    label: 'Manajemen Risiko', threshold: 3.0,
    text: 'Rancang matriks mitigasi risiko bersama antar lembaga. Lakukan penilaian risiko kolaboratif secara berkala dan tetapkan protokol respons yang jelas untuk setiap skenario risiko.',
    icon: '🛡️',
  },
  resource: {
    label: 'Pengelolaan Sumber Daya', threshold: 3.0,
    text: 'Optimalkan skema berbagi sumber daya (resource sharing) lintas sektor. Buat kesepakatan formal mengenai kontribusi dan alokasi sumber daya, serta pantau penggunaannya secara transparan.',
    icon: '📦',
  },
  performance: {
    label: 'Kinerja dan Evaluasi', threshold: 3.0,
    text: 'Tetapkan KPI kolaborasi yang terukur dan jadwal evaluasi periodik bersama. Gunakan hasil evaluasi sebagai dasar perbaikan berkelanjutan dan rayakan pencapaian kolaborasi bersama mitra.',
    icon: '📊',
  },
};

/**
 * Determine maturity level object from a numeric score.
 */
export function getMaturityLevel(score) {
  return (
    MATURITY_LEVELS.find(l => score >= l.min && score <= l.max) ||
    (score < 1 ? MATURITY_LEVELS[0] : MATURITY_LEVELS[MATURITY_LEVELS.length - 1])
  );
}

/**
 * Calculate per-dimension average scores and overall average from answers.
 * @param {Array}  questions  – array of question objects (from Firestore or DEFAULT_QUESTIONS)
 * @param {Object} answers    – { questionId: likertScore (1-5) }
 * @returns {{ scoresPerDimension, totalAverageScore }}
 */
export function calculateScores(questions, answers) {
  const totals = {};
  const counts = {};

  questions.forEach(q => {
    const key  = q.dimensionKey;
    const val  = Number(answers[q.id]) || 0;
    totals[key] = (totals[key] || 0) + val;
    counts[key] = (counts[key] || 0) + 1;
  });

  // Build scoresPerDimension keyed by the Indonesian label
  const scoresPerDimension = {};
  DIMENSIONS.forEach(({ key, label }) => {
    scoresPerDimension[label] = counts[key]
      ? parseFloat((totals[key] / counts[key]).toFixed(2))
      : 0;
  });

  const vals = Object.values(scoresPerDimension);
  const totalAverageScore = vals.length
    ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2))
    : 0;

  return { scoresPerDimension, totalAverageScore };
}

/**
 * Generate tactical recommendations for dimensions scoring below threshold.
 */
export function getRecommendations(scoresPerDimension) {
  return DIMENSIONS
    .map(({ key, label }) => {
      const rec   = RECOMMENDATIONS[key];
      const score = scoresPerDimension[label] ?? 0;
      return rec && score < rec.threshold
        ? { key, label, score, icon: rec.icon, text: rec.text }
        : null;
    })
    .filter(Boolean);
}
