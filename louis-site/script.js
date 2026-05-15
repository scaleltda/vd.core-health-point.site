/* ══════════════════════════════════════════════════
   CONFIGURAÇÃO — COOUD + STRIPE
═══════════════════════════════════════════════════ */
const COOUD_CONFIG = {
  apiKey:           'sk_live_JptptRbucwBPtlNlyDy4NPhjLW7_qHwtKFnGbHx9fLw',
  stripePublicKey:  'pk_live_51SaiqK0V1dEruXyZ8PJCSlOcg6PMb9KKOX6XOC8i3IKuT9oeUWfAIzjYyjd7PW8d7emB50LwWyYz09iRInYbPX0e00YlbwG0xL',
  apiBase:          'https://orbit.cooud.com',
  currency:         'eur',
};

/* ══════════════════════════════════════════════════
   VALORES EDITÁVEIS DA CAMPANHA
   (atualizar conforme as doações chegarem)
═══════════════════════════════════════════════════ */
const CAMPAIGN_DATA = {
  raised:  18440,   // valor arrecadado em euros
  goal:    45000,   // meta em euros
  donors:  247,     // número de doadores
};

/* ══════════════════════════════════════════════════
   ESTADO DO PAGAMENTO
═══════════════════════════════════════════════════ */
let stripeInstance      = null;
let stripeElements      = null;
let paymentElement      = null;
let currentAmountEuros  = 0;
let currentClientSecret = null;

/* ══════════════════════════════════════════════════
   INICIALIZAÇÃO
═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  updateCampaignNumbers();
  animateProgressBar();
  initFadeIn();
  initHeaderScroll();
  initHeroImageFallback();
  initModalKeyboard();

  // Pré-carrega a instância Stripe para evitar atraso no primeiro clique
  stripeInstance = Stripe(COOUD_CONFIG.stripePublicKey);
});

/* ══════════════════════════════════════════════════
   NÚMEROS DA CAMPANHA
═══════════════════════════════════════════════════ */
function updateCampaignNumbers() {
  const percent = Math.round((CAMPAIGN_DATA.raised / CAMPAIGN_DATA.goal) * 100);
  const el = (id) => document.getElementById(id);

  if (el('raisedValue'))  el('raisedValue').textContent  = formatEuro(CAMPAIGN_DATA.raised);
  if (el('goalValue'))    el('goalValue').textContent    = formatEuro(CAMPAIGN_DATA.goal);
  if (el('donorsCount'))  el('donorsCount').textContent  = CAMPAIGN_DATA.donors;
  if (el('percentValue')) el('percentValue').textContent = percent + '%';

  const fill = document.getElementById('progressFill');
  if (fill) fill.dataset.percent = percent;

  const mobileCta = document.querySelector('.mobile-cta-info strong');
  if (mobileCta) mobileCta.textContent = formatEuro(CAMPAIGN_DATA.raised);
}

function formatEuro(value) {
  return '€' + value.toLocaleString('pt-PT');
}

/* ══════════════════════════════════════════════════
   BARRA DE PROGRESSO ANIMADA
═══════════════════════════════════════════════════ */
function animateProgressBar() {
  const fill = document.getElementById('progressFill');
  if (!fill) return;
  const target = Math.min(Math.max(parseFloat(fill.dataset.percent) || 0, 0), 100);
  setTimeout(() => { fill.style.width = target + '%'; }, 400);
}

/* ══════════════════════════════════════════════════
   FADE-IN AO FAZER SCROLL
═══════════════════════════════════════════════════ */
function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ══════════════════════════════════════════════════
   SOMBRA DO HEADER AO FAZER SCROLL
═══════════════════════════════════════════════════ */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* ══════════════════════════════════════════════════
   FALLBACK DA IMAGEM HERO
═══════════════════════════════════════════════════ */
function initHeroImageFallback() {
  const img = document.querySelector('.hero-img');
  if (!img) return;
  img.addEventListener('error', () => { img.style.display = 'none'; });
}

/* ══════════════════════════════════════════════════
   MODAL — ABRIR / FECHAR
═══════════════════════════════════════════════════ */
function openDonationModal() {
  const modal = document.getElementById('donationModal');
  if (!modal) return;

  // Sempre começa no passo 1
  showModalStep(1);
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const firstBtn = modal.querySelector('.amount-btn');
  if (firstBtn) setTimeout(() => firstBtn.focus(), 100);
}

function closeDonationModal() {
  const modal = document.getElementById('donationModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';

  // Desmonta os elementos Stripe para evitar memory leak
  if (paymentElement) {
    paymentElement.unmount();
    paymentElement      = null;
    stripeElements      = null;
    currentClientSecret = null;
  }
}

function closeDonationModalOnOverlay(event) {
  if (event.target === document.getElementById('donationModal')) {
    closeDonationModal();
  }
}

function initModalKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDonationModal();
  });
}

/* ══════════════════════════════════════════════════
   MODAL — NAVEGAÇÃO ENTRE PASSOS
═══════════════════════════════════════════════════ */
function showModalStep(step) {
  document.getElementById('modalStep1').style.display = step === 1 ? '' : 'none';
  document.getElementById('modalStep2').style.display = step === 2 ? '' : 'none';
  document.getElementById('modalStep3').style.display = step === 3 ? '' : 'none';
}

function goBackToStep1() {
  // Desmonta Stripe ao voltar
  if (paymentElement) {
    paymentElement.unmount();
    paymentElement      = null;
    stripeElements      = null;
    currentClientSecret = null;
  }
  showModalStep(1);
}

/* ══════════════════════════════════════════════════
   SELEÇÃO DE VALOR NO MODAL (passo 1)
═══════════════════════════════════════════════════ */
function selectAmount(btn) {
  document.querySelectorAll('.amount-btn').forEach((b) => b.classList.remove('selected'));
  btn.classList.add('selected');

  const customInput = document.getElementById('customAmountInput');
  if (customInput) customInput.value = '';

  updateProceedButton(btn.dataset.amount);
}

function clearAmountSelection() {
  document.querySelectorAll('.amount-btn').forEach((b) => b.classList.remove('selected'));
  updateProceedButton(null);
}

function updateProceedButton(amount) {
  const btn = document.getElementById('btnProceedDonate');
  if (!btn) return;
  if (amount) {
    btn.textContent = `Continuar com €${amount} →`;
  } else {
    btn.innerHTML = 'Continuar para o pagamento &rarr;';
  }
}

/* ══════════════════════════════════════════════════
   PASSO 1 → PASSO 2: inicializa Stripe + Cooud
═══════════════════════════════════════════════════ */
async function goToPaymentStep() {
  const selectedBtn  = document.querySelector('.amount-btn.selected');
  const customInput  = document.getElementById('customAmountInput');

  if (selectedBtn) {
    currentAmountEuros = parseInt(selectedBtn.dataset.amount, 10);
  } else if (customInput && parseFloat(customInput.value) > 0) {
    currentAmountEuros = parseFloat(customInput.value);
  } else {
    showStep1Error('Por favor, selecione ou insira um valor para a sua doação.');
    return;
  }

  if (!currentAmountEuros || currentAmountEuros < 1) {
    showStep1Error('O valor mínimo de doação é €1.');
    return;
  }

  // Avança para o passo 2 e atualiza a etiqueta de valor
  showModalStep(2);
  document.getElementById('modalAmountTag').innerHTML =
    `A doar: <strong>€${currentAmountEuros}</strong>`;

  // Limpa estado anterior
  document.getElementById('stripe-payment-element').innerHTML = '';
  document.getElementById('paymentError').style.display = 'none';
  setPayButtonLoading(true);

  try {
    // Cria sessão na Cooud para obter o client_secret
    currentClientSecret = await createCooudSession(currentAmountEuros);

    // Inicializa Stripe Elements em modo deferred
    const amountCents = Math.round(currentAmountEuros * 100);
    stripeElements = stripeInstance.elements({
      mode:     'payment',
      amount:   amountCents,
      currency: COOUD_CONFIG.currency,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary:       '#E65100',
          colorBackground:    '#ffffff',
          colorText:          '#1a1a1a',
          fontFamily:         "'Inter', 'Helvetica Neue', sans-serif",
          borderRadius:       '8px',
          focusBoxShadow:     '0 0 0 3px rgba(230,81,0,0.18)',
        },
      },
    });

    paymentElement = stripeElements.create('payment');
    paymentElement.mount('#stripe-payment-element');

    setPayButtonLoading(false);

  } catch (err) {
    console.error('Erro ao inicializar pagamento:', err);
    setPayButtonLoading(false);
    showPaymentError('Não foi possível iniciar o pagamento. Por favor, tente novamente.');
  }
}

/* ══════════════════════════════════════════════════
   CRIAR SESSÃO NA COOUD
═══════════════════════════════════════════════════ */
async function createCooudSession(amountEuros) {
  const amountCents = Math.round(amountEuros * 100);

  const response = await fetch(`${COOUD_CONFIG.apiBase}/checkout_sessions`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${COOUD_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      amount:   amountCents,
      currency: COOUD_CONFIG.currency,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Cooud session error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  // A API Cooud devolve o client_secret identificador da sessão
  return data.client_secret || data.id;
}

/* ══════════════════════════════════════════════════
   CONFIRMAR SESSÃO NA COOUD (após token Stripe)
═══════════════════════════════════════════════════ */
async function confirmCooudSession(clientSecret, confirmationTokenId, email) {
  const response = await fetch(
    `${COOUD_CONFIG.apiBase}/checkout_sessions/${clientSecret}/confirm`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_email:       email,
        conformation_token_id: confirmationTokenId, // atenção: ortografia da API Cooud
      }),
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Cooud confirm error ${response.status}: ${errBody}`);
  }

  return await response.json();
}

/* ══════════════════════════════════════════════════
   PASSO 2: SUBMETER PAGAMENTO
═══════════════════════════════════════════════════ */
async function submitPayment() {
  const email = (document.getElementById('donorEmail').value || '').trim();

  if (!email || !email.includes('@')) {
    showPaymentError('Por favor, introduza um endereço de e-mail válido.');
    return;
  }

  if (!stripeElements || !currentClientSecret) {
    showPaymentError('Ocorreu um erro. Por favor, feche o modal e tente novamente.');
    return;
  }

  setPayButtonLoading(true);
  hidePaymentError();

  try {
    // 1. Valida os campos do Stripe Elements
    const { error: submitError } = await stripeElements.submit();
    if (submitError) {
      showPaymentError(submitError.message);
      setPayButtonLoading(false);
      return;
    }

    // 2. Cria um ConfirmationToken no Stripe
    const { confirmationToken, error: tokenError } = await stripeInstance.createConfirmationToken({
      elements: stripeElements,
      params: {
        payment_method_data: {
          billing_details: { email },
        },
      },
    });

    if (tokenError) {
      showPaymentError(tokenError.message);
      setPayButtonLoading(false);
      return;
    }

    // 3. Envia token + e-mail para a Cooud confirmar a sessão
    await confirmCooudSession(currentClientSecret, confirmationToken.id, email);

    // 4. Sucesso
    showModalStep(3);

  } catch (err) {
    console.error('Erro no pagamento:', err);
    showPaymentError('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.');
    setPayButtonLoading(false);
  }
}

/* ══════════════════════════════════════════════════
   UTILITÁRIOS DO MODAL DE PAGAMENTO
═══════════════════════════════════════════════════ */
function setPayButtonLoading(loading) {
  const btn    = document.getElementById('btnSubmitPayment');
  const text   = document.getElementById('btnSubmitText');
  const spinner = document.getElementById('btnSubmitSpinner');
  if (!btn) return;

  btn.disabled          = loading;
  text.style.display    = loading ? 'none'         : '';
  spinner.style.display = loading ? 'inline-block' : 'none';
}

function showPaymentError(message) {
  const el = document.getElementById('paymentError');
  if (!el) return;
  el.textContent      = message;
  el.style.display    = '';
}

function hidePaymentError() {
  const el = document.getElementById('paymentError');
  if (el) el.style.display = 'none';
}

function showStep1Error(message) {
  const btn = document.getElementById('btnProceedDonate');
  if (!btn) return;

  const original = btn.innerHTML;
  btn.style.background = '#c62828';
  btn.textContent = message;

  setTimeout(() => {
    btn.style.background = '';
    btn.innerHTML = original;
  }, 2500);
}

/* ══════════════════════════════════════════════════
   COMENTÁRIOS — ENVIO PELO UTILIZADOR
═══════════════════════════════════════════════════ */
function submitComment() {
  const nameInput = document.getElementById('commentName');
  const textInput = document.getElementById('commentText');

  const name = (nameInput.value || '').trim() || 'Anônimo';
  const text = (textInput.value || '').trim();

  if (!text) {
    textInput.focus();
    textInput.style.borderColor = '#E65100';
    textInput.placeholder = 'Escreva alguma coisa antes de enviar...';
    setTimeout(() => {
      textInput.style.borderColor = '';
      textInput.placeholder = 'Escreva uma mensagem de apoio para o Louis e a família...';
    }, 2500);
    return;
  }

  const isAnon   = name === 'Anônimo';
  const initial  = isAnon ? '?' : name[0].toUpperCase();
  const anonClass = isAnon ? 'comment-avatar--anon' : '';

  const card = document.createElement('div');
  card.className = 'comment-card comment-card--new';
  card.innerHTML = `
    <div class="comment-avatar ${anonClass}">${initial}</div>
    <div class="comment-body">
      <div class="comment-meta">
        <strong class="comment-name">${escapeHtml(name)}</strong>
        <span class="comment-time">agora mesmo</span>
      </div>
      <p class="comment-text">${escapeHtml(text)}</p>
    </div>
  `;

  const list = document.getElementById('commentsList');
  list.insertBefore(card, list.firstChild);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => card.classList.add('visible'));
  });

  const counter = document.getElementById('commentsCount');
  if (counter) {
    const current = parseInt(counter.textContent) || 11;
    counter.textContent = (current + 1) + ' mensagens';
  }

  nameInput.value = '';
  textInput.value = '';

  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ══════════════════════════════════════════════════
   BOTÕES DE PARTILHA (não funcionais)
═══════════════════════════════════════════════════ */
function shareWhatsApp()  { return false; }
function shareFacebook()  { return false; }
function shareTwitter()   { return false; }
function copyLink()       { return false; }

/* ══════════════════════════════════════════════════
   ANIMAÇÃO slideDown para o banner de agradecimento
═══════════════════════════════════════════════════ */
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;
document.head.appendChild(style);
