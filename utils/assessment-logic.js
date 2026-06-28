// ============================================================
// utils/assessment-logic.js
// Core assessment logic: questions, scoring, maturity, recommendations
// ============================================================

export const DIMENSIONS = [
  { key: 'leadership', label: 'Kepemimpinan' },
  { key: 'decision', label: 'Pengambilan Keputusan' },
  { key: 'transparency', label: 'Transparansi' },
  { key: 'risk', label: 'Manajemen Risiko' },
  { key: 'resource', label: 'Pengelolaan Sumber Daya' },
  { key: 'performance', label: 'Kinerja dan Evaluasi' },
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
  {
    id: 'q1', dimension: 'Kepemimpinan', dimensionKey: 'leadership', order: 1,
    text: 'Pimpinan organisasi secara aktif mendorong kerja sama antar instansi dalam setiap kebijakan yang dibuat.'
  },
  {
    id: 'q2', dimension: 'Kepemimpinan', dimensionKey: 'leadership', order: 2,
    text: 'Terdapat komitmen kepemimpinan yang jelas untuk mendukung tata kelola kolaboratif.'
  },
  {
    id: 'q3', dimension: 'Kepemimpinan', dimensionKey: 'leadership', order: 3,
    text: 'Pimpinan instansi mampu menyelesaikan konflik antar mitra kolaborasi secara efektif.'
  },
  {
    id: 'q4', dimension: 'Kepemimpinan', dimensionKey: 'leadership', order: 4,
    text: 'Visi kepemimpinan dalam instansi selaras dengan tujuan kolaborasi jangka panjang.'
  },
  {
    id: 'q5', dimension: 'Kepemimpinan', dimensionKey: 'leadership', order: 5,
    text: 'Pimpinan secara rutin mengevaluasi kemajuan inisiatif kolaboratif dan memberikan arahan strategis.'
  },

  // ── Pengambilan Keputusan ─────────────────────────────────
  {
    id: 'q6', dimension: 'Pengambilan Keputusan', dimensionKey: 'decision', order: 1,
    text: 'Keputusan dalam kolaborasi diambil berdasarkan data dan bukti yang valid.'
  },
  {
    id: 'q7', dimension: 'Pengambilan Keputusan', dimensionKey: 'decision', order: 2,
    text: 'Semua pihak yang berkepentingan dilibatkan dalam proses pengambilan keputusan bersama.'
  },
  {
    id: 'q8', dimension: 'Pengambilan Keputusan', dimensionKey: 'decision', order: 3,
    text: 'Terdapat mekanisme formal untuk menyelesaikan perbedaan pendapat antar mitra.'
  },
  {
    id: 'q9', dimension: 'Pengambilan Keputusan', dimensionKey: 'decision', order: 4,
    text: 'Proses pengambilan keputusan bersifat transparan dan dapat dipahami oleh semua pihak.'
  },
  {
    id: 'q10', dimension: 'Pengambilan Keputusan', dimensionKey: 'decision', order: 5,
    text: 'Keputusan kolaboratif diimplementasikan secara konsisten oleh semua mitra yang terlibat.'
  },

  // ── Transparansi ──────────────────────────────────────────
  {
    id: 'q11', dimension: 'Transparansi', dimensionKey: 'transparency', order: 1,
    text: 'Informasi mengenai program dan anggaran kolaborasi dapat diakses oleh publik.'
  },
  {
    id: 'q12', dimension: 'Transparansi', dimensionKey: 'transparency', order: 2,
    text: 'Laporan kemajuan kolaborasi dipublikasikan secara berkala kepada pemangku kepentingan.'
  },
  {
    id: 'q13', dimension: 'Transparansi', dimensionKey: 'transparency', order: 3,
    text: 'Instansi menggunakan platform digital untuk meningkatkan transparansi data.'
  },
  {
    id: 'q14', dimension: 'Transparansi', dimensionKey: 'transparency', order: 4,
    text: 'Terdapat mekanisme pengaduan yang jelas bagi masyarakat terkait program kolaborasi.'
  },
  {
    id: 'q15', dimension: 'Transparansi', dimensionKey: 'transparency', order: 5,
    text: 'Semua mitra kolaborasi memiliki akses yang sama terhadap informasi yang relevan.'
  },

  // ── Manajemen Risiko ──────────────────────────────────────
  {
    id: 'q16', dimension: 'Manajemen Risiko', dimensionKey: 'risk', order: 1,
    text: 'Terdapat penilaian risiko bersama yang dilakukan sebelum memulai program kolaborasi.'
  },
  {
    id: 'q17', dimension: 'Manajemen Risiko', dimensionKey: 'risk', order: 2,
    text: 'Instansi memiliki rencana mitigasi risiko yang didokumentasikan dengan baik.'
  },
  {
    id: 'q18', dimension: 'Manajemen Risiko', dimensionKey: 'risk', order: 3,
    text: 'Risiko dalam kolaborasi diidentifikasi dan dilaporkan secara berkala kepada pimpinan.'
  },
  {
    id: 'q19', dimension: 'Manajemen Risiko', dimensionKey: 'risk', order: 4,
    text: 'Terdapat pembagian tanggung jawab yang jelas terkait pengelolaan risiko antar mitra.'
  },
  {
    id: 'q20', dimension: 'Manajemen Risiko', dimensionKey: 'risk', order: 5,
    text: 'Instansi belajar dari kegagalan masa lalu untuk meningkatkan manajemen risiko.'
  },

  // ── Pengelolaan Sumber Daya ───────────────────────────────
  {
    id: 'q21', dimension: 'Pengelolaan Sumber Daya', dimensionKey: 'resource', order: 1,
    text: 'Sumber daya (anggaran, SDM, infrastruktur) dialokasikan secara adil antar mitra kolaborasi.'
  },
  {
    id: 'q22', dimension: 'Pengelolaan Sumber Daya', dimensionKey: 'resource', order: 2,
    text: 'Terdapat kesepakatan tertulis mengenai kontribusi sumber daya dari setiap mitra.'
  },
  {
    id: 'q23', dimension: 'Pengelolaan Sumber Daya', dimensionKey: 'resource', order: 3,
    text: 'Penggunaan sumber daya dalam kolaborasi dipantau dan dievaluasi secara rutin.'
  },
  {
    id: 'q24', dimension: 'Pengelolaan Sumber Daya', dimensionKey: 'resource', order: 4,
    text: 'Instansi memiliki kapasitas yang cukup untuk mendukung inisiatif kolaboratif.'
  },
  {
    id: 'q25', dimension: 'Pengelolaan Sumber Daya', dimensionKey: 'resource', order: 5,
    text: 'Terdapat mekanisme berbagi sumber daya yang efisien antar instansi terkait.'
  },

  // ── Kinerja dan Evaluasi ──────────────────────────────────
  {
    id: 'q26', dimension: 'Kinerja dan Evaluasi', dimensionKey: 'performance', order: 1,
    text: 'Terdapat indikator kinerja utama (KPI) yang jelas untuk mengukur keberhasilan kolaborasi.'
  },
  {
    id: 'q27', dimension: 'Kinerja dan Evaluasi', dimensionKey: 'performance', order: 2,
    text: 'Evaluasi kinerja kolaborasi dilakukan secara periodik oleh semua pihak yang terlibat.'
  },
  {
    id: 'q28', dimension: 'Kinerja dan Evaluasi', dimensionKey: 'performance', order: 3,
    text: 'Hasil evaluasi digunakan sebagai dasar perbaikan program kolaborasi selanjutnya.'
  },
  {
    id: 'q29', dimension: 'Kinerja dan Evaluasi', dimensionKey: 'performance', order: 4,
    text: 'Terdapat sistem pelaporan kinerja yang terintegrasi antar mitra kolaborasi.'
  },
  {
    id: 'q30', dimension: 'Kinerja dan Evaluasi', dimensionKey: 'performance', order: 5,
    text: 'Prestasi kolaborasi diakui dan diapresiasi oleh semua pihak yang terlibat.'
  },
];

export const MATURITY_LEVELS = [
  {
    min: 1.00, max: 1.80, level: 1, label: 'Level 1 – Initial (Ad Hoc)',
    color: '#ef4444', bg: '#fef2f2', badge: 'bg-red-100 text-red-700 border-red-200',
    icon: '🔴',
    description: 'Kolaborasi bersifat ad hoc dan tidak terstruktur. Tidak ada proses formal yang diterapkan secara konsisten.'
  },
  {
    min: 1.81, max: 2.60, level: 2, label: 'Level 2 – Managed',
    color: '#f97316', bg: '#fff7ed', badge: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: '🟠',
    description: 'Beberapa proses kolaborasi mulai dikelola, namun masih terbatas pada unit tertentu.'
  },
  {
    min: 2.61, max: 3.40, level: 3, label: 'Level 3 – Defined',
    color: '#eab308', bg: '#fefce8', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: '🟡',
    description: 'Proses kolaborasi telah didefinisikan dan didokumentasikan secara formal di seluruh organisasi.'
  },
  {
    min: 3.41, max: 4.20, level: 4, label: 'Level 4 – Integrated',
    color: '#3b82f6', bg: '#eff6ff', badge: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: '🔵',
    description: 'Kolaborasi terintegrasi dengan baik dan diukur menggunakan metrik yang jelas dan terstandarisasi.'
  },
  {
    min: 4.21, max: 5.00, level: 5, label: 'Level 5 – Optimized',
    color: '#22c55e', bg: '#f0fdf4', badge: 'bg-green-100 text-green-700 border-green-200',
    icon: '🟢',
    description: 'Kolaborasi bersifat proaktif, inovatif, dan terus dioptimalkan berdasarkan data dan pembelajaran berkelanjutan.'
  },
];

/**
 * Rekomendasi Tindakan per Dimensi per Level Kematangan (Level 1–5)
 * Setiap level memiliki tindakan yang berbeda dan semakin progresif.
 */
export const RECOMMENDATIONS_BY_LEVEL = {
  leadership: {
    label: 'Kepemimpinan',
    icon: '👥',
    byLevel: {
      1: 'Lakukan identifikasi awal pemangku kepentingan kolaborasi dan tetapkan satu koordinator lintas instansi. Bentuk rapat koordinasi pertama sebagai langkah membangun kesepahaman dasar antar pimpinan.',
      2: 'Formalisasikan peran dan tanggung jawab pimpinan kolaborasi melalui Surat Keputusan (SK) atau MoU. Susun agenda koordinasi berkala dan bangun saluran komunikasi resmi antar pimpinan instansi.',
      3: 'Kembangkan program pelatihan kepemimpinan kolaboratif lintas instansi. Terapkan mekanisme penyelesaian konflik antar pimpinan secara terstruktur dan dokumentasikan setiap keputusan strategis bersama.',
      4: 'Perkuat sinkronisasi visi jangka panjang antar pimpinan melalui forum strategis berkala. Terapkan sistem evaluasi komitmen kepemimpinan terhadap target kolaborasi dan susun rencana suksesi koordinasi.',
      5: 'Jadikan kepemimpinan kolaboratif sebagai budaya organisasi melalui program mentoring antar instansi. Dorong inovasi kepemimpinan berbasis data dan replikasikan praktik terbaik (best practice) ke instansi lain.',
    },
  },
  decision: {
    label: 'Pengambilan Keputusan',
    icon: '⚖️',
    byLevel: {
      1: 'Identifikasi keputusan-keputusan kritis yang membutuhkan keterlibatan multi-pihak. Tetapkan prosedur darurat pengambilan keputusan bersama agar tidak bergantung pada satu pihak saja.',
      2: 'Buat protokol pengambilan keputusan bersama yang disepakati semua mitra. Mulai kumpulkan data pendukung keputusan secara sistematis dan dokumentasikan setiap hasil keputusan kolaboratif.',
      3: 'Terapkan forum musyawarah multi-pihak berbasis data secara rutin. Standarisasi mekanisme penyelesaian perbedaan pendapat dan pastikan transparansi proses keputusan kepada seluruh pemangku kepentingan.',
      4: 'Integrasikan sistem pendukung keputusan berbasis analitik data. Evaluasi efektivitas setiap keputusan kolaboratif dan gunakan hasilnya untuk memperbaiki proses pengambilan keputusan berikutnya.',
      5: 'Terapkan sistem pengambilan keputusan adaptif yang responsif terhadap perubahan kondisi. Gunakan kecerdasan kolektif dan data real-time untuk mengoptimalkan keputusan strategis secara berkelanjutan.',
    },
  },
  transparency: {
    label: 'Transparansi',
    icon: '🔍',
    byLevel: {
      1: 'Inventarisasi informasi program kolaborasi yang dapat dipublikasikan. Mulai dengan menerbitkan dokumen dasar seperti tujuan, cakupan, dan pihak yang terlibat dalam format yang mudah diakses publik.',
      2: 'Bangun mekanisme pelaporan berkala kepada pemangku kepentingan. Sediakan saluran umpan balik masyarakat sederhana dan pastikan informasi anggaran program dapat diakses oleh mitra terkait.',
      3: 'Kembangkan portal informasi publik bersama yang terintegrasi. Publikasikan laporan kemajuan secara rutin dan terapkan standar keterbukaan informasi yang disepakati bersama seluruh mitra kolaborasi.',
      4: 'Manfaatkan platform digital canggih untuk real-time monitoring dan pelaporan publik. Tingkatkan aksesibilitas data bagi seluruh pemangku kepentingan dengan sistem notifikasi otomatis atas pembaruan informasi.',
      5: 'Jadikan transparansi sebagai standar budaya organisasi. Terapkan open data governance, publikasikan dataset kolaborasi secara terbuka, dan libatkan publik dalam proses evaluasi program secara proaktif.',
    },
  },
  risk: {
    label: 'Manajemen Risiko',
    icon: '🛡️',
    byLevel: {
      1: 'Lakukan pemetaan risiko dasar yang mungkin muncul dalam kolaborasi. Tetapkan penanggung jawab risiko di setiap instansi dan buat daftar risiko prioritas yang harus segera diantisipasi.',
      2: 'Susun dokumen rencana mitigasi risiko bersama yang disepakati semua mitra. Tetapkan jadwal peninjauan risiko berkala dan bangun mekanisme pelaporan insiden sederhana antar instansi.',
      3: 'Terapkan penilaian risiko kolaboratif secara periodik dengan melibatkan semua mitra. Standarisasi protokol respons risiko untuk setiap skenario dan dokumentasikan pembelajaran dari setiap insiden yang terjadi.',
      4: 'Integrasikan sistem manajemen risiko berbasis data antar instansi. Gunakan indikator risiko utama (KRI) untuk deteksi dini dan lakukan simulasi skenario risiko secara berkala bersama seluruh mitra.',
      5: 'Bangun budaya sadar risiko yang proaktif di seluruh jenjang instansi. Terapkan manajemen risiko adaptif berbasis pembelajaran berkelanjutan dan jadikan pengalaman kolaborasi sebagai modal penguatan ketahanan organisasi.',
    },
  },
  resource: {
    label: 'Pengelolaan Sumber Daya',
    icon: '📦',
    byLevel: {
      1: 'Identifikasi sumber daya (SDM, anggaran, infrastruktur) yang dimiliki masing-masing instansi. Mulai diskusi awal mengenai potensi berbagi sumber daya dan tentukan sumber daya mana yang dapat dikolaborasikan.',
      2: 'Buat kesepakatan tertulis sederhana mengenai kontribusi dan alokasi sumber daya antar mitra. Tetapkan mekanisme pemantauan penggunaan sumber daya secara berkala dan dokumentasikan hasilnya.',
      3: 'Formalisasikan skema berbagi sumber daya (resource sharing) melalui perjanjian kerja sama yang komprehensif. Bangun sistem pemantauan penggunaan sumber daya yang terintegrasi dan evaluasi efisiensinya secara rutin.',
      4: 'Optimalkan alokasi sumber daya menggunakan analitik berbasis data. Terapkan mekanisme realokasi dinamis sumber daya sesuai kebutuhan kolaborasi dan pastikan akuntabilitas penggunaan sumber daya seluruh mitra.',
      5: 'Kembangkan ekosistem berbagi sumber daya yang berkelanjutan dan inovatif. Eksplorasi model co-funding dan resource pooling lintas sektor, serta replikasikan praktik pengelolaan sumber daya terbaik ke instansi lain.',
    },
  },
  performance: {
    label: 'Kinerja dan Evaluasi',
    icon: '📊',
    byLevel: {
      1: 'Tetapkan indikator keberhasilan dasar (baseline) untuk setiap program kolaborasi. Mulai pencatatan progres sederhana dan jadwalkan sesi evaluasi perdana bersama seluruh mitra yang terlibat.',
      2: 'Susun KPI (Key Performance Indicator) kolaborasi yang disepakati dan terukur. Terapkan siklus evaluasi berkala sederhana dan mulai gunakan hasil evaluasi untuk perbaikan program yang berjalan.',
      3: 'Terapkan sistem pelaporan kinerja terintegrasi antar mitra. Standarisasi metodologi evaluasi dan pastikan setiap hasil evaluasi digunakan secara konsisten sebagai dasar perencanaan program berikutnya.',
      4: 'Gunakan dashboard kinerja berbasis data real-time untuk monitoring kolaborasi. Terapkan evaluasi berbasis dampak (impact evaluation) dan lakukan benchmarking dengan standar kolaborasi pemerintahan terbaik.',
      5: 'Jadikan evaluasi dan pembelajaran sebagai siklus inovasi berkelanjutan. Terapkan continuous improvement berbasis data, rayakan pencapaian kolaborasi secara formal, dan replikasikan model keberhasilan ke instansi lain.',
    },
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
    const key = q.dimensionKey;
    const val = Number(answers[q.id]) || 0;
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
 * Generate tactical recommendations based on dimension scores AND maturity level.
 * Each dimension's recommendation text is selected according to the dimension's own score level.
 * @param {Object} scoresPerDimension  – { dimensionLabel: averageScore }
 * @returns {Array} Array of recommendation objects with level-specific text
 */
export function getRecommendations(scoresPerDimension) {
  return DIMENSIONS
    .map(({ key, label }) => {
      const rec = RECOMMENDATIONS_BY_LEVEL[key];
      const score = scoresPerDimension[label] ?? 0;
      // Determine the maturity level for this specific dimension
      const dimMaturity = getMaturityLevel(score);
      const levelNum = dimMaturity.level;
      const actionText = rec?.byLevel?.[levelNum] ?? '';
      return rec
        ? { key, label, score, icon: rec.icon, text: actionText, level: levelNum, maturity: dimMaturity }
        : null;
    })
    .filter(Boolean);
}

// Legacy export for backwards compatibility – always show all dimensions
export const RECOMMENDATIONS = Object.fromEntries(
  Object.entries(RECOMMENDATIONS_BY_LEVEL).map(([key, val]) => [
    key,
    { label: val.label, threshold: 3.0, text: val.byLevel[3], icon: val.icon },
  ])
);
