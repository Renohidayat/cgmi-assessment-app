// ============================================================
// pages/assessment.js
// Questionnaire assessment page (Likert 1-5 scale)
// ============================================================

import { getQuestions, submitAssessment } from '../utils/firestore.js';
import { DEFAULT_QUESTIONS, calculateScores, getMaturityLevel } from '../utils/assessment-logic.js';
import { toast } from '../components/toast.js';

export function renderAssessment() {
  return `
  <div class="bg-[#f4f4f4] py-16 min-h-[85vh]">
    <div class="max-w-[1100px] mx-auto px-8">
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
  `;
}

export async function initAssessment(currentUser, userProfile) {
  const container = document.getElementById('questions-list-container');
  const form      = document.getElementById('assessment-form');

  if (!container || !form) return;

  let questions = [];

  // 1. Fetch questions from Firestore or fall back to default
  try {
    questions = await getQuestions();
    if (questions.length === 0) {
      questions = DEFAULT_QUESTIONS;
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
              <div class="grid grid-cols-5 gap-2 pt-2">
                ${[1, 2, 3, 4, 5].map(val => {
                  const labels = {
                    1: 'Sangat Tidak Setuju',
                    2: 'Tidak Setuju',
                    3: 'Netral',
                    4: 'Setuju',
                    5: 'Sangat Setuju'
                  };
                  return `
                    <label class="flex flex-col items-center gap-1.5 p-3 border border-[#d8d8d8] bg-[#f8f8f8] hover:bg-[#eef4ff] cursor-pointer transition-colors text-center">
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
      const { scoresPerDimension, totalAverageScore } = calculateScores(questions, answers);
      const maturity = getMaturityLevel(totalAverageScore);

      const assessmentDoc = {
        userId: currentUser.uid,
        userName: userProfile?.name || currentUser.displayName || currentUser.email,
        organization: userProfile?.organization || 'Institusi Publik',
        answers,
        scoresPerDimension,
        totalAverageScore,
        maturityLevel: maturity.label,
      };

      await submitAssessment(assessmentDoc);
      toast.success('Asesmen tata kelola kolaborasi berhasil disimpan!');
      window.location.hash = '/dashboard';
    } catch (err) {
      toast.error('Gagal mengirimkan asesmen: ' + err.message);
    }
  });
}
