/* ═══════════════════════════════════════════════════════════════
   AUTO-TA EXAM GENERATOR — Agentic AI Workflow Engine
   Multi-Agent: Manager → [Concept Writer ‖ Programmer ‖ Mathematician]
                         → Editor (Compiler) → HITL Checkpoint
   ═══════════════════════════════════════════════════════════════ */

// ─── State ────────────────────────────────────────────────────────
const State = {
  subject: '',
  totalMarks: 50,
  duration: 180,
  difficulty: 'medium',
  examType: 'midterm',
  topicFocus: '',
  qTypes: [],
  university: '',
  conceptDraft: null,
  coderDraft: null,
  mathDraft: null,
  finalPaper: null,
  feedback: '',
  iteration: 0,
};

// ─── Particle Background ──────────────────────────────────────────
function initParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 15 + 10}s;
      animation-delay:${Math.random() * 10}s;
      opacity:${Math.random() * 0.5};
    `;
    container.appendChild(p);
  }
}

// ─── Logging ─────────────────────────────────────────────────────
function log(msg, type = 'info') {
  const out = document.getElementById('logOutput');
  const line = document.createElement('div');
  line.className = `log-line ${type}`;
  const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
  line.textContent = `[${ts}] ${msg}`;
  out.appendChild(line);
  out.scrollTop = out.scrollHeight;
}

// ─── Pipeline Step State Manager ──────────────────────────────────
function setStep(id, state /* idle|active|done|error */, statusText) {
  const ind = document.getElementById(`ind-${id}`);
  const st  = document.getElementById(`status-${id}`);
  if (!ind || !st) return;
  ind.className = `step-indicator ${state}`;
  st.textContent = statusText;
  st.className = `step-status s-${state}`;
}

function resetPipeline() {
  ['manager','concept','programmer','math','editor','review'].forEach(id => {
    setStep(id, 'idle', 'Idle');
  });
}

// ─── Sleep util ───────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ─── Question Bank Templates ──────────────────────────────────────
function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ─── AGENT A: Concept Writer ──────────────────────────────────────
async function agentConceptWriter(state) {
  setStep('concept', 'active', '✍️ Drafting theory questions...');
  log('► Agent A (Concept Writer) activated — generating SAQ/MCQ/Long-Answer', 'agent');
  await sleep(900 + Math.random() * 600);

  const sub = state.subject;
  const diff = state.difficulty;
  const topic = state.topicFocus || sub;

  // MCQ Bank
  const mcqBank = generateMCQs(sub, topic, diff);
  // Short Answer Bank
  const saqBank = generateSAQs(sub, topic, diff);
  // Long Answer Bank
  const laqBank = generateLAQs(sub, topic, diff);

  log('✓ Agent A — Theory questions drafted', 'success');
  setStep('concept', 'done', '✓ Done — Theory drafted');
  return { mcqs: mcqBank, saqs: saqBank, laqs: laqBank };
}

// ─── AGENT B: Programmer ─────────────────────────────────────────
async function agentProgrammer(state) {
  setStep('programmer', 'active', '💻 Generating coding tasks...');
  log('► Agent B (Programmer) activated — generating code problems', 'agent');
  await sleep(800 + Math.random() * 700);

  const sub = state.subject;
  const diff = state.difficulty;
  const topic = state.topicFocus || sub;
  const codeQs = generateCodeProblems(sub, topic, diff);

  log('✓ Agent B — Code problems ready', 'success');
  setStep('programmer', 'done', '✓ Done — Code problems ready');
  return { codeQuestions: codeQs };
}

// ─── AGENT C: Mathematician ───────────────────────────────────────
async function agentMathematician(state) {
  setStep('math', 'active', '∑ Creating numerical problems...');
  log('► Agent C (Mathematician) activated — computing numerical problems', 'agent');
  await sleep(1000 + Math.random() * 500);

  const sub = state.subject;
  const diff = state.difficulty;
  const topic = state.topicFocus || sub;
  const numQs = generateNumericalProblems(sub, topic, diff);

  log('✓ Agent C — Numerical problems computed', 'success');
  setStep('math', 'done', '✓ Done — Numericals computed');
  return { numericalQuestions: numQs };
}

// ─── EDITOR (Compiler Agent) ──────────────────────────────────────
async function agentEditor(state, conceptDraft, coderDraft, mathDraft) {
  setStep('editor', 'active', '📝 Compiling & formatting...');
  log('► Editor Agent (Compiler) — gathering all drafts and assembling paper', 'agent');
  await sleep(600 + Math.random() * 400);

  const qTypes = state.qTypes;
  const totalMarks = state.totalMarks;

  // Smart mark allocation
  const allocation = allocateMarks(totalMarks, qTypes, conceptDraft, coderDraft, mathDraft, state.difficulty);

  log('✓ Editor — Paper compiled & formatted', 'success');
  setStep('editor', 'done', '✓ Done — Paper compiled');
  return allocation;
}

// ─── MANAGER (Router Agent) ───────────────────────────────────────
async function agentManager(state) {
  setStep('manager', 'active', '🔀 Routing to parallel agents...');
  log('► Manager Agent (Router) — analyzing prompt, routing to specialist agents', 'agent');
  await sleep(500);
  log(`  Subject: "${state.subject}" | Marks: ${state.totalMarks} | Difficulty: ${state.difficulty}`, 'info');
  log('  Routing: FAN-OUT → Concept Writer ‖ Programmer ‖ Mathematician', 'info');
  setStep('manager', 'done', '✓ Done — Routed');
}

// ─── MAIN ORCHESTRATION ───────────────────────────────────────────
async function runAgenticWorkflow(state) {
  State.iteration++;
  log(`═══ Run #${State.iteration} initiated ═══`, 'system');

  // Reset UI
  resetPipeline();
  document.getElementById('resultSection').style.display = 'none';

  // Step 1: Manager Agent
  await agentManager(state);
  await sleep(300);

  // Step 2: FAN-OUT — run 3 agents in parallel
  log('⚡ FAN-OUT: Spawning parallel agents...', 'warning');
  const [conceptDraft, coderDraft, mathDraft] = await Promise.all([
    agentConceptWriter(state),
    agentProgrammer(state),
    agentMathematician(state),
  ]);

  log('⚡ FAN-IN: All agents completed. Aggregating...', 'warning');
  await sleep(300);

  // Step 3: Editor / Compiler
  const compiledPaper = await agentEditor(state, conceptDraft, coderDraft, mathDraft);
  State.finalPaper = compiledPaper;

  // Step 4: HITL Checkpoint
  setStep('review', 'active', '⏸ Awaiting professor review...');
  log('⏸ CHECKPOINT: System paused — Human-in-the-loop review required', 'warning');
  await sleep(400);

  // Render the paper
  renderExamPaper(state, compiledPaper);

  // Show result section
  const resultSection = document.getElementById('resultSection');
  resultSection.style.display = 'block';
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  setStep('review', 'active', '⏸ Awaiting review...');
  log('✓ Draft ready for professor review. Approve or send feedback.', 'success');
}

// ─── Mark Allocation ─────────────────────────────────────────────
function allocateMarks(total, qTypes, conceptDraft, coderDraft, mathDraft, difficulty) {
  const sections = [];
  let remaining = total;
  const has = type => qTypes.includes(type);

  // Base weights per section
  const weights = {
    mcq:       has('mcq')       ? 1.0 : 0,
    saq:       has('saq')       ? 1.5 : 0,
    long:      has('long')      ? 2.5 : 0,
    code:      has('code')      ? 2.0 : 0,
    numerical: has('numerical') ? 2.0 : 0,
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1;

  const marksMap = {};
  Object.keys(weights).forEach(k => {
    marksMap[k] = Math.floor((weights[k] / totalWeight) * total);
  });

  // MCQ Section
  if (has('mcq') && marksMap.mcq > 0) {
    const marksPerQ = difficulty === 'easy' ? 1 : difficulty === 'advanced' ? 3 : 2;
    const count = Math.max(2, Math.floor(marksMap.mcq / marksPerQ));
    sections.push({
      type: 'mcq',
      title: 'Section A — Multiple Choice Questions',
      questions: pickRandom(conceptDraft.mcqs, count).map((q, i) => ({
        ...q, num: i + 1, marks: marksPerQ,
      })),
      totalMarks: count * marksPerQ,
    });
    remaining -= count * marksPerQ;
  }

  // SAQ Section
  if (has('saq') && marksMap.saq > 0) {
    const marksPerQ = difficulty === 'easy' ? 2 : difficulty === 'advanced' ? 5 : 3;
    const count = Math.max(2, Math.floor(marksMap.saq / marksPerQ));
    sections.push({
      type: 'saq',
      title: 'Section B — Short Answer Questions',
      questions: pickRandom(conceptDraft.saqs, count).map((q, i) => ({
        ...q, num: i + 1, marks: marksPerQ,
      })),
      totalMarks: count * marksPerQ,
    });
  }

  // Coding Problems
  if (has('code') && marksMap.code > 0) {
    const marksPerQ = difficulty === 'easy' ? 4 : difficulty === 'advanced' ? 10 : 7;
    const count = Math.max(1, Math.floor(marksMap.code / marksPerQ));
    sections.push({
      type: 'code',
      title: 'Section C — Programming Problems',
      questions: pickRandom(coderDraft.codeQuestions, count).map((q, i) => ({
        ...q, num: i + 1, marks: marksPerQ,
      })),
      totalMarks: count * marksPerQ,
    });
  }

  // Numerical Problems
  if (has('numerical') && marksMap.numerical > 0) {
    const marksPerQ = difficulty === 'easy' ? 3 : difficulty === 'advanced' ? 8 : 5;
    const count = Math.max(1, Math.floor(marksMap.numerical / marksPerQ));
    sections.push({
      type: 'numerical',
      title: 'Section D — Numerical Problems',
      questions: pickRandom(mathDraft.numericalQuestions, count).map((q, i) => ({
        ...q, num: i + 1, marks: marksPerQ,
      })),
      totalMarks: count * marksPerQ,
    });
  }

  // Long Answer Questions
  if (has('long') && marksMap.long > 0) {
    const marksPerQ = difficulty === 'easy' ? 5 : difficulty === 'advanced' ? 15 : 10;
    const count = Math.max(1, Math.floor(marksMap.long / marksPerQ));
    const sectionLetter = String.fromCharCode(65 + sections.length);
    sections.push({
      type: 'long',
      title: `Section ${sectionLetter} — Long Answer Questions`,
      questions: pickRandom(conceptDraft.laqs, count).map((q, i) => ({
        ...q, num: i + 1, marks: marksPerQ,
      })),
      totalMarks: count * marksPerQ,
    });
  }

  // Re-calculate total
  const computedTotal = sections.reduce((s, sec) => s + sec.totalMarks, 0);

  return { sections, computedTotal, requestedTotal: total };
}

// ─── Render Exam Paper ────────────────────────────────────────────
function renderExamPaper(state, paper) {
  const el = document.getElementById('examPaperContent');
  const examTypeLabel = {
    university: 'University Examination',
    midterm: 'Mid-Term Examination',
    final: 'Final Examination',
    quiz: 'Quiz',
  }[state.examType] || 'Examination';

  const diffLabel = {
    easy: 'Easy', medium: 'Intermediate', hard: 'Hard', advanced: 'Advanced',
  }[state.difficulty] || 'Standard';

  let html = `
    <div class="paper-header">
      ${state.university ? `<div class="paper-university">${state.university}</div>` : ''}
      <div class="paper-exam-title">${examTypeLabel}</div>
      <div class="paper-subject">${state.subject}</div>
      <div class="paper-meta">
        <span>📅 Date: ${new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' })}</span>
        <span>⏱ Duration: ${state.duration} Minutes</span>
        <span>📊 Max Marks: ${paper.computedTotal}</span>
        <span>🎯 Level: ${diffLabel}</span>
      </div>
    </div>

    <div class="paper-instructions">
      <h4>📌 General Instructions:</h4>
      <ol>
        <li>All questions are compulsory unless stated otherwise.</li>
        <li>Write legibly. Marks may be deducted for illegible handwriting.</li>
        <li>Start each section on a new page.</li>
        <li>Figures/diagrams should be neat and labeled appropriately.</li>
        <li>Mobile phones and electronic devices are strictly prohibited.</li>
        ${state.qTypes.includes('code') ? '<li>For programming questions, you may use any standard language unless specified.</li>' : ''}
      </ol>
    </div>
  `;

  paper.sections.forEach(section => {
    html += `
      <div class="paper-section">
        <div class="section-heading">${section.title} &nbsp;[${section.totalMarks} Marks]</div>
    `;

    section.questions.forEach((q, i) => {
      if (section.type === 'mcq') {
        html += `
          <div class="question">
            <span class="q-num">Q${q.num}.</span>
            <div class="q-text">
              ${q.text}
              <div class="mcq-options">
                ${q.options.map((opt, idx) => `<div class="mcq-option">${String.fromCharCode(65+idx)}. ${opt}</div>`).join('')}
              </div>
            </div>
            <span class="q-marks">[${q.marks} Mark${q.marks>1?'s':''}]</span>
          </div>
        `;
      } else {
        html += `
          <div class="question">
            <span class="q-num">Q${q.num}.</span>
            <div class="q-text">
              ${q.text}
              ${q.subParts ? q.subParts.map((sp, si) => `<span class="q-sub">${String.fromCharCode(97+si)}) ${sp}</span>`).join('') : ''}
              ${q.hint ? `<span class="q-sub" style="color:#888;font-style:italic;">Hint: ${q.hint}</span>` : ''}
            </div>
            <span class="q-marks">[${q.marks} Marks]</span>
          </div>
        `;
      }
    });

    html += `</div>`;
  });

  html += `
    <div style="text-align:center; margin-top:2rem; padding-top:1rem; border-top:2px solid #333; font-size:0.85rem; color:#666;">
      *** End of Examination Paper *** &nbsp;|&nbsp; Generated by Auto-TA Multi-Agent System &nbsp;|&nbsp; Total Questions: ${paper.sections.reduce((s,sec)=>s+sec.questions.length,0)} &nbsp;|&nbsp; Total Marks: ${paper.computedTotal}
    </div>
  `;

  el.innerHTML = html;
}

// ─── APPROVE PAPER ────────────────────────────────────────────────
function approvePaper() {
  setStep('review', 'done', '✓ Approved by Professor');
  log('✅ Professor approved the exam paper!', 'success');
  log('📄 Triggering PDF download...', 'info');

  // Trigger print/PDF
  const printContents = document.getElementById('paperContainer').innerHTML;
  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${State.subject} Exam Paper — Auto-TA</title>
      <style>
        body { font-family:'Times New Roman',serif; color:#111; padding:2cm; margin:0; }
        .paper-university { font-size:1.3rem; font-weight:700; text-transform:uppercase; text-align:center; }
        .paper-exam-title { font-size:1.1rem; font-weight:600; text-align:center; margin-top:0.3rem; }
        .paper-subject { font-size:1.4rem; font-weight:700; text-align:center; color:#1a1a1a; margin:0.75rem 0 0.3rem; }
        .paper-header { text-align:center; border-bottom:3px double #333; padding-bottom:1rem; margin-bottom:2rem; }
        .paper-meta { display:flex; justify-content:space-between; border:1px solid #ccc; padding:0.5rem 1rem; font-size:0.9rem; }
        .paper-instructions { background:#f9f9f9; border-left:4px solid #333; padding:0.75rem 1rem; margin-bottom:2rem; font-size:0.88rem; }
        .section-heading { background:#1a1a2e; color:white; padding:0.5rem 1rem; font-size:1rem; font-weight:700; margin-bottom:1rem; }
        .question { display:grid; grid-template-columns:auto 1fr auto; gap:0.5rem; margin-bottom:1.25rem; padding-bottom:0.75rem; border-bottom:1px dotted #ddd; align-items:start; }
        .q-num { font-weight:700; }
        .q-marks { font-weight:700; white-space:nowrap; }
        .mcq-options { display:grid; grid-template-columns:1fr 1fr; gap:0.25rem; margin-top:0.5rem; }
        .q-sub { display:block; margin-top:0.5rem; padding-left:1rem; color:#444; font-size:0.9rem; }
        .paper-section { margin-bottom:2.5rem; }
        @media print { body { padding:1.5cm; } }
      </style>
    </head>
    <body>${printContents}</body>
    </html>
  `);
  win.document.close();
  setTimeout(() => win.print(), 500);

  // Show toast
  showToast('✓ Paper approved! Print dialog opened.', 'success');
}

// ─── FEEDBACK MODAL ───────────────────────────────────────────────
function showFeedbackModal() {
  document.getElementById('feedbackModal').style.display = 'flex';
  document.getElementById('feedbackText').value = '';
  setTimeout(() => document.getElementById('feedbackText').focus(), 100);
}
function closeFeedbackModal() {
  document.getElementById('feedbackModal').style.display = 'none';
}

async function submitFeedback() {
  const fb = document.getElementById('feedbackText').value.trim();
  if (!fb) { showToast('Please enter feedback before submitting.', 'warn'); return; }
  closeFeedbackModal();

  State.feedback = fb;
  log(`⟳ Feedback received: "${fb}"`, 'warning');
  log('⟳ Iterative feedback loop — re-running agent pipeline...', 'warning');

  setStep('review', 'idle', 'Idle');
  showGeneratingState(true);
  await runAgenticWorkflow(State);
  showGeneratingState(false);
}

// ─── FORM SUBMISSION ──────────────────────────────────────────────
document.getElementById('examForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  // Read state
  State.subject    = form.subjectName.value.trim() || 'Computer Science';
  State.totalMarks = parseInt(form.totalMarks.value) || 50;
  State.duration   = parseInt(form.duration.value) || 180;
  State.difficulty = form.difficulty.value;
  State.examType   = form.examType.value;
  State.topicFocus = form.topicFocus.value.trim();
  State.university = form.university.value.trim();
  State.qTypes     = [...document.querySelectorAll('input[name="qTypes"]:checked')].map(cb => cb.value);

  if (!State.qTypes.length) State.qTypes = ['saq', 'long'];

  // Clear log
  document.getElementById('logOutput').innerHTML = '';
  log('★ Exam generation request received', 'system');

  showGeneratingState(true);
  await runAgenticWorkflow(State);
  showGeneratingState(false);
});

function showGeneratingState(isGenerating) {
  const btn = document.getElementById('generateBtn');
  const btnText = btn.querySelector('.btn-text');
  const btnIcon = btn.querySelector('.btn-icon');
  const btnLoader = btn.querySelector('.btn-loader');

  if (isGenerating) {
    btn.disabled = true;
    btnText.style.display = 'none';
    btnIcon.style.display = 'none';
    btnLoader.style.display = 'flex';
  } else {
    btn.disabled = false;
    btnText.style.display = '';
    btnIcon.style.display = '';
    btnLoader.style.display = 'none';
  }
}

// ─── TOAST ────────────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:2rem; right:2rem; z-index:9999;
    background:${type==='success'?'rgba(6,255,165,0.15)':type==='warn'?'rgba(251,191,36,0.15)':'rgba(0,212,255,0.15)'};
    border:1px solid ${type==='success'?'rgba(6,255,165,0.4)':type==='warn'?'rgba(251,191,36,0.4)':'rgba(0,212,255,0.4)'};
    color:${type==='success'?'#06ffa5':type==='warn'?'#fbbf24':'#00d4ff'};
    padding:0.75rem 1.5rem;
    border-radius:12px;
    font-size:0.9rem; font-weight:600;
    font-family:'Inter',sans-serif;
    backdrop-filter:blur(20px);
    box-shadow:0 4px 20px rgba(0,0,0,0.4);
    animation:fade-in 0.3s ease;
    max-width:360px;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ═══════════════════════════════════════════════════════════════════
// QUESTION GENERATION ENGINE
// Dynamic template-based generation keyed by subject keywords
// ═══════════════════════════════════════════════════════════════════

function detectDomain(subject) {
  const s = (subject + ' ').toLowerCase();
  if (/machine.?learning|ml|ai|deep.?learning|neural/.test(s)) return 'ml';
  if (/data.?structure|algorithm|dsa/.test(s)) return 'dsa';
  if (/database|dbms|sql|rdbms/.test(s)) return 'db';
  if (/operating.?system|os/.test(s)) return 'os';
  if (/network|cn|tcp|ip/.test(s)) return 'cn';
  if (/web|html|css|javascript|react|node/.test(s)) return 'web';
  if (/math|calculus|algebra|statistics|probability/.test(s)) return 'math';
  if (/physics/.test(s)) return 'physics';
  if (/chemistry/.test(s)) return 'chemistry';
  if (/python|java|c\+\+|programming/.test(s)) return 'prog';
  if (/software.?eng|se|sdlc/.test(s)) return 'se';
  if (/computer.?organization|coa|digital/.test(s)) return 'coa';
  return 'general';
}

function generateMCQs(subject, topic, difficulty) {
  const domain = detectDomain(subject);
  const pools = {
    ml: [
      { text: 'Which of the following is a supervised learning algorithm?', options: ['K-Means Clustering', 'Random Forest', 'DBSCAN', 'Principal Component Analysis'], answer: 'B' },
      { text: 'Gini Impurity is used in which algorithm?', options: ['K-Nearest Neighbors', 'Linear Regression', 'Decision Tree', 'Naive Bayes'], answer: 'C' },
      { text: 'What does the bias-variance tradeoff refer to?', options: ['Model complexity vs training time', 'Prediction error from wrong assumptions vs sensitivity to training data', 'Number of features vs accuracy', 'Training set size vs test set size'], answer: 'B' },
      { text: 'Which activation function is used in the output layer for binary classification?', options: ['ReLU', 'Tanh', 'Sigmoid', 'Softmax'], answer: 'C' },
      { text: 'Which metric is most appropriate for imbalanced datasets?', options: ['Accuracy', 'Mean Squared Error', 'F1-Score', 'R²'], answer: 'C' },
      { text: 'In gradient descent, learning rate controls:', options: ['Number of epochs', 'Step size in weight update', 'Number of hidden layers', 'Dropout probability'], answer: 'B' },
      { text: 'Which of the following is a regularization technique?', options: ['Batch Normalization', 'L2 Regularization (Ridge)', 'Feature Scaling', 'Cross Entropy Loss'], answer: 'B' },
      { text: 'Support Vector Machine finds the optimal hyperplane by maximizing:', options: ['Accuracy', 'The margin between classes', 'The kernel width', 'The variance'], answer: 'B' },
      { text: 'Which algorithm is used for dimensionality reduction?', options: ['Random Forest', 'PCA', 'KNN', 'SVM'], answer: 'B' },
      { text: 'The term "overfitting" means:', options: ['Model too simple for data', 'Model fits training data too well but fails on new data', 'Model takes too long to train', 'Model uses too many features'], answer: 'B' },
    ],
    dsa: [
      { text: 'What is the time complexity of binary search?', options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'], answer: 'C' },
      { text: 'Which data structure uses LIFO principle?', options: ['Queue', 'Stack', 'Linked List', 'Heap'], answer: 'B' },
      { text: 'What is the height of a complete binary tree with n nodes?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(√n)'], answer: 'B' },
      { text: 'Dijkstra\'s algorithm is used for:', options: ['Minimum spanning tree', 'Shortest path from source', 'Topological sort', 'Graph coloring'], answer: 'B' },
      { text: 'Which sorting algorithm is NOT stable?', options: ['Merge Sort', 'Bubble Sort', 'Quick Sort', 'Insertion Sort'], answer: 'C' },
      { text: 'In a max-heap, the root contains:', options: ['The minimum element', 'The maximum element', 'A random element', 'The median'], answer: 'B' },
      { text: 'AVL trees maintain balance by:', options: ['Color coding nodes', 'Rotations after insertion/deletion', 'Hashing', 'Level-order traversal'], answer: 'B' },
      { text: 'Which traversal of BST gives sorted output?', options: ['Preorder', 'Postorder', 'Inorder', 'Level-order'], answer: 'C' },
    ],
    db: [
      { text: 'ACID in databases stands for:', options: ['Array, Consistency, Integrity, Durability', 'Atomicity, Consistency, Isolation, Durability', 'Atomicity, Concurrency, Integrity, Distribution', 'Access, Control, Integrity, Durability'], answer: 'B' },
      { text: 'Which SQL clause filters groups after grouping?', options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], answer: 'B' },
      { text: 'A foreign key refers to:', options: ['Primary key of the same table', 'Primary key of another table', 'A unique index', 'A composite key'], answer: 'B' },
      { text: 'Normalization primarily aims to reduce:', options: ['Query execution time', 'Data redundancy and anomalies', 'Number of tables', 'Index size'], answer: 'B' },
      { text: '3NF requires:', options: ['No partial dependencies', 'No transitive dependencies', 'No multivalued dependencies', 'All attributes are prime'], answer: 'B' },
    ],
    os: [
      { text: 'Which scheduling algorithm can lead to starvation?', options: ['Round Robin', 'FCFS', 'Priority Scheduling', 'SJF'], answer: 'C' },
      { text: 'Page replacement policy that replaces the page used least recently:', options: ['FIFO', 'LRU', 'Optimal', 'Random'], answer: 'B' },
      { text: 'Deadlock requires all four conditions: Mutual Exclusion, Hold & Wait, No Preemption, and:', options: ['Starvation', 'Circular Wait', 'Aging', 'Bounded Waiting'], answer: 'B' },
      { text: 'A semaphore with initial value of 1 is called:', options: ['Counting semaphore', 'Binary semaphore (Mutex)', 'Barrier', 'Monitor'], answer: 'B' },
      { text: 'Thrashing occurs when:', options: ['CPU utilization is very high', 'Too many processes are page faulting', 'I/O is very fast', 'Cache miss rate is low'], answer: 'B' },
    ],
    general: [
      { text: `Which of the following best describes ${subject}?`, options: ['A programming language', 'A field of study focusing on computational methods', 'A hardware component', 'A network protocol'], answer: 'B' },
      { text: `What is the primary goal of ${subject}?`, options: ['To increase hardware performance', 'To solve complex problems efficiently', 'To design databases', 'To create network topologies'], answer: 'B' },
      { text: `Which of the following is a key concept in ${subject}?`, options: ['Memory allocation', 'Algorithm design', 'Network routing', 'Circuit design'], answer: 'B' },
      { text: `Complexity analysis in ${subject} primarily deals with:`, options: ['Hardware costs', 'Time and space resource usage', 'Code readability', 'Documentation quality'], answer: 'B' },
      { text: 'Which paradigm emphasizes reusability through encapsulation?', options: ['Procedural', 'Object-Oriented', 'Functional', 'Logic'], answer: 'B' },
    ],
  };

  const list = pools[domain] || pools.general;
  // Ensure we always have enough
  while (list.length < 12) list.push(...(pools.general || list));
  return list;
}

function generateSAQs(subject, topic, difficulty) {
  const domain = detectDomain(subject);
  const advanced = difficulty === 'hard' || difficulty === 'advanced';

  const pools = {
    ml: [
      { text: `Explain the concept of overfitting in ${subject} and list two techniques to prevent it.` },
      { text: 'Differentiate between classification and regression with one example each.' },
      { text: 'What is a confusion matrix? Define Precision, Recall, and F1-Score.' },
      { text: 'Explain the working of the K-Nearest Neighbor (KNN) algorithm.' },
      { text: 'What is the purpose of cross-validation? Explain k-fold cross-validation.' },
      { text: 'Define entropy in the context of decision trees. How is it used for splitting?' },
      { text: 'Explain the curse of dimensionality and its impact on ML models.' },
      { text: 'What is a kernel function in SVM? Name three commonly used kernels.' },
      { text: `Describe the bias-variance tradeoff in the context of ${topic || subject}.` },
      { text: 'What is bagging? How does Random Forest implement it?' },
      { text: 'Explain the backpropagation algorithm in neural networks.' },
      { text: 'What is dropout regularization? When is it applied?' },
    ],
    dsa: [
      { text: 'Explain the difference between a Stack and a Queue with real-world examples.' },
      { text: 'What is a balanced BST? Why is balancing important?' },
      { text: 'Describe the merge sort algorithm and analyze its time complexity.' },
      { text: 'What are hash collisions? Describe two methods to handle them.' },
      { text: 'Explain Dijkstra\'s shortest path algorithm with a brief example.' },
      { text: 'What is dynamic programming? State the principle of optimal substructure.' },
      { text: 'Differentiate between BFS and DFS. When would you prefer each?' },
      { text: 'Explain the concept of amortized analysis with an example.' },
    ],
    db: [
      { text: 'What are the ACID properties of a transaction? Explain each briefly.' },
      { text: 'Explain First, Second, and Third Normal Forms with examples.' },
      { text: 'What is a deadlock in DBMS? How is it detected and resolved?' },
      { text: 'Differentiate between DDL and DML commands with examples.' },
      { text: 'Explain the difference between INNER JOIN and LEFT OUTER JOIN.' },
    ],
    general: [
      { text: `Briefly explain the fundamental principles of ${subject}.` },
      { text: `What are the key differences between ${topic || subject} approaches? Provide examples.` },
      { text: `Describe the main advantages and disadvantages of ${topic || 'this method'}.` },
      { text: `Explain the role of abstraction in ${subject} with a suitable example.` },
      { text: `What is the significance of complexity analysis in ${subject}?` },
      { text: `Describe a real-world application of ${topic || subject}.` },
    ],
  };

  const list = pools[domain] || pools.general;
  while (list.length < 12) list.push(...(pools.general || list));
  return list;
}

function generateLAQs(subject, topic, difficulty) {
  const domain = detectDomain(subject);

  const pools = {
    ml: [
      { text: `Explain the Random Forest algorithm in detail.`, subParts: ['How does it build multiple decision trees?', 'How are predictions aggregated?', 'What are its advantages over a single decision tree?', 'Discuss any two hyperparameters and their effect on model performance.'] },
      { text: `With a neat diagram, explain the architecture of a Convolutional Neural Network (CNN).`, subParts: ['Describe the role of convolutional layers.', 'Explain pooling layers and their purpose.', 'How is a CNN trained using backpropagation?', 'Give two real-world applications of CNNs.'] },
      { text: 'Describe the complete pipeline of a machine learning project from data collection to deployment.', subParts: ['Data collection and preprocessing steps.', 'Feature engineering techniques.', 'Model selection and validation strategy.', 'Deployment and monitoring best practices.'] },
      { text: 'Compare and contrast Gradient Descent variants: Batch GD, Stochastic GD, and Mini-Batch GD.', subParts: ['Define each variant.', 'Discuss convergence behavior.', 'Which is preferred in practice and why?'] },
    ],
    dsa: [
      { text: 'Explain AVL Trees in detail.', subParts: ['Define balance factor.', 'Describe all four rotations (LL, RR, LR, RL) with examples.', 'Prove that the height is O(log n).', 'Compare AVL trees with Red-Black trees.'] },
      { text: 'Explain dynamic programming with the help of the 0/1 Knapsack problem.', subParts: ['State the problem formally.', 'Develop the recursive formula.', 'Show the DP table construction step by step.', 'Analyze time and space complexity.'] },
    ],
    general: [
      { text: `Write a comprehensive essay on ${topic || subject} covering its history, core principles, and modern applications.`, subParts: ['Historical background and development.', 'Key concepts and theoretical foundations.', 'Modern applications and industry use cases.', 'Future directions and open challenges.'] },
      { text: `Compare and contrast at least three major approaches in ${topic || subject}.`, subParts: ['Define each approach with examples.', 'Discuss strengths and weaknesses.', 'Provide a table summarizing differences.', 'Recommend an approach for a given scenario and justify.'] },
    ],
  };

  const list = pools[domain] || pools.general;
  while (list.length < 6) list.push(...(pools.general || list));
  return list;
}

function generateCodeProblems(subject, topic, difficulty) {
  const domain = detectDomain(subject);

  const pools = {
    ml: [
      { text: 'Write a Python function to compute the Gini Impurity for a given set of class labels. Test it with an example.', hint: 'Gini = 1 - Σ(pᵢ)²' },
      { text: 'Implement K-Nearest Neighbors (KNN) from scratch using Python without using sklearn. Use Euclidean distance.', hint: 'Sort distances and pick top-k neighbors.' },
      { text: 'Write Python code to train a Decision Tree classifier on the Iris dataset using sklearn. Plot the confusion matrix.', hint: 'Use DecisionTreeClassifier and ConfusionMatrixDisplay.' },
      { text: 'Implement a simple Linear Regression using gradient descent from scratch in Python. Show loss convergence.', hint: 'θ = θ - α * ∂J/∂θ' },
      { text: 'Write a Python script to apply PCA and reduce the dimensionality of a dataset from 10 features to 2. Visualize using matplotlib.', hint: 'Use sklearn.decomposition.PCA' },
    ],
    dsa: [
      { text: 'Implement a binary search tree in Python/Java with insert, delete, and inorder traversal operations.' },
      { text: 'Write an iterative implementation of Quick Sort. Analyze its space complexity compared to recursive version.' },
      { text: 'Implement Dijkstra\'s shortest path algorithm using a priority queue (min-heap).' },
      { text: 'Write a program to detect a cycle in a directed graph using DFS and coloring technique.' },
    ],
    db: [
      { text: 'Write SQL queries for the following:\na) Find the second-highest salary\nb) Get employees with no manager\nc) Find departments with more than 5 employees\nd) Pivot monthly sales data' },
      { text: 'Create a normalized database schema for an online library system. Write CREATE TABLE statements with appropriate constraints.' },
    ],
    general: [
      { text: `Write a program in Python that demonstrates the core concepts of ${topic || subject}. Include comments explaining each step.`, hint: 'Focus on clarity and correctness.' },
      { text: `Implement a solution to the following problem related to ${topic || subject}: Design a class with appropriate methods, handle edge cases, and write test cases.` },
      { text: 'Write a function that solves the Fibonacci sequence problem using both recursive and dynamic programming approaches. Compare their time complexities.', hint: 'Memoization reduces O(2ⁿ) to O(n).' },
    ],
  };

  const list = pools[domain] || pools.general;
  while (list.length < 8) list.push(...(pools.general || list));
  return list;
}

function generateNumericalProblems(subject, topic, difficulty) {
  const domain = detectDomain(subject);
  const advanced = difficulty === 'hard' || difficulty === 'advanced';

  const pools = {
    ml: [
      { text: 'Compute the Gini Impurity for a node with class distribution [40 positive, 10 negative]. Show all steps.', hint: 'Gini = 1 - (p₁² + p₂²)' },
      { text: 'A dataset has 100 positive and 50 negative samples. Compute:\na) Precision = TP/(TP+FP)\nb) Recall = TP/(TP+FN)\nc) F1-Score\nGiven: TP=80, FP=20, FN=20, TN=30' },
      { text: 'For a logistic regression model, the output z = wᵀx + b = 1.5. Compute the sigmoid output. Then compute the binary cross-entropy loss if y=1.', hint: 'σ(z) = 1/(1+e⁻ᶻ)' },
      { text: 'Apply one step of gradient descent:\nθ = [2, -1], learning rate α = 0.01\nGradient ∇J = [4, -2]\nCompute updated θ after one step.' },
      { text: 'A k-fold cross-validation with k=5 gives accuracies: [0.85, 0.87, 0.83, 0.89, 0.86]. Compute the mean accuracy and standard deviation.' },
    ],
    dsa: [
      { text: 'Trace the QuickSort algorithm on the array [3, 6, 8, 10, 1, 2, 1] with pivot as the last element. Show each partition step.' },
      { text: 'Insert the keys [10, 5, 15, 3, 7, 12, 20] into a BST. Then perform inorder traversal. Show the resulting tree structure.' },
      { text: 'Apply Dijkstra\'s algorithm on the following graph. Find shortest paths from vertex A:\nA-B:4, A-C:2, B-D:3, C-B:1, C-D:5, D-E:1. Show the priority queue states.' },
    ],
    math: [
      { text: 'Solve the system of equations using Gaussian Elimination:\n2x + y - z = 8\n-3x - y + 2z = -11\n-2x + y + 2z = -3' },
      { text: 'Find the eigenvalues and eigenvectors of matrix A = [[4,1],[2,3]].' },
      { text: 'Compute the gradient of f(x,y) = 3x² + 2xy - y² at point (1, 2).' },
    ],
    general: [
      { text: `Solve the following numerical problem related to ${topic || subject}:\nGiven data: n=100, mean=75, standard deviation=12. Compute the 95% confidence interval.`, hint: 'CI = x̄ ± z*(σ/√n), z=1.96 for 95%' },
      { text: 'Calculate the efficiency of the following algorithm:\nBest case: O(1), Worst case: O(n²), Average case: O(n log n)\nFor n=1000, compute approximate operations in each case.' },
      { text: `A ${subject} system processes requests at rate λ=10/sec. Service time μ=15/sec.\nUsing Little\'s Law L=λW, compute: queue length, waiting time, and system utilization.` },
    ],
  };

  const list = pools[domain] || pools.general;
  while (list.length < 8) list.push(...(pools.general || list));
  return list;
}

// ─── Checkbox interactive fix ─────────────────────────────────────
document.querySelectorAll('.checkbox-item').forEach(item => {
  item.addEventListener('click', function() {
    const cb = this.querySelector('input[type="checkbox"]');
    cb.checked = !cb.checked;
    if (cb.checked) {
      this.style.color = 'var(--primary)';
      this.style.borderColor = 'var(--primary)';
      this.style.background = 'rgba(0,212,255,0.08)';
      this.querySelector('.checkmark').style.background = 'var(--primary)';
      this.querySelector('.checkmark').style.borderColor = 'var(--primary)';
    } else {
      this.style.color = '';
      this.style.borderColor = '';
      this.style.background = '';
      this.querySelector('.checkmark').style.background = '';
      this.querySelector('.checkmark').style.borderColor = '';
    }
  });
  // Trigger initial state for pre-checked boxes
  const cb = item.querySelector('input[type="checkbox"]');
  if (cb.checked) {
    item.style.color = 'var(--primary)';
    item.style.borderColor = 'var(--primary)';
    item.style.background = 'rgba(0,212,255,0.08)';
    item.querySelector('.checkmark').style.background = 'var(--primary)';
    item.querySelector('.checkmark').style.borderColor = 'var(--primary)';
  }
});

// ─── Smooth scroll for anchor links ──────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ─── Init ─────────────────────────────────────────────────────────
initParticles();
