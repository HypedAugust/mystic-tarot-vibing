// ===== STATE =====
const state = {
  currentSection: 'reading',
  currentSpread: null,
  deck: [],
  selectedCards: [],
  selectedCategory: null,
  isShuffled: false
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initCurtain();
  initNavigation();
  renderSpreads();
  renderBrowseCards('all');
  initFilterBar();
  initContextModal();
  initResetBtn();
});

// ===== CURTAIN INTRO =====
function initCurtain() {
  const overlay = document.getElementById('curtain-overlay');
  if (!overlay) return;

  // Show title briefly, then open curtains
  setTimeout(() => {
    overlay.classList.add('open');
  }, 1200);

  // Remove from DOM after animation completes
  setTimeout(() => {
    overlay.classList.add('done');
  }, 3200);
}

// ===== NAVIGATION =====
function initNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.getElementById(`section-${section}`).classList.add('active');
      state.currentSection = section;
    });
  });
}

// ===== SPREAD SELECTION =====
function renderSpreads() {
  const grid = document.getElementById('spread-grid');
  grid.innerHTML = SPREADS.map(spread => `
    <div class="spread-card" data-spread-id="${spread.id}">
      <div class="icon">${spread.icon}</div>
      <h3>${spread.name}</h3>
      <div class="subtitle">${spread.nameEn}</div>
      <p>${spread.description}</p>
      <div class="card-count">${spread.cardCount}장</div>
    </div>
  `).join('');

  grid.querySelectorAll('.spread-card').forEach(card => {
    card.addEventListener('click', () => {
      const spreadId = card.dataset.spreadId;
      startReading(SPREADS.find(s => s.id === spreadId));
    });
  });
}

// ===== START READING =====
function startReading(spread) {
  state.currentSpread = spread;
  state.selectedCards = [];
  state.isShuffled = false;

  document.getElementById('spread-selection').style.display = 'none';
  const readingArea = document.getElementById('reading-area');
  readingArea.classList.add('active');

  document.getElementById('reading-spread-name').textContent = `${spread.icon} ${spread.name}`;
  document.getElementById('reading-spread-desc').textContent = spread.description;

  // Show shuffle area
  document.getElementById('shuffle-area').style.display = 'flex';
  document.getElementById('selection-area').classList.remove('active');
  document.getElementById('spread-layout').classList.remove('active');
  document.getElementById('interpretation-area').classList.remove('active');
  document.getElementById('reset-btn').style.display = 'block';

  renderDeckPile();
  initShuffleBtn();
}

// ===== DECK PILE =====
function renderDeckPile() {
  const pile = document.getElementById('deck-pile');
  pile.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const card = document.createElement('div');
    card.className = 'tarot-card deck-card';
    card.style.top = `${-i * 2}px`;
    card.style.left = `${-i * 1}px`;
    card.style.zIndex = 5 - i;
    card.innerHTML = `
      <div class="tarot-card-inner">
        <div class="tarot-card-back"></div>
      </div>
    `;
    pile.appendChild(card);
  }
}

// ===== SHUFFLE =====
function initShuffleBtn() {
  const btn = document.getElementById('shuffle-btn');
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);

  newBtn.addEventListener('click', () => {
    if (state.isShuffled) return;

    // Build and shuffle deck
    state.deck = shuffleDeck(getAllCards());

    // Animate
    const pile = document.getElementById('deck-pile');
    pile.classList.add('shuffling');
    newBtn.disabled = true;
    newBtn.textContent = '🔀 섞는 중...';

    setTimeout(() => {
      pile.classList.remove('shuffling');
      pile.classList.add('shuffling');
      setTimeout(() => {
        pile.classList.remove('shuffling');
        pile.classList.add('shuffling');
        setTimeout(() => {
          pile.classList.remove('shuffling');
          state.isShuffled = true;
          newBtn.textContent = '✅ 섞기 완료!';

          setTimeout(() => {
            document.getElementById('shuffle-area').style.display = 'none';
            showCardSelection();
          }, 800);
        }, 600);
      }, 600);
    }, 600);
  });
}

function shuffleDeck(cards) {
  const deck = [...cards];
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  // Randomly reverse some cards (30% chance)
  return deck.map(card => ({
    ...card,
    isReversed: Math.random() < 0.3
  }));
}

// ===== CARD SELECTION =====
function showCardSelection() {
  const selArea = document.getElementById('selection-area');
  selArea.classList.add('active');

  const remaining = state.currentSpread.cardCount - state.selectedCards.length;
  document.getElementById('remaining-count').textContent = remaining;

  renderFanCards();
  renderSpreadLayout();
}

function renderFanCards() {
  const container = document.getElementById('fan-cards');
  container.innerHTML = '';

  // Show a fan of cards (use first 30 from deck for display)
  const displayCount = Math.min(30, state.deck.length);
  for (let i = 0; i < displayCount; i++) {
    const card = document.createElement('div');
    card.className = 'fan-card';
    card.dataset.index = i;
    card.innerHTML = `
      <div class="tarot-card-back"></div>
    `;
    card.addEventListener('click', () => selectCard(i, card));
    container.appendChild(card);
  }
}

function selectCard(index, element) {
  const needed = state.currentSpread.cardCount;
  if (state.selectedCards.length >= needed) return;

  element.classList.add('selected');

  const drawnCard = state.deck[index];
  state.selectedCards.push(drawnCard);

  // Place card in spread layout
  placeCardInSpread(drawnCard, state.selectedCards.length - 1);

  // Update remaining count
  const remaining = needed - state.selectedCards.length;
  document.getElementById('remaining-count').textContent = remaining;

  if (state.selectedCards.length >= needed) {
    // All cards selected
    setTimeout(() => {
      document.getElementById('selection-area').classList.remove('active');
      flipAllCards();
    }, 500);
  }
}

function renderSpreadLayout() {
  const layout = document.getElementById('spread-layout');
  layout.classList.add('active');
  layout.innerHTML = '';

  const spread = state.currentSpread;
  spread.positions.forEach((pos, i) => {
    const slot = document.createElement('div');
    slot.className = 'spread-slot';
    slot.id = `slot-${i}`;
    slot.style.left = `calc(${spread.layout[i].x}% - 60px)`;
    slot.style.top = `calc(${spread.layout[i].y}% - 100px)`;
    if (spread.layout[i].rotate) {
      slot.style.transform = `rotate(${spread.layout[i].rotate}deg)`;
    }
    slot.innerHTML = `<span class="slot-label">${pos.name}</span>`;
    layout.appendChild(slot);
  });
}

function placeCardInSpread(cardData, slotIndex) {
  const slot = document.getElementById(`slot-${slotIndex}`);
  if (!slot) return;

  slot.classList.add('filled');
  slot.querySelector('.slot-label').style.display = 'none';

  const cardEl = createTarotCardElement(cardData, false);
  if (cardData.isReversed) cardEl.classList.add('reversed');
  slot.appendChild(cardEl);
}

function flipAllCards() {
  const slots = document.querySelectorAll('.spread-slot .tarot-card');
  slots.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('flipped');
    }, i * 300);
  });

  setTimeout(() => {
    showContextModal();
  }, slots.length * 300 + 500);
}

// ===== CARD ELEMENT =====
function createTarotCardElement(cardData, isBrowse = false) {
  const card = document.createElement('div');
  card.className = `tarot-card${isBrowse ? ' browse-card' : ''}`;

  const bgColor = cardData.color || '#1a1a3e';

  card.innerHTML = `
    <div class="tarot-card-inner">
      <div class="tarot-card-back"></div>
      <div class="tarot-card-front" style="background: linear-gradient(145deg, ${bgColor}22, ${bgColor}44);">
        <span class="reversed-badge">역방향</span>
        <span class="card-symbol">${cardData.symbol || '✦'}</span>
        <span class="card-name">${cardData.nameKr}</span>
        <span class="card-name-en">${cardData.name}</span>
        <span class="card-type-badge">${cardData.suitKr || cardData.suit || ''}</span>
      </div>
    </div>
  `;

  if (isBrowse) {
    card.addEventListener('click', () => showCardDetail(cardData));
  }

  return card;
}

// ===== BROWSE ALL CARDS =====
function renderBrowseCards(filter) {
  const grid = document.getElementById('cards-grid');
  grid.innerHTML = '';

  let cards = getAllCards();

  if (filter !== 'all') {
    if (filter === 'major') {
      cards = cards.filter(c => c.type === 'major');
    } else {
      cards = cards.filter(c => c.suit && c.suit.toLowerCase() === filter);
    }
  }

  cards.forEach(cardData => {
    const cardEl = createTarotCardElement(cardData, true);
    grid.appendChild(cardEl);
  });
}

function initFilterBar() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderBrowseCards(btn.dataset.filter);
    });
  });
}

// ===== CARD DETAIL MODAL =====
function showCardDetail(cardData) {
  const modal = document.getElementById('card-detail-modal');
  const content = document.getElementById('card-detail-content');

  const keywords = cardData.keywords
    ? cardData.keywords.map(k => `<span class="keyword">${k}</span>`).join('')
    : '';

  content.innerHTML = `
    <div class="detail-symbol">${cardData.symbol || '✦'}</div>
    <h3>${cardData.name}</h3>
    <div class="detail-name-kr">${cardData.nameKr}</div>
    ${keywords ? `<div class="keywords">${keywords}</div>` : ''}
    <div class="detail-section">
      <h4>🔼 정방향 (Upright)</h4>
      <p>${cardData.upright}</p>
    </div>
    <div class="detail-section">
      <h4>🔽 역방향 (Reversed)</h4>
      <p>${cardData.reversed}</p>
    </div>
    <div class="detail-section">
      <h4>✦ 속성</h4>
      <p>${cardData.element || ''} · ${cardData.suitKr || '메이저 아르카나'}</p>
    </div>
    <button class="close-btn" onclick="closeCardDetail()">닫기</button>
  `;

  modal.classList.add('active');
}

function closeCardDetail() {
  document.getElementById('card-detail-modal').classList.remove('active');
}

// Close on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.id === 'card-detail-modal') closeCardDetail();
});

// ===== CONTEXT MODAL =====
function showContextModal() {
  const spreadId = state.currentSpread.id;
  const categoryGrid = document.getElementById('category-grid');
  const modalTitle = document.querySelector('#context-modal .modal h3');
  const modalDesc = document.querySelector('#context-modal .modal p');

  document.getElementById('context-input').value = '';
  document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('selected'));

  // 연애/진로 스프레드는 카테고리 자동 설정
  if (spreadId === 'relationship') {
    state.selectedCategory = '연애';
    categoryGrid.style.display = 'none';
    modalTitle.textContent = '✦ 연애 질문을 알려주세요 ✦';
    modalDesc.textContent = '더 정확한 해석을 위해 연애 고민이나 상황을 알려주세요';
  } else if (spreadId === 'career') {
    state.selectedCategory = '직장';
    categoryGrid.style.display = 'none';
    modalTitle.textContent = '✦ 진로 질문을 알려주세요 ✦';
    modalDesc.textContent = '더 정확한 해석을 위해 직업/진로 고민이나 상황을 알려주세요';
  } else {
    state.selectedCategory = null;
    categoryGrid.style.display = 'grid';
    modalTitle.textContent = '✦ 질문을 알려주세요 ✦';
    modalDesc.textContent = '더 정확한 해석을 위해 고민이나 상황을 알려주세요';
  }

  document.getElementById('context-modal').classList.add('active');
}

function initContextModal() {
  // Category buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.selectedCategory = btn.dataset.category;
    });
  });

  // Submit button
  document.getElementById('submit-context').addEventListener('click', () => {
    const context = document.getElementById('context-input').value.trim();
    const category = state.selectedCategory || '일반';

    document.getElementById('context-modal').classList.remove('active');
    showInterpretation(category, context);
  });
}

// ===== INTERPRETATION =====
function showInterpretation(category, context) {
  const area = document.getElementById('interpretation-area');
  area.classList.add('active');

  // Show selected cards row
  renderSelectedCardsRow();

  // Generate local interpretation
  generateLocalInterpretation(category, context);
}

function renderSelectedCardsRow() {
  const row = document.getElementById('selected-cards-row');
  row.innerHTML = '';

  state.selectedCards.forEach((cardData, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'selected-card-info';

    const posName = state.currentSpread.positions[i]?.name || '';
    wrapper.innerHTML = `<div class="position-label">${posName}</div>`;

    const cardEl = createTarotCardElement(cardData, false);
    cardEl.classList.add('flipped');
    if (cardData.isReversed) cardEl.classList.add('reversed');
    cardEl.addEventListener('click', () => showCardDetail(cardData));
    wrapper.appendChild(cardEl);

    row.appendChild(wrapper);
  });
}

function generateLocalInterpretation(category, context) {
  const textEl = document.getElementById('interpretation-text');
  textEl.innerHTML = '<div class="loading">✦ 타로 해석을 생성하고 있습니다</div>';

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  // ===== 카테고리별 풍부한 맥락 =====
  const categoryData = {
    "연애": {
      area: "사랑과 관계",
      openings: [
        "사랑의 에너지가 카드 위에 펼쳐지고 있습니다. 당신의 마음이 향하는 곳을 카드가 비추고 있네요.",
        "관계의 흐름 속에서 카드들이 이야기를 들려주고 있습니다. 감정의 물결을 함께 읽어보겠습니다.",
        "두 마음 사이의 보이지 않는 실을 카드가 포착했습니다. 사랑의 언어로 해석해보겠습니다."
      ],
      uprightContext: [
        "이 에너지는 관계에서 따뜻한 빛으로 작용하고 있습니다. 서로를 향한 진심이 통하는 시기입니다.",
        "사랑의 문이 열리고 있는 신호입니다. 감정에 솔직해져도 좋을 때입니다.",
        "두 사람 사이의 유대가 깊어질 수 있는 에너지가 흐르고 있습니다.",
        "마음을 나누는 것이 두렵지 않게 느껴질 수 있는 시기입니다. 용기를 내보세요."
      ],
      reversedContext: [
        "관계에서 말하지 못한 감정이 쌓여 있을 수 있습니다. 솔직한 대화가 필요한 때입니다.",
        "사랑에 대한 두려움이나 과거의 상처가 현재에 그림자를 드리우고 있을 수 있습니다.",
        "상대방의 마음을 읽으려 하기보다, 먼저 자신의 감정을 정리해보는 것이 도움이 됩니다.",
        "관계의 불균형을 느끼고 있다면, 자신이 진정 원하는 것이 무엇인지 되돌아볼 때입니다."
      ],
      advice: [
        "진정한 사랑은 완벽함이 아니라 서로의 불완전함을 받아들이는 것에서 시작됩니다.",
        "상대방에게 바라기 전에, 먼저 자신을 사랑하는 법을 기억해주세요.",
        "말하지 않으면 전해지지 않는 마음이 있습니다. 오늘 용기를 내어 표현해보세요.",
        "사랑은 타이밍이기도 합니다. 조급해하지 말고 흐름을 믿어보세요.",
        "혼자서 관계를 끌고 가려 하지 마세요. 함께 만들어가는 것이 건강한 사랑입니다."
      ]
    },
    "직장": {
      area: "직장과 커리어",
      openings: [
        "직업의 세계에서 당신의 위치와 가능성을 카드가 비추고 있습니다.",
        "커리어의 갈림길에서 카드들이 방향을 제시하고 있습니다. 함께 읽어보겠습니다.",
        "일과 성취에 관한 에너지가 카드 위에 선명하게 나타나고 있습니다."
      ],
      uprightContext: [
        "직장에서 당신의 능력이 인정받을 수 있는 기회가 다가오고 있습니다.",
        "업무에서 새로운 도약의 에너지가 느껴집니다. 적극적으로 기회를 잡아보세요.",
        "동료들과의 협업이 좋은 결과를 만들어낼 수 있는 시기입니다.",
        "지금까지 쌓아온 경험과 실력이 빛을 발할 때가 가까워지고 있습니다."
      ],
      reversedContext: [
        "직장에서 느끼는 답답함이나 정체감이 카드에 반영되고 있습니다. 변화가 필요한 신호일 수 있습니다.",
        "업무 과부하나 인간관계의 갈등이 에너지를 소모하고 있을 수 있습니다.",
        "현재의 불만족은 더 나은 곳으로 가기 위한 내면의 신호일 수 있습니다.",
        "완벽주의나 과도한 책임감이 오히려 성장을 방해하고 있지는 않은지 돌아보세요."
      ],
      advice: [
        "커리어는 마라톤입니다. 단기적 성과에 매몰되지 말고 장기적 비전을 그려보세요.",
        "때로는 한 발 물러서는 것이 두 발 나아가는 것보다 현명한 전략입니다.",
        "자신의 가치를 스스로 낮추지 마세요. 당신이 가진 것은 생각보다 많습니다.",
        "지금 힘들더라도 이 경험이 미래의 자산이 됩니다. 배우는 자세를 유지하세요.",
        "일과 삶의 균형을 잊지 마세요. 번아웃은 갑자기 찾아옵니다."
      ]
    },
    "재정": {
      area: "재정과 물질적 풍요",
      openings: [
        "물질적 풍요와 재정의 흐름을 카드가 보여주고 있습니다.",
        "돈과 자원에 관한 에너지가 카드 위에 펼쳐지고 있습니다. 현명한 판단의 실마리를 찾아보겠습니다.",
        "풍요의 에너지가 어떤 방향으로 흐르고 있는지 카드가 말해주고 있습니다."
      ],
      uprightContext: [
        "재정적으로 안정을 찾아갈 수 있는 좋은 흐름이 보입니다.",
        "투자나 새로운 수입원에 대한 긍정적인 신호가 감지됩니다.",
        "물질적 풍요가 다가오고 있지만, 현명한 관리가 함께해야 합니다.",
        "당신의 노력에 합당한 보상이 돌아올 시기가 가까워지고 있습니다."
      ],
      reversedContext: [
        "불필요한 지출이나 재정적 불안감이 마음을 무겁게 하고 있을 수 있습니다.",
        "돈에 대한 과도한 걱정이 오히려 풍요의 에너지를 막고 있을 수 있습니다.",
        "단기적 이익에 눈이 멀어 장기적 손해를 볼 수 있으니 신중함이 필요합니다.",
        "재정적 의존이나 불균형한 관계가 있다면 재점검이 필요합니다."
      ],
      advice: [
        "돈은 에너지입니다. 감사하며 흘려보내면 더 큰 풍요로 돌아옵니다.",
        "충동적인 결정보다 한 번 더 생각하는 습관이 재정 안정의 열쇠입니다.",
        "지금 당장의 풍요보다 미래의 안정을 위한 씨앗을 뿌려보세요.",
        "부족함에 집중하기보다 이미 가진 것의 가치를 인식해보세요.",
        "현명한 소비는 절약이 아니라, 가치 있는 곳에 투자하는 것입니다."
      ]
    },
    "건강": {
      area: "건강과 웰빙",
      openings: [
        "몸과 마음의 에너지를 카드가 세심하게 비추고 있습니다.",
        "건강의 흐름 속에서 카드들이 중요한 메시지를 전하고 있습니다.",
        "웰빙과 활력에 관한 에너지가 카드 위에 나타나고 있습니다."
      ],
      uprightContext: [
        "건강 에너지가 회복되고 있거나 좋은 상태를 유지하고 있음을 보여줍니다.",
        "몸과 마음이 조화를 이루고 있는 긍정적인 신호입니다.",
        "새로운 건강 습관을 시작하기에 좋은 에너지가 흐르고 있습니다.",
        "활력이 넘치는 시기입니다. 이 에너지를 잘 활용해보세요."
      ],
      reversedContext: [
        "몸이 보내는 작은 신호를 무시하고 있지는 않은지 돌아보세요.",
        "스트레스가 몸에 영향을 미치고 있을 수 있습니다. 휴식이 필요합니다.",
        "과로나 불규칙한 생활 패턴이 건강의 균형을 흔들고 있을 수 있습니다.",
        "정신 건강도 신체 건강만큼 중요합니다. 마음의 쉼표를 찍어보세요."
      ],
      advice: [
        "건강은 잃고 나서야 그 소중함을 깨닫습니다. 지금 작은 변화를 시작하세요.",
        "완벽한 건강 관리보다 꾸준한 작은 습관이 더 큰 변화를 만듭니다.",
        "몸의 소리에 귀 기울이세요. 몸은 거짓말하지 않습니다.",
        "충분한 수면과 휴식은 사치가 아니라 필수입니다.",
        "자연 속에서 시간을 보내는 것만으로도 큰 치유가 될 수 있습니다."
      ]
    },
    "학업": {
      area: "학업과 자기계발",
      openings: [
        "배움의 여정에서 카드들이 등불을 밝혀주고 있습니다.",
        "지식과 성장에 관한 에너지가 카드 위에 선명하게 나타나고 있습니다.",
        "학업의 길 위에서 카드들이 나침반 역할을 하고 있습니다."
      ],
      uprightContext: [
        "학습에 대한 열정과 집중력이 높아지는 시기입니다. 이 흐름을 놓치지 마세요.",
        "새로운 지식이 문을 열어줄 수 있는 긍정적인 에너지가 감지됩니다.",
        "꾸준히 해온 노력이 성과로 이어질 수 있는 시기가 다가오고 있습니다.",
        "배움에 대한 호기심이 당신을 올바른 방향으로 이끌고 있습니다."
      ],
      reversedContext: [
        "학업에 대한 불안감이나 자신감 부족이 발목을 잡고 있을 수 있습니다.",
        "방향을 잃고 방황하는 느낌이라면, 잠시 멈추고 목표를 재정립해보세요.",
        "비교와 경쟁에 지쳐 있다면, 자신만의 속도를 존중해주세요.",
        "완벽을 추구하다 시작조차 못하고 있지는 않은지 돌아보세요."
      ],
      advice: [
        "천리 길도 한 걸음부터입니다. 오늘 할 수 있는 작은 것부터 시작하세요.",
        "실패는 배움의 또 다른 이름입니다. 틀리는 것을 두려워하지 마세요.",
        "남들의 속도에 흔들리지 마세요. 당신만의 시간표가 있습니다.",
        "호기심을 잃지 마세요. 그것이 모든 위대한 발견의 시작점입니다.",
        "지식은 쌓는 것이 아니라 연결하는 것입니다. 넓게 보는 시야를 가져보세요."
      ]
    },
    "일반": {
      area: "삶의 전반적인 흐름",
      openings: [
        "삶의 큰 그림 위에 카드들이 하나씩 자리를 잡았습니다. 당신의 이야기를 읽어보겠습니다.",
        "우주가 당신에게 전하는 메시지가 카드 위에 펼쳐져 있습니다.",
        "오늘의 카드들이 삶의 흐름 속에서 의미 있는 이정표를 보여주고 있습니다."
      ],
      uprightContext: [
        "삶의 흐름이 당신 편에 서 있는 듯한 에너지가 느껴집니다.",
        "지금 가고 있는 길이 맞다는 것을 우주가 확인해주고 있습니다.",
        "새로운 가능성이 문을 두드리고 있습니다. 열린 마음으로 맞이해보세요.",
        "내면의 성장이 외부의 변화로 이어지고 있는 시기입니다."
      ],
      reversedContext: [
        "삶에서 무언가 막혀 있는 듯한 느낌은, 방향 전환이 필요하다는 신호일 수 있습니다.",
        "겉으로 드러나지 않는 내면의 변화가 일어나고 있습니다. 자신을 신뢰해주세요.",
        "현재의 어려움은 더 큰 성장을 위한 준비 과정일 수 있습니다.",
        "삶의 속도를 늦추고 정말 중요한 것이 무엇인지 생각해볼 때입니다."
      ],
      advice: [
        "인생은 정답이 없는 여행입니다. 과정 자체를 즐겨보세요.",
        "지금 이 순간에 충실하세요. 과거의 후회와 미래의 걱정은 내려놓아도 됩니다.",
        "당신은 생각보다 훨씬 강하고, 이미 많은 것을 이겨내 왔습니다.",
        "변화를 두려워하지 마세요. 변하지 않는 것은 오히려 퇴보입니다.",
        "자신에게 친절해지는 것이 세상을 바꾸는 첫 걸음입니다."
      ]
    }
  };

  // ===== 카드별 상세 해석 데이터 (메이저 아르카나) =====
  const majorDeepReading = {
    0: { // The Fool
      theme: "새로운 시작의 에너지",
      upStory: ["순수한 마음으로 새로운 여정을 시작할 때입니다. 두려움 없이 첫 발을 내딛어보세요. 바보 카드는 '모르기 때문에 할 수 있는 것'의 힘을 상징합니다. 기존의 틀에서 벗어나 자유롭게 탐험할 수 있는 시기입니다.", "모든 위대한 여정은 한 걸음에서 시작됩니다. 지금이 바로 그 한 걸음을 내딛을 때입니다. 결과를 미리 계산하지 말고, 과정 자체를 믿어보세요."],
      downStory: ["무모한 결정이나 준비 없는 도전이 우려됩니다. 열정은 좋지만, 최소한의 안전장치는 마련해두세요. 자유와 무책임의 경계를 인식하는 것이 중요합니다.", "앞뒤를 살피지 않는 태도가 문제를 만들 수 있습니다. 모험심은 좋지만, 현실적인 기반 위에서 꿈을 펼쳐야 오래갑니다."]
    },
    1: { // The Magician
      theme: "창조와 실현의 에너지",
      upStory: ["당신에게는 원하는 것을 현실로 만들어낼 수 있는 모든 도구와 능력이 이미 갖춰져 있습니다. 마법사 카드는 '의지의 힘'을 상징합니다. 집중력을 발휘하여 목표를 향해 나아가세요.", "창의적인 에너지가 정점에 달하고 있습니다. 아이디어를 현실로 전환할 수 있는 힘이 당신 안에 있습니다. 자신의 능력을 의심하지 마세요."],
      downStory: ["능력은 있지만 방향이 흐트러져 있을 수 있습니다. 에너지가 분산되어 결과물이 나오지 않는 상황이 우려됩니다. 한 가지에 집중하는 연습이 필요합니다.", "겉으로 보여주는 것과 실제 실력 사이의 괴리가 있을 수 있습니다. 진정한 능력을 키우는 데 시간을 투자해보세요."]
    },
    2: { theme: "직관과 내면의 지혜", upStory: ["표면 아래 숨겨진 진실을 볼 수 있는 시기입니다. 논리보다 직관을 따라가보세요. 여사제 카드는 내면의 목소리가 가장 정확한 나침반임을 알려줍니다. 명상이나 조용한 성찰의 시간을 가져보세요.", "보이지 않는 것에서 답을 찾을 수 있는 때입니다. 세상의 소음을 줄이고 내면에 귀를 기울이면, 이미 알고 있던 답이 떠오를 것입니다."], downStory: ["직관을 무시하고 있거나, 내면의 소리를 듣기 어려운 상태일 수 있습니다. 비밀이나 감추어진 감정이 문제를 복잡하게 만들고 있을 수 있습니다.", "과도한 분석이나 외부 의견에 의존하느라 자신의 감을 잃고 있습니다. 가끔은 머리가 아닌 가슴으로 결정해보세요."] },
    3: { theme: "풍요와 돌봄의 에너지", upStory: ["풍요로움과 창조적 에너지가 당신의 삶에 꽃피고 있습니다. 여황제 카드는 자연스러운 성장과 결실을 상징합니다. 씨앗을 뿌린 것들이 열매를 맺기 시작하는 때입니다.", "사랑과 돌봄의 에너지가 넘칩니다. 자신을 둘러싼 사람들과의 관계가 더욱 깊어지고, 감각적인 즐거움을 누릴 수 있는 시기입니다."], downStory: ["자신을 돌보는 것을 잊고 있지는 않나요? 타인을 위해 에너지를 쏟느라 정작 자신은 비어가고 있을 수 있습니다.", "의존적인 관계나 창조력의 고갈이 느껴질 수 있습니다. 자신만의 공간과 시간을 확보하세요."] },
    4: { theme: "구조와 리더십의 에너지", upStory: ["안정적인 기반 위에서 질서를 세울 수 있는 시기입니다. 황제 카드는 체계적인 접근과 리더십을 상징합니다. 혼란 속에서 구조를 만들어내는 당신의 능력이 빛을 발할 때입니다.", "책임감 있는 결정과 단호한 행동이 좋은 결과를 가져올 것입니다. 흔들리지 않는 신념으로 앞으로 나아가세요."], downStory: ["지나친 통제욕이나 경직된 사고가 주변 사람들과의 마찰을 만들 수 있습니다. 유연함도 리더십의 일부임을 기억하세요.", "권위에 대한 도전이나 구조의 붕괴가 불안감을 줄 수 있습니다. 변화에 저항하기보다 적응하는 법을 배워보세요."] },
    5: { theme: "전통과 영적 가르침", upStory: ["검증된 방법과 전통적인 접근이 도움이 될 수 있는 시기입니다. 교황 카드는 멘토나 스승의 에너지를 상징합니다. 경험 많은 사람의 조언에 귀 기울여보세요.", "공동체 안에서의 소속감과 공유된 가치관이 힘이 됩니다. 혼자 해결하려 하지 말고 신뢰할 수 있는 사람들의 지혜를 빌려보세요."], downStory: ["형식에 얽매여 본질을 놓치고 있을 수 있습니다. 관습이라고 해서 항상 옳은 것은 아닙니다. 자신만의 길을 찾아볼 용기가 필요합니다.", "타인의 기대나 사회적 압박에 갇혀 있는 느낌이라면, 자신의 진정한 신념이 무엇인지 되돌아보세요."] },
    6: { theme: "선택과 조화의 에너지", upStory: ["중요한 선택의 순간이 다가오고 있습니다. 연인 카드는 머리와 가슴이 함께 동의하는 결정을 내리라고 말합니다. 진정한 조화는 양쪽 모두를 존중할 때 이루어집니다.", "깊은 유대감과 진정한 연결을 경험할 수 있는 시기입니다. 표면적인 것이 아닌 영혼의 차원에서 누군가와 만날 수 있습니다."], downStory: ["가치관의 충돌이나 내면의 갈등이 결정을 어렵게 만들고 있습니다. 남의 기준이 아닌 자신의 기준으로 선택해야 할 때입니다.", "유혹이나 잘못된 선택의 위험이 있습니다. 순간의 감정보다 장기적인 관점에서 판단해보세요."] },
    7: { theme: "승리와 전진의 에너지", upStory: ["장애물을 돌파하고 승리를 거머쥘 수 있는 강력한 에너지가 느껴집니다. 전차 카드는 의지와 결단력으로 목표를 향해 돌진하라고 격려합니다.", "상반된 힘들을 하나로 모아 전진할 수 있는 능력이 당신에게 있습니다. 집중력을 잃지 마세요."], downStory: ["앞으로 나아가야 하는데 방향을 잃고 있거나, 에너지가 제멋대로 흩어지고 있을 수 있습니다. 먼저 마음의 중심을 잡으세요.", "공격적이거나 성급한 태도가 오히려 역효과를 낼 수 있습니다. 힘의 조절이 필요합니다."] },
    8: { theme: "내면의 힘과 용기", upStory: ["진정한 힘은 폭력이 아니라 부드러움에서 나옵니다. 힘 카드는 인내와 용기로 어려움을 극복하는 에너지를 상징합니다. 두려운 것을 사랑으로 다스리는 법을 당신은 이미 알고 있습니다.", "내면의 야수를 길들이듯, 격렬한 감정이나 충동을 다스릴 수 있는 시기입니다. 자기 자신을 믿으세요."], downStory: ["자기 의심이나 나약함이 발목을 잡고 있을 수 있습니다. 자신감을 회복하는 것이 급선무입니다.", "감정을 억누르거나 반대로 폭발시키는 극단 사이에서 갈팡질팡하고 있을 수 있습니다. 중심을 찾아보세요."] },
    9: { theme: "성찰과 내면 탐구", upStory: ["홀로 있는 시간이 가장 큰 선물이 될 수 있는 때입니다. 은둔자 카드는 외부의 소음을 차단하고 내면의 빛을 따라가라고 말합니다. 고독은 외로움이 아니라 자기 발견의 여정입니다.", "답은 밖이 아니라 안에 있습니다. 조용히 자신과 대화하는 시간을 가져보세요."], downStory: ["고립감이나 지나친 은둔이 세상과의 단절을 만들고 있을 수 있습니다. 혼자만의 시간도 좋지만, 적절한 연결도 필요합니다.", "현실 도피로서의 고독은 해답이 아닙니다. 두려움을 직면할 용기를 내보세요."] },
    10: { theme: "운명적 전환점", upStory: ["삶의 수레바퀴가 돌아가고 있습니다. 새로운 기회와 행운이 문을 두드리는 시기입니다. 운명의 수레바퀴 카드는 변화를 자연의 순리로 받아들이라고 말합니다.", "지금까지의 노력에 대한 보상이 예상치 못한 형태로 찾아올 수 있습니다. 열린 마음으로 맞이하세요."], downStory: ["불운이나 예상치 못한 변화가 찾아올 수 있지만, 이것도 수레바퀴의 일부입니다. 바닥을 찍으면 올라갈 일만 남습니다.", "통제할 수 없는 것에 매달리지 마세요. 흐름에 저항하기보다 적응하는 지혜가 필요합니다."] },
    11: { theme: "정의와 균형", upStory: ["인과응보의 법칙이 작용하는 시기입니다. 올바른 행동에는 올바른 결과가 따릅니다. 정의 카드는 공정함과 진실이 드러나는 에너지를 상징합니다.", "객관적이고 균형 잡힌 시각이 필요한 때입니다. 감정에 휘둘리지 말고 사실에 기반한 판단을 내려보세요."], downStory: ["불공정한 상황이나 불균형이 스트레스를 주고 있을 수 있습니다. 자신이 통제할 수 있는 것과 없는 것을 구분하세요.", "자신의 행동에 대한 책임을 회피하고 있지는 않은지 정직하게 돌아보세요."] },
    12: { theme: "새로운 관점과 기다림", upStory: ["때로는 멈추는 것이 가장 빠른 길입니다. 매달린 사람 카드는 완전히 다른 각도에서 상황을 바라보라고 말합니다. 180도 뒤집어 보면, 보이지 않던 것이 보입니다.", "희생이나 기다림이 헛되지 않을 것입니다. 지금은 행동보다 이해의 시간입니다."], downStory: ["불필요한 희생이나 의미 없는 기다림에 시간을 낭비하고 있을 수 있습니다. 놓아줄 것은 놓아주세요.", "변화를 거부하거나 고집을 부리는 것이 상황을 더 악화시킬 수 있습니다."] },
    13: { theme: "변혁과 재탄생", upStory: ["하나의 문이 닫히면 새로운 문이 열립니다. 죽음 카드는 끝이 아닌 변혁을 상징합니다. 지금 무언가를 놓아보내야 더 좋은 것이 들어올 자리가 만들어집니다.", "과거에 매달리지 마세요. 깨끗하게 정리하고 새롭게 시작할 수 있는 강력한 에너지가 흐르고 있습니다."], downStory: ["변화에 대한 극심한 저항이 정체를 만들고 있습니다. 이미 끝난 것을 붙잡고 있으면 새로운 시작도 할 수 없습니다.", "필연적인 변화 앞에서 두려움을 느끼는 것은 자연스럽지만, 그 두려움이 발목을 잡게 두지 마세요."] },
    14: { theme: "절제와 조화", upStory: ["극단을 피하고 중용의 길을 걸어야 할 때입니다. 절제 카드는 인내와 조화를 통해 최고의 결과를 만들어내라고 말합니다. 서두르지 않되 멈추지도 않는 꾸준함이 열쇠입니다.", "다양한 요소들을 균형 있게 섞어내는 능력이 빛을 발할 시기입니다. 연금술사처럼 최적의 배합을 찾아보세요."], downStory: ["균형이 무너지고 있습니다. 한쪽으로 과도하게 기울어진 생활을 점검해보세요. 일, 관계, 건강, 즐거움 사이의 조화가 필요합니다.", "조급함이 일을 그르칠 수 있습니다. 완성되지 않은 것을 억지로 완성하려 하지 마세요."] },
    15: { theme: "해방과 집착 직면", upStory: ["어둠을 직면해야 빛을 찾을 수 있습니다. 악마 카드는 당신을 묶고 있는 것이 무엇인지 정직하게 바라보라고 말합니다. 중독, 집착, 물질주의에서 벗어날 때 진정한 자유를 얻습니다.", "그림자를 인정하는 것이 첫 번째 단계입니다. 자신의 어두운 면을 부정하지 말고 이해하려 노력해보세요."], downStory: ["속박에서 벗어나고 있는 과정일 수 있습니다. 해방의 빛이 보이기 시작합니다.", "하지만 아직 완전히 자유롭지는 않습니다. 낡은 패턴으로 돌아가지 않도록 의식적인 노력이 필요합니다."] },
    16: { theme: "파괴를 통한 재건", upStory: ["갑작스러운 변화가 충격적일 수 있지만, 잘못 쌓인 탑은 무너져야 합니다. 탑 카드는 거짓 위에 세운 것들이 진실 앞에서 무너지는 것을 상징합니다. 파괴 뒤에 더 단단한 기초를 놓을 수 있습니다.", "이 변화는 필요한 것입니다. 지금은 아프더라도, 나중에 이 순간이 전환점이었음을 깨닫게 될 것입니다."], downStory: ["변화를 피하려 할수록 나중에 더 큰 충격으로 돌아올 수 있습니다. 서서히 무너지고 있는 것을 외면하지 마세요.", "위기를 감지하고 있다면, 미리 대비하세요. 예방할 수 있는 재난도 있습니다."] },
    17: { theme: "희망과 영감", upStory: ["어둠 뒤에 반드시 새벽이 옵니다. 별 카드는 가장 어두운 밤에 가장 밝게 빛나는 희망을 상징합니다. 지금 힘들더라도, 우주가 당신을 지켜보고 있습니다.", "영감과 평화의 에너지가 가득합니다. 꿈을 포기하지 마세요. 별은 당신이 올바른 길 위에 있다고 말해주고 있습니다."], downStory: ["희망을 잃어가고 있거나, 미래에 대한 불안감이 현재를 잠식하고 있을 수 있습니다. 작은 것에서부터 다시 희망을 찾아보세요.", "자신감이 바닥에 떨어져 있을 수 있습니다. 하지만 별은 구름 뒤에 숨어 있을 뿐, 사라진 것이 아닙니다."] },
    18: { theme: "환상과 무의식의 세계", upStory: ["보이는 것이 전부가 아닌 시기입니다. 달 카드는 무의식의 깊은 곳에서 올라오는 메시지에 주의를 기울이라고 말합니다. 꿈, 직감, 예감에 귀를 기울여보세요.", "불확실한 상황 속에서도 당신의 직관이 길을 안내할 것입니다. 두려움에 지배당하지 말고, 어둠 속에서도 걸을 수 있는 용기를 가져보세요."], downStory: ["혼란이 걷히기 시작하고 진실이 드러나는 시기입니다. 그동안 두려웠던 것이 실제로는 그리 큰 문제가 아니었음을 깨달을 수 있습니다.", "자기 기만이나 환상에서 벗어나 현실을 직시해야 합니다."] },
    19: { theme: "기쁨과 성공의 에너지", upStory: ["태양이 당신의 삶을 환하게 비추고 있습니다! 태양 카드는 가장 밝고 긍정적인 에너지를 상징합니다. 성공, 기쁨, 활력이 넘치는 시기입니다. 자신감을 가지세요.", "모든 것이 명확하게 보이는 시기입니다. 숨겨진 것 없이 투명하게, 진정한 자신의 모습으로 빛날 수 있습니다."], downStory: ["일시적으로 빛이 가려져 있을 수 있지만, 태양은 언제나 구름 뒤에 있습니다. 낙관을 잃지 마세요.", "과도한 자신감이나 현실을 무시한 낙관주의가 문제를 만들 수 있습니다. 밝은 면과 어두운 면 모두를 보세요."] },
    20: { theme: "각성과 새로운 소명", upStory: ["삶의 목적을 재발견할 수 있는 시기입니다. 심판 카드는 과거를 용서하고, 교훈을 안고, 새로운 소명을 향해 일어서라고 말합니다. 내면의 부름에 응답할 때입니다.", "자기 자신을 정직하게 평가하고, 더 높은 버전의 자신으로 거듭날 수 있는 기회가 왔습니다."], downStory: ["자기 비판이 너무 과하거나, 과거의 실수에 사로잡혀 있을 수 있습니다. 용서는 타인이 아닌 자신을 위한 것입니다.", "중요한 결단을 미루고 있지는 않은지 돌아보세요. 결정하지 않는 것도 하나의 결정입니다."] },
    21: { theme: "완성과 통합", upStory: ["하나의 순환이 완성되고 있습니다. 세계 카드는 당신이 이룬 모든 것을 축하하라고 말합니다. 오랜 여정의 끝에서, 시작보다 훨씬 성장한 자신을 발견하게 될 것입니다.", "모든 조각이 맞춰지는 느낌을 받을 수 있는 시기입니다. 성취감을 충분히 누린 후, 다음 여정을 준비하세요."], downStory: ["목표에 거의 다 왔지만 마지막 한 걸음이 어려울 수 있습니다. 포기하지 마세요, 완성이 가까이에 있습니다.", "완성을 두려워하고 있을 수 있습니다. 끝이 새로운 시작임을 기억하세요."] }
  };

  // ===== 포지션별 해석 톤 =====
  const positionEnergy = {
    "현재 상황": "현재", "도전/장애물": "도전", "의식적 목표": "목표",
    "무의식적 기반": "내면", "과거": "과거", "가까운 미래": "미래",
    "자신의 태도": "태도", "주변 환경": "환경", "희망과 두려움": "내면",
    "최종 결과": "미래", "답변": "현재",
    "나의 현재 감정": "감정", "상대방의 감정": "감정",
    "관계의 기반": "과거", "도전 과제": "도전", "관계의 미래": "미래",
    "현재 직업 상황": "현재", "강점": "강점", "약점/도전": "도전",
    "조언": "조언", "결과/전망": "미래"
  };

  const positionIntro = {
    "현재": [
      "이 자리는 지금 이 순간 당신을 둘러싼 에너지의 핵심을 보여줍니다.",
      "현재 당신의 삶에 가장 강하게 작용하고 있는 기운입니다.",
      "지금 당신이 서 있는 자리의 에너지를 카드가 정확하게 포착했습니다."
    ],
    "과거": [
      "지나온 시간 속에서 현재에 영향을 미치고 있는 에너지입니다.",
      "과거에 심은 씨앗이 지금 어떤 형태로 자라나고 있는지를 보여줍니다.",
      "이 카드는 당신의 과거 경험이 남긴 잔향을 담고 있습니다."
    ],
    "미래": [
      "앞으로 펼쳐질 가능성의 물결이 이 카드에 담겨 있습니다.",
      "미래의 에너지가 이미 움직이기 시작했습니다. 이 방향을 참고해보세요.",
      "카드가 보여주는 미래는 확정이 아닌 가능성입니다. 당신의 선택이 이 에너지를 현실로 만들 수도, 바꿀 수도 있습니다."
    ],
    "도전": [
      "성장에는 반드시 도전이 따릅니다. 이 카드가 지금 마주해야 할 과제를 보여줍니다.",
      "이 에너지를 장애물이 아닌 성장의 기회로 바라보세요.",
      "지금 가장 불편하게 느껴지는 것이 오히려 가장 큰 배움을 줄 수 있습니다."
    ],
    "내면": [
      "의식의 수면 아래에서 조용히 작용하고 있는 에너지입니다.",
      "말로 표현하기 어려운 내면의 감정이 이 카드에 반영되어 있습니다.",
      "스스로도 인식하지 못했을 수 있는 마음의 깊은 층을 이 카드가 비추고 있습니다."
    ],
    "감정": [
      "마음 깊은 곳의 감정이 이 카드에 고스란히 담겨 있습니다.",
      "이 카드는 느끼고 있지만 표현하지 못한 감정의 색을 보여줍니다.",
      "감정의 진짜 이름을 이 카드가 불러주고 있습니다."
    ],
    "목표": [
      "당신이 의식적으로 향하고 있는 방향의 에너지입니다.",
      "마음속에 그리고 있는 이상적인 미래의 모습이 여기에 담겨 있습니다."
    ],
    "태도": [
      "상황을 대하는 당신의 자세가 이 카드에 반영되어 있습니다.",
      "지금 당신이 취하고 있는 관점과 태도를 객관적으로 보여주는 카드입니다."
    ],
    "환경": [
      "외부 환경과 주변 사람들의 영향을 이 카드가 보여줍니다.",
      "당신을 둘러싼 상황과 타인의 에너지가 여기에 나타나 있습니다."
    ],
    "강점": [
      "당신이 활용할 수 있는 가장 강력한 무기를 이 카드가 보여줍니다.",
      "이미 가지고 있지만 미처 인식하지 못한 강점이 여기에 있습니다."
    ],
    "조언": [
      "카드가 전하는 조언의 에너지입니다. 행동의 방향을 제시합니다.",
      "이 카드는 현 상황에서 취해야 할 가장 현명한 접근법을 알려줍니다."
    ]
  };

  const catInfo = categoryData[category] || categoryData["일반"];

  // ===== 해석 생성 =====
  setTimeout(() => {
    let fullText = '';
    const hasMajor = state.selectedCards.some(c => c.type === 'major');
    const hasReversed = state.selectedCards.some(c => c.isReversed);
    const majorCount = state.selectedCards.filter(c => c.type === 'major').length;
    const reversedCount = state.selectedCards.filter(c => c.isReversed).length;

    // ===== 헤더 =====
    fullText += `✦ ${state.currentSpread.name} 타로 리딩 ✦\n`;
    fullText += `카테고리: ${category}\n`;
    if (context) fullText += `질문: ${context}\n`;
    fullText += `\n${'─'.repeat(40)}\n\n`;

    // ===== 오프닝 =====
    fullText += pick(catInfo.openings) + '\n\n';
    fullText += `${'─'.repeat(40)}\n\n`;

    // ===== 각 카드별 해석 =====
    fullText += `【 각 카드별 해석 】\n\n`;

    state.selectedCards.forEach((card, i) => {
      const pos = state.currentSpread.positions[i];
      const direction = card.isReversed ? '역방향 🔽' : '정방향 🔼';
      const meaning = card.isReversed ? card.reversed : card.upright;
      const energy = positionEnergy[pos.name] || "현재";
      const intros = positionIntro[energy] || positionIntro["현재"];

      fullText += `━━━━━━━━━━━━━━━━━━━━\n`;
      fullText += `${i + 1}. 【${pos.name}】 ${card.nameKr} (${card.name}) — ${direction}\n`;
      fullText += `━━━━━━━━━━━━━━━━━━━━\n\n`;

      // Position intro
      fullText += `${pick(intros)}\n\n`;

      // Deep reading for major arcana
      if (card.type === 'major' && majorDeepReading[card.id]) {
        const deep = majorDeepReading[card.id];
        fullText += `✦ ${deep.theme}\n\n`;
        const stories = card.isReversed ? deep.downStory : deep.upStory;
        fullText += `${pick(stories)}\n\n`;
      } else {
        // Minor arcana interpretation
        fullText += `이 자리에서 ${card.nameKr} 카드가 ${direction}으로 나타났습니다.\n`;
        fullText += `핵심 키워드: "${meaning}"\n\n`;
      }

      // Category-specific reading
      if (card.isReversed) {
        fullText += pick(catInfo.reversedContext) + '\n';
        const uprightKeyword = card.upright.split(',')[0].trim();
        fullText += `${uprightKeyword}의 본래 에너지를 되찾는 것이 이 시기의 과제입니다.\n\n`;
      } else {
        fullText += pick(catInfo.uprightContext) + '\n';
        const keyword = meaning.split(',')[0].trim();
        fullText += `${keyword}의 에너지가 ${catInfo.area}에서 긍정적으로 작용하고 있습니다.\n\n`;
      }
    });

    // ===== 종합 해석 =====
    fullText += `${'─'.repeat(40)}\n\n`;
    fullText += `【 종합 해석 】\n\n`;

    // Element analysis
    const elements = state.selectedCards.map(c => c.element).filter(Boolean);
    const elCounts = { Fire: 0, Water: 0, Air: 0, Earth: 0 };
    elements.forEach(e => { if (elCounts[e] !== undefined) elCounts[e]++; });
    const dominantEl = Object.entries(elCounts).sort((a, b) => b[1] - a[1])[0];

    const elementMeaning = {
      Fire: "열정, 창조력, 행동력이 이번 리딩의 기저에 흐르고 있습니다. 에너지가 넘치는 시기이니, 그 불꽃을 올바른 방향으로 태워보세요.",
      Water: "감정, 직관, 관계의 에너지가 이번 리딩을 지배하고 있습니다. 마음의 소리에 귀 기울이고, 감정을 억누르지 말고 흘려보내세요.",
      Air: "사고, 소통, 분석의 에너지가 강하게 작용하고 있습니다. 명확한 판단과 효과적인 커뮤니케이션이 열쇠가 될 것입니다.",
      Earth: "안정, 현실, 물질적 기반의 에너지가 이번 리딩의 토대입니다. 꾸준함과 실용적 접근이 가장 좋은 결과를 만들어낼 것입니다."
    };

    if (dominantEl && dominantEl[1] >= 2) {
      fullText += `✦ 원소 분석: ${elementMeaning[dominantEl[0]]}\n\n`;
    }

    // Major arcana significance
    if (hasMajor) {
      if (majorCount >= 3) {
        fullText += `메이저 아르카나가 ${majorCount}장이나 등장했습니다. 이것은 단순한 일상적 상황이 아닌, 당신의 영혼의 여정에서 매우 중요한 전환점에 서 있음을 의미합니다. 이 시기의 결정과 경험은 오랫동안 당신의 삶에 영향을 미칠 것입니다.\n\n`;
      } else if (majorCount >= 1) {
        fullText += `메이저 아르카나의 등장은 이 상황에 더 큰 우주적 의미가 담겨 있음을 나타냅니다. 단순한 사건을 넘어 영적 성장의 기회로 바라보세요.\n\n`;
      }
    }

    // Reversed cards significance
    if (hasReversed) {
      if (reversedCount >= Math.ceil(state.selectedCards.length / 2)) {
        fullText += `역방향 카드가 많은 것은 내면에서 아직 해결되지 않은 에너지가 많다는 뜻입니다. 외부 상황을 바꾸려 하기 전에 내면의 정리가 먼저 필요할 수 있습니다.\n\n`;
      } else {
        fullText += `역방향 카드는 해당 에너지가 내면화되어 있거나 아직 발현되지 않았음을 보여줍니다. 억눌린 에너지를 의식적으로 풀어주는 것이 도움이 됩니다.\n\n`;
      }
    }

    // Card flow narrative (3+ cards)
    if (state.selectedCards.length >= 3) {
      const first = state.selectedCards[0];
      const mid = state.selectedCards[Math.floor(state.selectedCards.length / 2)];
      const last = state.selectedCards[state.selectedCards.length - 1];

      fullText += `카드의 흐름을 살펴보면, `;
      fullText += `시작점인 ${first.nameKr}${first.isReversed ? '(역)' : ''}에서 출발하여 `;
      fullText += `${mid.nameKr}${mid.isReversed ? '(역)' : ''}을 거쳐 `;
      fullText += `${last.nameKr}${last.isReversed ? '(역)' : ''}(으)로 이어지고 있습니다.\n\n`;

      if (!last.isReversed && !first.isReversed) {
        fullText += `시작과 끝 모두 정방향으로 나타나 전체적인 에너지의 흐름이 순조롭습니다. 현재의 방향을 신뢰하고 꾸준히 나아가세요.\n\n`;
      } else if (first.isReversed && !last.isReversed) {
        fullText += `시작은 어려움 속에 있지만, 결과의 에너지는 밝습니다. 현재의 고난이 성장의 밑거름이 되어 좋은 방향으로 전환될 수 있음을 보여줍니다.\n\n`;
      } else if (!first.isReversed && last.isReversed) {
        fullText += `시작의 에너지는 좋지만, 방심하면 흐름이 바뀔 수 있습니다. 의식적인 노력과 주의가 필요한 시기입니다.\n\n`;
      } else {
        fullText += `전체적으로 내면의 작업이 많이 필요한 시기입니다. 외부보다 내부에 집중하고, 자기 자신과의 대화를 통해 실마리를 찾아보세요.\n\n`;
      }
    }

    // Suit analysis for minor arcana
    const suits = state.selectedCards.filter(c => c.suit).map(c => c.suit);
    const suitCounts = {};
    suits.forEach(s => { suitCounts[s] = (suitCounts[s] || 0) + 1; });
    const dominantSuit = Object.entries(suitCounts).sort((a, b) => b[1] - a[1])[0];

    if (dominantSuit && dominantSuit[1] >= 2) {
      const suitInsight = {
        Wands: "완드(불) 수트의 카드가 다수 등장하여, 현재 상황에서 열정과 의지, 창조적 에너지가 핵심적으로 작용하고 있습니다.",
        Cups: "컵(물) 수트의 카드가 두드러지게 나타나, 감정과 관계, 직관의 영역이 이번 리딩의 중심에 있습니다.",
        Swords: "소드(공기) 수트의 카드가 강하게 나타나, 사고의 명확함, 진실과의 대면, 결단이 필요한 시기임을 보여줍니다.",
        Pentacles: "펜타클(땅) 수트의 카드가 많이 등장하여, 현실적인 문제들 — 재정, 건강, 일상적 안정 — 이 중심 주제입니다."
      };
      fullText += (suitInsight[dominantSuit[0]] || '') + '\n\n';
    }

    // ===== 조언 =====
    fullText += `${'─'.repeat(40)}\n\n`;
    fullText += `【 조언 】\n\n`;
    fullText += `✦ ${pick(catInfo.advice)}\n\n`;

    // Closing wisdom
    const closings = [
      "타로는 확정된 운명을 읽는 것이 아니라, 현재의 에너지 흐름을 비추는 거울입니다. 이 거울에 비친 모습을 통해 더 나은 선택을 할 수 있는 힘이 당신에게 있습니다.",
      "카드가 보여주는 것은 '가능성'입니다. 가장 어두운 카드도 경고이지 운명이 아닙니다. 의식적인 선택과 행동으로 흐름을 바꿀 수 있습니다.",
      "오늘의 리딩이 당신의 마음에 작은 불씨를 남기길 바랍니다. 그 불씨가 어떤 불꽃이 될지는 당신의 손에 달려 있습니다.",
      "카드 위의 그림은 당신 안에 이미 있는 지혜의 반영입니다. 오늘 카드에서 느낀 직감을 소중히 간직해주세요.",
      "이 리딩이 정답은 아닐 수 있지만, 스스로에게 질문을 던지는 계기가 되었길 바랍니다. 좋은 질문이 좋은 답을 만듭니다.",
      "우주는 준비된 사람에게 기회를 줍니다. 오늘의 리딩을 통해 무엇을 준비해야 하는지 한 가지라도 발견하셨길 바랍니다."
    ];
    fullText += pick(closings) + '\n';

    // Display full text with fade-in animation
    textEl.style.opacity = '0';
    textEl.textContent = fullText;
    textEl.style.transition = 'opacity 0.8s ease';
    requestAnimationFrame(() => {
      textEl.style.opacity = '1';
    });
  }, 500);
}

// ===== RESET =====
function initResetBtn() {
  document.getElementById('reset-btn').addEventListener('click', () => {
    state.currentSpread = null;
    state.selectedCards = [];
    state.isShuffled = false;
    state.selectedCategory = null;

    document.getElementById('spread-selection').style.display = 'block';
    document.getElementById('reading-area').classList.remove('active');
    document.getElementById('reset-btn').style.display = 'none';
    document.getElementById('interpretation-area').classList.remove('active');
    document.getElementById('spread-layout').classList.remove('active');
    document.getElementById('selection-area').classList.remove('active');
  });
}
