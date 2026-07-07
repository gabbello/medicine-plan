// ─── PWA SERVICE WORKER REGISTRATION ───────────────────────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    console.log('Service Worker registered:', reg);
    console.log('SW state:', reg.installing, reg.waiting, reg.active);
    updateDebug('✓ SW registered\n⏳ Activating...');
    
    // Listen for state changes
    if (reg.waiting) {
      console.log('SW is waiting');
    }
    
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      console.log('New SW installing:', newWorker);
      newWorker.addEventListener('statechange', () => {
        console.log('SW state changed:', newWorker.state);
      });
    });
    
    // Check if already active
    setTimeout(() => {
      if (reg.active) {
        console.log('SW is now active');
        updateDebug('✓ SW active\n⏳ Ready for install...');
      }
    }, 500);
    
  }).catch(err => {
    console.error('SW registration failed:', err);
    updateDebug('✗ SW failed:\n' + err.message);
  });
} else {
  updateDebug('✗ SW not supported');
}

// ─── PWA INSTALL PROMPT ───────────────────────────────────────────────────────
let deferredPrompt = null;

function updateDebug(message) {
  const debugStatus = document.getElementById('debug-status');
  if (debugStatus) {
    debugStatus.textContent = message;
  }
}

// Check PWA readiness
function checkPWAStatus() {
  let status = '';
  
  // Check https or localhost
  if (location.protocol === 'https:' || location.hostname === 'localhost') {
    status += '✓ HTTPS/localhost\n';
  } else {
    status += '✗ Not HTTPS\n';
  }
  
  // Check manifest
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    status += '✓ Manifest link\n';
    // Try to fetch manifest
    fetch(manifestLink.href)
      .then(r => r.json())
      .then(manifest => {
        console.log('Manifest loaded:', manifest);
        updateDebug(status.trim() + '\n✓ Manifest valid');
      })
      .catch(err => {
        console.error('Manifest fetch failed:', err);
        updateDebug(status.trim() + '\n✗ Manifest error');
      });
  } else {
    status += '✗ No manifest link\n';
  }
  
  // Check service worker
  if ('serviceWorker' in navigator) {
    status += '⏳ Registering SW...';
  } else {
    status += '✗ No SW support';
  }
  
  updateDebug(status);
}

checkPWAStatus();

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt event fired!', e);
  e.preventDefault();
  deferredPrompt = e;
  
  updateDebug('✓ Install prompt\navailable!\n\n⬇️ Tap button\nto install');
  
  // Show both the floating bar and footer button
  const installBar = document.getElementById('install-bar');
  if (installBar) {
    installBar.style.display = 'flex';
    console.log('Showing install bar');
  }
  
  const footerBtn = document.getElementById('install-btn-footer');
  if (footerBtn) {
    footerBtn.style.display = 'block';
    console.log('Showing footer button');
  }
});

// Timeout to detect if install prompt never fires
// Note: Chrome sometimes requires user interaction first
let installPromptTimeout;
function startInstallPromptTimer() {
  installPromptTimeout = setTimeout(() => {
    if (!deferredPrompt) {
      console.warn('Install prompt did not fire after 8 seconds');
      updateDebug('⚠️ No install\nprompt yet\n\n(Try interacting\nwith the page)');
    }
  }, 8000);
}

// Listen for user interaction to trigger install prompt detection
document.addEventListener('click', () => {
  console.log('User clicked, checking for install prompt');
  if (!deferredPrompt && !installPromptTimeout) {
    updateDebug('⏳ Checking for\ninstall prompt\nafter interaction...');
    startInstallPromptTimer();
  }
}, { once: true });

startInstallPromptTimer();

window.addEventListener('appinstalled', () => {
  console.log('appinstalled event fired!');
  deferredPrompt = null;
  updateDebug('✓ App installed!');
  
  const installBar = document.getElementById('install-bar');
  if (installBar) installBar.style.display = 'none';
  
  const footerBtn = document.getElementById('install-btn-footer');
  if (footerBtn) footerBtn.style.display = 'none';
});

function installApp() {
  console.log('installApp() called, deferredPrompt:', deferredPrompt);
  updateDebug('Install prompt\nshown...');
  
  if (!deferredPrompt) {
    console.log('No deferredPrompt available');
    updateDebug('✗ No prompt\navailable');
    return;
  }
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((result) => {
    console.log('Install prompt result:', result);
    updateDebug('Result:\n' + result.outcome);
    deferredPrompt = null;
    const installBar = document.getElementById('install-bar');
    if (installBar) installBar.style.display = 'none';
    
    const footerBtn = document.getElementById('install-btn-footer');
    if (footerBtn) footerBtn.style.display = 'none';
  });
}

function clearSWAndReload() {
  console.log('Clearing service workers and cache...');
  updateDebug('⏳ Clearing SW\nand cache...');
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(reg => {
        reg.unregister();
        console.log('Unregistered SW');
      });
    });
  }
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
        console.log('Deleted cache:', name);
      });
    });
  }
  
  // Hard reload
  setTimeout(() => {
    location.reload(true);
  }, 500);
}

// Log to check if script is loaded
console.log('app.js loaded');

// ─── STATE ───────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'medplan_v1';
const SHARE_PARAM = 'plan';
const SHARE_VERSION = 1;
const MAX_SHARE_URL_LENGTH = 8000;
const PERIOD_META = {
  morning:   { label: 'Morning',   icon: '🌅' },
  afternoon: { label: 'Afternoon', icon: '☀️' },
  evening:   { label: 'Evening',   icon: '🌙' }
};

let draft = { periods: [], medicines: [] };

function loadPlan() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}

function savePlan(plan) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

function showMessage(message) {
  alert(message);
}

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function formatEndDate(startDate, days) {
  const start = new Date(startDate || Date.now());
  if (Number.isNaN(start.getTime()) || !Number.isFinite(days) || days <= 0) return '';
  const end = new Date(start);
  end.setHours(0, 0, 0, 0);
  end.setDate(end.getDate() + days - 1);
  const day = end.getDate();
  const month = end.toLocaleString('en-GB', { month: 'long' });
  const suffix = (day % 10 === 1 && day !== 11) ? 'st'
    : (day % 10 === 2 && day !== 12) ? 'nd'
    : (day % 10 === 3 && day !== 13) ? 'rd'
    : 'th';
  return `${day}${suffix} of ${month}`;
}

// --- SHARE LINKS -------------------------------------------------------------
function clonePlanForSharing(plan) {
  return {
    status: plan.status,
    periods: [...plan.periods],
    startDate: plan.startDate || new Date().toISOString(),
    medicines: plan.medicines.map(m => ({
      id: m.id || uuid(),
      name: m.name || '',
      amount: m.amount || '',
      unit: m.unit || '',
      note: m.note || '',
      periods: Array.isArray(m.periods) ? [...m.periods] : [],
      duration: m.duration && m.duration.type === 'days'
        ? { type: 'days', days: Number(m.duration.days) }
        : { type: 'ongoing' }
    }))
  };
}

function createShareSnapshot(plan) {
  return {
    version: SHARE_VERSION,
    createdAt: new Date().toISOString(),
    plan: clonePlanForSharing(plan)
  };
}

function base64UrlEncode(value) {
  const utf8 = encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  return btoa(utf8).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
  const binary = atob(padded);
  const escaped = [...binary].map(ch => '%' + ch.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  return decodeURIComponent(escaped);
}

function encodePlanSnapshot(plan) {
  const validation = validateShareablePlan(plan);
  if (!validation.valid) throw new Error(validation.message);
  return base64UrlEncode(JSON.stringify(createShareSnapshot(plan)));
}

function decodePlanSnapshot(value) {
  if (!value) return null;
  try {
    return JSON.parse(base64UrlDecode(value));
  } catch {
    return null;
  }
}

function extractPlanFromSnapshot(snapshot) {
  if (!snapshot || snapshot.version !== SHARE_VERSION || !snapshot.plan) return null;
  if (!Array.isArray(snapshot.plan.periods) || !Array.isArray(snapshot.plan.medicines)) return null;
  try {
    return clonePlanForSharing(snapshot.plan);
  } catch {
    return null;
  }
}

function knownPeriod(period) {
  return Object.prototype.hasOwnProperty.call(PERIOD_META, period);
}

function validateShareablePlan(plan) {
  if (!plan || plan.status !== 'active' || !Array.isArray(plan.periods) || plan.periods.length === 0 ||
      !Array.isArray(plan.medicines) || plan.medicines.length === 0) {
    return { valid: false, message: 'Create a plan with at least one medicine before sharing.' };
  }
  return { valid: true, message: '' };
}

function validateImportedPlan(plan) {
  if (!plan || plan.status !== 'active') {
    return { valid: false, message: 'This shared plan link could not be opened.' };
  }
  if (!Array.isArray(plan.periods) || plan.periods.length === 0 || !plan.periods.every(knownPeriod)) {
    return { valid: false, message: 'This shared plan link could not be opened.' };
  }
  if (!Array.isArray(plan.medicines) || plan.medicines.length === 0) {
    return { valid: false, message: 'This shared plan link could not be opened.' };
  }

  for (const med of plan.medicines) {
    if (!med || typeof med.name !== 'string' || med.name.trim() === '') {
      return { valid: false, message: 'This shared plan link could not be opened.' };
    }
    if (!Array.isArray(med.periods) || med.periods.length === 0 || !med.periods.every(p => plan.periods.includes(p) && knownPeriod(p))) {
      return { valid: false, message: 'This shared plan link could not be opened.' };
    }
    if (!med.duration || !['ongoing', 'days'].includes(med.duration.type)) {
      return { valid: false, message: 'This shared plan link could not be opened.' };
    }
    if (med.duration.type === 'days' && (!Number.isFinite(Number(med.duration.days)) || Number(med.duration.days) <= 0)) {
      return { valid: false, message: 'This shared plan link could not be opened.' };
    }
  }

  return { valid: true, message: '' };
}

function buildShareUrl(encodedSnapshot) {
  const url = new URL(window.location.href);
  url.searchParams.set(SHARE_PARAM, encodedSnapshot);
  url.hash = '';
  return url.toString();
}

function presentShareLink(url, copied) {
  document.getElementById('share-dialog-title').textContent = copied ? 'Share link copied' : 'Share plan';
  document.getElementById('share-dialog-message').textContent = copied
    ? 'Share link copied. It includes this plan as it is now.'
    : 'Copy this link to share the current plan.';
  const field = document.getElementById('share-link-field');
  field.value = url;
  document.getElementById('share-overlay').classList.add('active');
  setTimeout(() => field.select(), 0);
}

function hideShareDialog() {
  document.getElementById('share-overlay').classList.remove('active');
}

async function handleSharePlan() {
  const plan = loadPlan();
  const validation = validateShareablePlan(plan);
  if (!validation.valid) {
    showMessage(validation.message);
    return;
  }

  let shareUrl;
  try {
    shareUrl = buildShareUrl(encodePlanSnapshot(plan));
  } catch {
    showMessage('Create a plan with at least one medicine before sharing.');
    return;
  }

  if (shareUrl.length > MAX_SHARE_URL_LENGTH) {
    showMessage('This plan is too large to share as a link.');
    return;
  }

  let copied = false;
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      copied = true;
    } catch {
      copied = false;
    }
  }
  presentShareLink(shareUrl, copied);
}

function readSharedPlanFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(SHARE_PARAM);
  if (!value) return { found: false, success: false, plan: null, message: '' };

  const snapshot = decodePlanSnapshot(value);
  const plan = extractPlanFromSnapshot(snapshot);
  const validation = validateImportedPlan(plan);
  if (!validation.valid) {
    return { found: true, success: false, plan: null, message: validation.message };
  }
  return { found: true, success: true, plan, message: '' };
}

function clearSharedPlanFromUrl() {
  if (!window.history || !window.history.replaceState) return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has(SHARE_PARAM)) return;
  url.searchParams.delete(SHARE_PARAM);
  window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
}

function renderImportedPlan(plan) {
  savePlan(plan);
  buildDashboard(plan);
  showScreen('dashboard');
}

function handleSharedPlanOnInit() {
  const result = readSharedPlanFromUrl();
  if (!result.found) return false;

  clearSharedPlanFromUrl();
  if (!result.success) {
    showMessage('This shared plan link could not be opened.');
    return false;
  }

  const existingPlan = loadPlan();
  if (existingPlan && existingPlan.status === 'active') {
    const replace = window.confirm('Opening this shared plan will replace the plan saved on this device.');
    if (!replace) return false;
  }

  renderImportedPlan(result.plan);
  return true;
}

// ─── ROUTING ─────────────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
}

function goToStep1() {
  draft = { periods: [], medicines: [] };
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('btn-step1-next').disabled = true;
  showScreen('step1');
}

function goToStep2() {
  buildPeriodChecks();
  renderMedicineList();
  updateSubmitBtn();
  resetMedForm();
  showScreen('step2');
}

// ─── STEP 1 ───────────────────────────────────────────────────────────────────
function togglePeriod(btn) {
  const p = btn.dataset.period;
  btn.classList.toggle('selected');
  if (btn.classList.contains('selected')) {
    if (!draft.periods.includes(p)) draft.periods.push(p);
  } else {
    draft.periods = draft.periods.filter(x => x !== p);
  }
  // keep order: morning → afternoon → evening
  const order = ['morning','afternoon','evening'];
  draft.periods.sort((a,b) => order.indexOf(a) - order.indexOf(b));
  document.getElementById('btn-step1-next').disabled = draft.periods.length === 0;
}

// ─── STEP 2 ───────────────────────────────────────────────────────────────────
function buildPeriodChecks() {
  const wrap = document.getElementById('period-checks');
  wrap.innerHTML = '';
  draft.periods.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'period-check';
    btn.dataset.period = p;
    btn.textContent = PERIOD_META[p].icon + ' ' + PERIOD_META[p].label;
    btn.onclick = () => btn.classList.toggle('selected');
    wrap.appendChild(btn);
  });
}

function selectDuration(btn) {
  document.querySelectorAll('.duration-toggle').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const wrap = document.getElementById('duration-days-wrap');
  if (btn.dataset.val === 'days') wrap.classList.add('visible');
  else wrap.classList.remove('visible');
}

function resetMedForm() {
  document.getElementById('med-name').value = '';
  document.getElementById('med-amount').value = '';
  document.getElementById('med-unit').value = '';
  document.getElementById('med-note').value = '';
  document.getElementById('duration-days').value = '';
  document.querySelectorAll('.period-check').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.duration-toggle').forEach(b => b.classList.remove('selected'));
  document.querySelector('.duration-toggle[data-val="ongoing"]').classList.add('selected');
  document.getElementById('duration-days-wrap').classList.remove('visible');
}

function addMedicine() {
  const name = document.getElementById('med-name').value.trim();
  const amount = document.getElementById('med-amount').value.trim();
  const unit = document.getElementById('med-unit').value.trim();
  const note = document.getElementById('med-note').value.trim();
  const selectedPeriods = [...document.querySelectorAll('.period-check.selected')].map(b => b.dataset.period);
  const durType = document.querySelector('.duration-toggle.selected').dataset.val;
  const durDaysValue = document.getElementById('duration-days').value.trim();
  const durDays = durDaysValue === '' ? null : parseInt(durDaysValue, 10);

  if (!name || selectedPeriods.length === 0) {
    alert('Please enter a name and select at least one period.');
    return;
  }

  if (durType === 'days' && (!Number.isInteger(durDays) || durDays <= 0)) {
    alert('Please enter the number of days for Limited duration.');
    return;
  }

  const med = {
    id: uuid(),
    name,
    amount,
    unit,
    note,
    periods: selectedPeriods,
    duration: durType === 'days' ? { type: 'days', days: durDays } : { type: 'ongoing' }
  };

  draft.medicines.push(med);
  renderMedicineList();
  updateSubmitBtn();
  resetMedForm();
  document.getElementById('med-name').focus();
}

function deleteMedicine(id) {
  draft.medicines = draft.medicines.filter(m => m.id !== id);
  renderMedicineList();
  updateSubmitBtn();
}

function renderMedicineList() {
  const list = document.getElementById('medicine-list');
  if (draft.medicines.length === 0) { list.innerHTML = ''; return; }

  list.innerHTML = '<div class="section-label">Added medicines</div>' +
    draft.medicines.map(m => `
      <div class="medicine-item">
        <div class="medicine-item-left">
          <div class="medicine-item-name">${m.name}</div>
          <div class="medicine-item-meta">
            ${[m.amount, m.unit].filter(Boolean).join(' ')}
            ${m.periods.map(p => PERIOD_META[p].icon).join(' ')}
            ${m.duration.type === 'days' ? '· ' + m.duration.days + ' days' : '· ongoing'}
          </div>
        </div>
        <button class="delete-btn" onclick="deleteMedicine('${m.id}')">✕</button>
      </div>
    `).join('');
}

function updateSubmitBtn() {
  document.getElementById('btn-submit').disabled = draft.medicines.length === 0;
}

function submitPlan() {
  const plan = {
    status: 'active',
    periods: draft.periods,
    medicines: draft.medicines,
    startDate: new Date().toISOString()
  };
  savePlan(plan);
  buildDashboard(plan);
  showScreen('dashboard');
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function buildDashboard(plan) {
  // Date
  const now = new Date();
  document.getElementById('dash-date').textContent =
    now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  // Tabs
  const tabsEl = document.getElementById('dash-tabs');
  const contentsEl = document.getElementById('dash-contents');
  tabsEl.innerHTML = '';
  contentsEl.innerHTML = '';

  plan.periods.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.dataset.period = p;
    btn.innerHTML = `<span class="tab-icon">${PERIOD_META[p].icon}</span>${PERIOD_META[p].label}`;
    btn.onclick = () => switchTab(p);
    tabsEl.appendChild(btn);

    const content = document.createElement('div');
    content.className = 'tab-content';
    content.id = 'tab-' + p;

    const meds = plan.medicines.filter(m => m.periods.includes(p));
    if (meds.length === 0) {
      content.innerHTML = '<div class="empty-period">No medicines for this period.</div>';
    } else {
      content.innerHTML = meds.map(m => {
        const doseStr = [m.amount, m.unit].filter(Boolean).join(' ');
        const endDateLabel = m.duration.type === 'days'
          ? formatEndDate(plan.startDate, m.duration.days)
          : '';
        const durBadge = m.duration.type === 'days'
          ? `<span class="dash-duration limited">${m.duration.days} days then stop</span>`
          : `<span class="dash-duration">Ongoing</span>`;
        const endDateBadge = endDateLabel
          ? `<span class="dash-duration dash-duration-end limited-end">Until ${endDateLabel}</span>`
          : '';
        const noteEl = m.note ? `<div class="dash-note">${m.note}</div>` : '';
        return `
          <div class="dash-card" onclick="this.classList.toggle('taken')">
            <div class="dash-card-row">
              <div class="dash-card-name">${m.name}</div>
              ${doseStr ? `<div class="dash-dose">${doseStr}</div>` : ''}
            </div>
            ${durBadge}
            ${endDateBadge}
            ${noteEl}
          </div>`;
      }).join('');
    }
    contentsEl.appendChild(content);
  });

  autoSelectTab(plan.periods);
}

function switchTab(period) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const btn = document.querySelector(`.tab-btn[data-period="${period}"]`);
  if (btn) btn.classList.add('active');
  const content = document.getElementById('tab-' + period);
  if (content) content.classList.add('active');
}

function autoSelectTab(periods) {
  const h = new Date().getHours();
  let target;
  if (h >= 19 && periods.includes('evening')) target = 'evening';
  else if (h >= 12 && periods.includes('afternoon')) target = 'afternoon';
  else if (periods.includes('morning')) target = 'morning';
  else target = periods[0];
  switchTab(target);
}

// ─── RESET ────────────────────────────────────────────────────────────────────
function showResetDialog() { document.getElementById('reset-overlay').classList.add('active'); }
function hideResetDialog() { document.getElementById('reset-overlay').classList.remove('active'); }

function confirmReset() {
  localStorage.removeItem(STORAGE_KEY);
  hideResetDialog();
  showScreen('home');
}

// ─── VISIBILITY CHANGE ────────────────────────────────────────────────────────
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    const plan = loadPlan();
    if (plan && plan.status === 'active') autoSelectTab(plan.periods);
  }
});

// ─── INIT ─────────────────────────────────────────────────────────────────────
(function init() {
  if (handleSharedPlanOnInit()) return;

  const plan = loadPlan();
  if (plan && plan.status === 'active') {
    buildDashboard(plan);
    showScreen('dashboard');
  } else {
    showScreen('home');
  }
})();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
