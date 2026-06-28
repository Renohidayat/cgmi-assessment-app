import { getQuestions, submitAssessment } from '../utils/firestore.js';
import { DEFAULT_QUESTIONS, calculateScores, getMaturityLevel } from '../utils/assessment-logic.js';
import { toast } from '../components/toast.js';
import { registerUser, saveUserSession } from '../utils/auth.js';

const LIST_INSTANSI = [
  "Sekretariat Daerah",
  "Sekretariat DPRD",
  "Inspektorat Daerah",
  "Dinas Pendidikan",
  "Dinas Kesehatan",
  "Dinas Pekerjaan Umum dan Penataan Ruang",
  "Dinas Perumahan, Kawasan Permukiman dan Pertanahan",
  "Satuan Polisi Pamong Praja (Satpol PP)",
  "Dinas Sosial, Pemberdayaan Perempuan dan Perlindungan Anak",
  "Dinas Tenaga Kerja dan Transmigrasi",
  "Dinas Lingkungan Hidup dan Kehutanan",
  "Dinas Kependudukan dan Pencatatan Sipil",
  "Dinas Pemberdayaan Masyarakat dan Desa",
  "Dinas Pengendalian Penduduk dan Keluarga Berencana",
  "Dinas Perhubungan",
  "Dinas Komunikasi dan Informatika, Persandian dan Statistik",
  "Dinas Koperasi, UKM, Perdagangan dan Perindustrian",
  "Dinas Penanaman Modal dan PTSP",
  "Dinas Pariwisata, Kebudayaan, Kepemudaan dan Olahraga",
  "Dinas Arsip dan Perpustakaan",
  "Dinas Pertanian dan Ketahanan Pangan",
  "Dinas Perikanan dan Peternakan",
  "Badan Perencanaan, Pembangunan, Penelitian dan Pengembangan Daerah (Bapemda)",
  "Badan Kepegawaian dan Pengembangan SDM",
  "Badan Pengelolaan Keuangan dan Aset Daerah",
  "Badan Pengelolaan Pendapatan Daerah",
  "RSUD (Rumah Sakit Umum Daerah)",
  "Kecamatan Buahdua",
  "Kecamatan Cibugel",
  "Kecamatan Cimalaka",
  "Kecamatan Cimanggung",
  "Kecamatan Cisarua",
  "Kecamatan Cisitu",
  "Kecamatan Conggeang",
  "Kecamatan Darmaraja",
  "Kecamatan Ganeas",
  "Kecamatan Jatinangor",
  "Kecamatan Jatinunggal",
  "Kecamatan Jatigede",
  "Kecamatan Pamulihan",
  "Kecamatan Paseh",
  "Kecamatan Rancakalong",
  "Kecamatan Situraja",
  "Kecamatan Sukasari",
  "Kecamatan Sumedang Selatan",
  "Kecamatan Sumedang Utara",
  "Kecamatan Surian",
  "Kecamatan Tanjungkerta",
  "Kecamatan Tanjungmedar",
  "Kecamatan Tanjungsari",
  "Kecamatan Tomo",
  "Kecamatan Ujungjaya",
  "Kecamatan Wado"
];

const LAMA_BEKERJA_OPTIONS = [
  "< 1 Tahun",
  "1-3 Tahun",
  "3-5 Tahun",
  "5-10 Tahun",
  "> 10 Tahun"
];

export function renderAssessment() {
  const instansiOptions = LIST_INSTANSI.map(i => `<option value="${i}">${i}</option>`).join('');
  const lamaOptions = LAMA_BEKERJA_OPTIONS.map(l => `<option value="${l}">${l}</option>`).join('');

  return `
  <div class="bg-[#f4f4f4] py-16 min-h-[85vh]">
    <div class="max-w-[1100px] mx-auto px-8">
      
      <div id="assessment-main-content" class="space-y-8">
        <div class="carbon-card mb-8">
          <div class="flex flex-col lg:flex-row justify-between gap-6">
            <div>
              <h1 class="text-3xl font-[300] text-[#161616]">Kuesioner CGMI</h1>
              <p class="text-sm text-[#525252] mt-3">Isi instrumen dengan memilih skala kesetujuan yang paling mencerminkan kondisi riil organisasi Anda.</p>
            </div>
            <div class="text-sm font-semibold text-[#0f62fe]">6 Dimensi Kolaborasi</div>
          </div>

          <!-- Progress Tracker -->
          <div class="mt-8 space-y-3">
            <div class="flex justify-between text-xs font-semibold text-[#525252]">
              <span>Progres Asesmen</span>
              <span id="assessment-progress-txt">0% Terjawab</span>
            </div>
            <div class="carbon-panel p-0 bg-[#ffffff] border border-[#e0e0e0]">
              <div id="assessment-progress-bar" class="bg-[#0f62fe] h-2" style="width: 0%"></div>
            </div>
          </div>
        </div>

        <!-- Main Questionnaire Form -->
        <form id="assessment-form" class="space-y-6">
          
          <!-- Data Diri Responden (Integrated) -->
          <div class="carbon-card mb-8 space-y-6">
            <h3 class="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3 uppercase tracking-wide py-1">
              Data Diri Responden
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="carbon-field mb-0">
                <label for="setup-instansi" class="block text-xs font-semibold text-slate-700 mb-1">Instansi / OPD</label>
                <select id="setup-instansi" required class="carbon-input bg-[#f4f4f4]">
                  <option value="">-- Pilih Instansi --</option>
                  ${instansiOptions}
                </select>
              </div>

              <div class="carbon-field mb-0">
                <label for="setup-lama-bekerja" class="block text-xs font-semibold text-slate-700 mb-1">Lama Bekerja</label>
                <select id="setup-lama-bekerja" required class="carbon-input bg-[#f4f4f4]">
                  <option value="">-- Pilih Lama Bekerja --</option>
                  ${lamaOptions}
                </select>
              </div>

              <div class="carbon-field mb-0">
                <label for="setup-jabatan" class="block text-xs font-semibold text-slate-700 mb-1">Bidang</label>
                <input id="setup-jabatan" type="text" required placeholder="Contoh: Bidang Perencanaan" class="carbon-input">
              </div>
            </div>
          </div>

          <div id="questions-list-container" class="space-y-8">
            <!-- Loading skeleton -->
            <div class="animate-pulse space-y-4">
              <div class="h-6 bg-[#e0e0e0] w-1/3"></div>
              <div class="h-24 bg-[#e0e0e0]"></div>
              <div class="h-24 bg-[#e0e0e0]"></div>
            </div>
          </div>

          <!-- Submit Button Panel -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-[#ffffff] border border-[#e0e0e0]">
            <div class="text-xs text-[#525252] max-w-md">
              Pastikan seluruh pertanyaan telah dijawab sebelum mengirimkan formulir. Hasil akan dihitung secara otomatis setelah pengiriman.
            </div>
            <button type="submit" id="btn-submit-assessment" class="carbon-button shrink-0">
              Kirim Asesmen
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
  `;
}

export async function initAssessment(currentUser, userProfile) {
  // If user already took the survey, redirect to dashboard (only 1 submission allowed)
  if (currentUser && userProfile?.role !== 'admin') {
    toast.warning('Anda sudah melakukan pengisian asesmen.');
    window.location.hash = '/dashboard';
    return;
  }

  const container = document.getElementById('questions-list-container');
  const form      = document.getElementById('assessment-form');

  if (!container || !form) return;

  let questions = [];

  // 1. Fetch questions from Firestore or fall back to default
  try {
    const dbQuestions = await getQuestions();
    if (dbQuestions.length === 0) {
      questions = DEFAULT_QUESTIONS;
    } else {
      // Sync fetched questions with local DEFAULT_QUESTIONS to apply text/category updates
      questions = dbQuestions.map(q => {
        const localQ = DEFAULT_QUESTIONS.find(dq => dq.id === q.id);
        if (localQ) {
          return { ...q, text: localQ.text, dimension: localQ.dimension, dimensionKey: localQ.dimensionKey };
        }
        return q;
      });
    }
  } catch (err) {
    console.warn("Gagal mengambil kuesioner dari Firestore, menggunakan cadangan lokal:", err);
    questions = DEFAULT_QUESTIONS;
  }

  // 2. Render questions grouped by Dimension
  const grouped = questions.reduce((acc, q) => {
    const dim = q.dimension || 'Umum';
    if (!acc[dim]) acc[dim] = [];
    acc[dim].push(q);
    return acc;
  }, {});

  let htmlContent = '';
  let questionNumber = 1;

  for (const [dimensionName, qList] of Object.entries(grouped)) {
    htmlContent += `
      <div class="space-y-4">
        <h2 class="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3 uppercase tracking-wide py-1">
          Dimensi: ${dimensionName}
        </h2>
        <div class="space-y-4">
          ${qList.map(q => `
            <div class="carbon-panel space-y-4">
              <div class="flex items-start gap-3">
                <span class="inline-flex items-center justify-center w-8 h-8 border border-[#d8d8d8] text-sm font-semibold text-[#0f62fe]">${questionNumber++}</span>
                <p class="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">${q.text}</p>
              </div>

              <!-- Likert 1-5 Radios -->
              <div class="flex justify-between text-[9px] sm:hidden text-[#8c8c8c] font-semibold pt-1 px-1">
                <span>1: Sangat Tidak Setuju</span>
                <span>5: Sangat Setuju</span>
              </div>
              <div class="grid grid-cols-5 gap-1.5 pt-1.5">
                ${[1, 2, 3, 4, 5].map(val => {
                  const labels = {
                    1: 'Sangat Tidak Setuju',
                    2: 'Tidak Setuju',
                    3: 'Netral',
                    4: 'Setuju',
                    5: 'Sangat Setuju'
                  };
                  return `
                    <label class="flex flex-col items-center gap-1.5 p-2.5 sm:p-3 border border-[#d8d8d8] bg-[#f8f8f8] hover:bg-[#eef4ff] cursor-pointer transition-colors text-center">
                      <input type="radio" name="answer_${q.id}" value="${val}" required
                        class="w-4 h-4 text-[#0f62fe] border-[#8d8d8d] focus:ring-[#0f62fe] focus:ring-2">
                      <span class="text-[10px] font-bold text-[#525252] hidden sm:inline">${labels[val]}</span>
                      <span class="text-xs font-bold text-[#161616]">${val}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = htmlContent;

  // 3. Setup real-time progress bar calculation
  const totalQuestions = questions.length;
  form.addEventListener('change', () => {
    const answeredCount = form.querySelectorAll('input[type="radio"]:checked').length;
    const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
    
    const progressTxt = document.getElementById('assessment-progress-txt');
    const progressBar = document.getElementById('assessment-progress-bar');
    
    if (progressTxt) progressTxt.innerText = `${progressPercent}% Terjawab (${answeredCount}/${totalQuestions})`;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;
  });

  // 4. Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Read Profile Details
    const instansi = document.getElementById('setup-instansi').value;
    const lamaBekerja = document.getElementById('setup-lama-bekerja').value;
    const jabatan = document.getElementById('setup-jabatan').value.trim();
    const submitBtn = document.getElementById('btn-submit-assessment');

    if (!instansi || !lamaBekerja || !jabatan) {
      toast.warning('Silakan isi seluruh Data Diri Responden di bagian atas form.');
      return;
    }

    const answers = {};
    questions.forEach(q => {
      const selected = form.querySelector(`input[name="answer_${q.id}"]:checked`);
      if (selected) {
        answers[q.id] = Number(selected.value);
      }
    });

    // Integrity check
    if (Object.keys(answers).length < totalQuestions) {
      toast.warning('Harap jawab semua pertanyaan kuesioner sebelum mengirimkan.');
      return;
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Mengirimkan...';
      }

      // 1. Register User Profile (creating anonymous user in Firestore)
      const profile = await registerUser({ instansi, lamaBekerja, jabatan });

      // 2. Save session to localStorage
      saveUserSession({
        uid: profile.uuid,
        instansi: profile.instansi,
        lamaBekerja: profile.lamaBekerja,
        jabatan: profile.jabatan,
        role: 'user',
      });

      // 3. Calculate scores
      const { scoresPerDimension, totalAverageScore } = calculateScores(questions, answers);
      const maturity = getMaturityLevel(totalAverageScore);

      const assessmentDoc = {
        userId: profile.uuid,
        userName: profile.jabatan,
        organization: profile.instansi,
        lamaBekerja: profile.lamaBekerja,
        answers,
        scoresPerDimension,
        totalAverageScore,
        maturityLevel: maturity.label,
      };

      // 4. Submit assessment with generated userId
      await submitAssessment(assessmentDoc);
      toast.success('Asesmen tata kelola kolaborasi berhasil disimpan!');
      
      // Update location and trigger reload to reflect logged-in state across app shell
      window.location.hash = '/dashboard';
      setTimeout(() => {
        window.location.reload();
      }, 150);
    } catch (err) {
      toast.error('Gagal mengirimkan asesmen: ' + err.message);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Kirim Asesmen';
      }
    }
  });
}
