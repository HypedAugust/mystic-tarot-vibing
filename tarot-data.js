// 78장 타로카드 데이터
const TAROT_CARDS = {
  major: [
    { id: 0, name: "The Fool", nameKr: "바보", symbol: "🃏", keywords: ["새로운 시작", "모험", "순수"], upright: "새로운 시작, 자유로운 영혼, 모험", reversed: "무모함, 부주의, 위험 감수", element: "Air", color: "#FFD700" },
    { id: 1, name: "The Magician", nameKr: "마법사", symbol: "🪄", keywords: ["창조", "의지", "능력"], upright: "창조력, 자신감, 기술의 활용", reversed: "속임수, 능력 부족, 기회 낭비", element: "Mercury", color: "#FF4500" },
    { id: 2, name: "The High Priestess", nameKr: "여사제", symbol: "🌙", keywords: ["직관", "신비", "내면"], upright: "직관, 무의식, 내면의 지혜", reversed: "비밀, 억압된 감정, 직관 무시", element: "Moon", color: "#4169E1" },
    { id: 3, name: "The Empress", nameKr: "여황제", symbol: "👑", keywords: ["풍요", "모성", "자연"], upright: "풍요, 모성애, 창조적 에너지", reversed: "의존, 공허함, 창조력 부족", element: "Venus", color: "#228B22" },
    { id: 4, name: "The Emperor", nameKr: "황제", symbol: "🏛️", keywords: ["권위", "구조", "안정"], upright: "권위, 리더십, 안정적 구조", reversed: "독재, 경직, 통제 욕구", element: "Aries", color: "#8B0000" },
    { id: 5, name: "The Hierophant", nameKr: "교황", symbol: "⛪", keywords: ["전통", "가르침", "신앙"], upright: "전통, 영적 가르침, 제도", reversed: "독단, 형식주의, 반항", element: "Taurus", color: "#800080" },
    { id: 6, name: "The Lovers", nameKr: "연인", symbol: "💕", keywords: ["사랑", "선택", "조화"], upright: "사랑, 조화, 중요한 선택", reversed: "불화, 가치관 충돌, 잘못된 선택", element: "Gemini", color: "#FF69B4" },
    { id: 7, name: "The Chariot", nameKr: "전차", symbol: "⚔️", keywords: ["승리", "의지", "전진"], upright: "승리, 결단력, 전진", reversed: "방향 상실, 공격성, 좌절", element: "Cancer", color: "#4682B4" },
    { id: 8, name: "Strength", nameKr: "힘", symbol: "🦁", keywords: ["용기", "인내", "내면의 힘"], upright: "내면의 힘, 용기, 인내", reversed: "자기 의심, 약함, 불안", element: "Leo", color: "#DAA520" },
    { id: 9, name: "The Hermit", nameKr: "은둔자", symbol: "🏔️", keywords: ["성찰", "고독", "지혜"], upright: "내면 탐구, 성찰, 지혜의 추구", reversed: "고립, 외로움, 현실 도피", element: "Virgo", color: "#696969" },
    { id: 10, name: "Wheel of Fortune", nameKr: "운명의 수레바퀴", symbol: "🎡", keywords: ["운명", "변화", "순환"], upright: "행운, 전환점, 운명의 변화", reversed: "불운, 저항, 통제 불능", element: "Jupiter", color: "#9370DB" },
    { id: 11, name: "Justice", nameKr: "정의", symbol: "⚖️", keywords: ["공정", "진실", "균형"], upright: "공정, 진실, 인과응보", reversed: "불공정, 부정직, 책임 회피", element: "Libra", color: "#2F4F4F" },
    { id: 12, name: "The Hanged Man", nameKr: "매달린 사람", symbol: "🙃", keywords: ["희생", "관점", "기다림"], upright: "새로운 관점, 희생, 기다림", reversed: "저항, 이기심, 지연", element: "Neptune", color: "#008B8B" },
    { id: 13, name: "Death", nameKr: "죽음", symbol: "💀", keywords: ["변화", "끝", "재탄생"], upright: "변화, 전환, 끝과 새로운 시작", reversed: "변화 저항, 집착, 정체", element: "Scorpio", color: "#1C1C1C" },
    { id: 14, name: "Temperance", nameKr: "절제", symbol: "🏺", keywords: ["균형", "조화", "인내"], upright: "균형, 절제, 조화로운 통합", reversed: "불균형, 과도함, 조급함", element: "Sagittarius", color: "#87CEEB" },
    { id: 15, name: "The Devil", nameKr: "악마", symbol: "😈", keywords: ["유혹", "속박", "그림자"], upright: "유혹, 물질적 집착, 그림자", reversed: "해방, 속박에서 벗어남, 자각", element: "Capricorn", color: "#2C0033" },
    { id: 16, name: "The Tower", nameKr: "탑", symbol: "🗼", keywords: ["파괴", "충격", "해방"], upright: "갑작스런 변화, 파괴, 깨달음", reversed: "변화 회피, 서서히 무너짐", element: "Mars", color: "#B22222" },
    { id: 17, name: "The Star", nameKr: "별", symbol: "⭐", keywords: ["희망", "영감", "평화"], upright: "희망, 영감, 내면의 평화", reversed: "절망, 자신감 상실, 불안", element: "Aquarius", color: "#00CED1" },
    { id: 18, name: "The Moon", nameKr: "달", symbol: "🌕", keywords: ["환상", "불안", "무의식"], upright: "환상, 무의식, 직감", reversed: "혼란 해소, 두려움 극복", element: "Pisces", color: "#191970" },
    { id: 19, name: "The Sun", nameKr: "태양", symbol: "☀️", keywords: ["기쁨", "성공", "활력"], upright: "기쁨, 성공, 긍정적 에너지", reversed: "일시적 우울, 과도한 낙관", element: "Sun", color: "#FFA500" },
    { id: 20, name: "Judgement", nameKr: "심판", symbol: "📯", keywords: ["부활", "각성", "결단"], upright: "부활, 자기 평가, 새로운 소명", reversed: "자기 의심, 후회, 결단 부족", element: "Pluto", color: "#C0C0C0" },
    { id: 21, name: "The World", nameKr: "세계", symbol: "🌍", keywords: ["완성", "성취", "통합"], upright: "완성, 성취, 새로운 순환의 시작", reversed: "미완성, 지연, 목표 미달", element: "Saturn", color: "#4B0082" }
  ],
  minor: {
    wands: generateSuit("Wands", "완드", "🔥", "Fire", "#FF6347", [
      { name: "Ace", nameKr: "에이스", upright: "새로운 열정, 영감, 창조적 시작", reversed: "지연, 동기 부족, 좌절" },
      { name: "Two", nameKr: "2", upright: "미래 계획, 결정, 개인의 힘", reversed: "계획 부족, 두려움, 우유부단" },
      { name: "Three", nameKr: "3", upright: "확장, 성장, 해외 기회", reversed: "장애물, 지연, 좌절감" },
      { name: "Four", nameKr: "4", upright: "축하, 안정, 가정의 행복", reversed: "불안정, 미완성, 갈등" },
      { name: "Five", nameKr: "5", upright: "갈등, 경쟁, 의견 충돌", reversed: "갈등 해소, 합의, 다양성 존중" },
      { name: "Six", nameKr: "6", upright: "승리, 인정, 자신감", reversed: "실패, 자만, 명성 추락" },
      { name: "Seven", nameKr: "7", upright: "방어, 도전, 인내", reversed: "포기, 압도됨, 불안" },
      { name: "Eight", nameKr: "8", upright: "빠른 진행, 여행, 급격한 변화", reversed: "지연, 좌절, 잘못된 방향" },
      { name: "Nine", nameKr: "9", upright: "인내, 회복력, 끈기", reversed: "피로, 의심, 방어적 태도" },
      { name: "Ten", nameKr: "10", upright: "과중한 부담, 책임, 스트레스", reversed: "짐 내려놓기, 위임, 해방" },
      { name: "Page", nameKr: "시종", upright: "탐험, 열정, 새로운 아이디어", reversed: "방향 없음, 산만, 미성숙" },
      { name: "Knight", nameKr: "기사", upright: "모험, 에너지, 열정적 추진", reversed: "성급함, 무모함, 분노" },
      { name: "Queen", nameKr: "여왕", upright: "자신감, 독립, 사교적 매력", reversed: "질투, 이기심, 요구적" },
      { name: "King", nameKr: "왕", upright: "리더십, 비전, 기업가 정신", reversed: "독단적, 가혹함, 고압적" }
    ]),
    cups: generateSuit("Cups", "컵", "🏆", "Water", "#4169E1", [
      { name: "Ace", nameKr: "에이스", upright: "새로운 감정, 사랑의 시작, 직감", reversed: "감정 억압, 공허함, 차단된 창의성" },
      { name: "Two", nameKr: "2", upright: "파트너십, 사랑, 상호 매력", reversed: "불균형, 이별, 소통 부족" },
      { name: "Three", nameKr: "3", upright: "우정, 축하, 공동체", reversed: "과음, 소외, 고립" },
      { name: "Four", nameKr: "4", upright: "명상, 무관심, 재평가", reversed: "새로운 동기, 기회 인식" },
      { name: "Five", nameKr: "5", upright: "상실, 슬픔, 후회", reversed: "수용, 회복, 앞으로 나아감" },
      { name: "Six", nameKr: "6", upright: "향수, 어린 시절 추억, 순수", reversed: "과거 집착, 비현실적, 향수병" },
      { name: "Seven", nameKr: "7", upright: "환상, 선택, 유혹", reversed: "현실 직시, 명확한 선택" },
      { name: "Eight", nameKr: "8", upright: "떠남, 포기, 더 깊은 의미 추구", reversed: "두려움, 집착, 떠나지 못함" },
      { name: "Nine", nameKr: "9", upright: "만족, 소원 성취, 감사", reversed: "불만족, 탐욕, 물질주의" },
      { name: "Ten", nameKr: "10", upright: "행복한 가정, 조화, 정서적 충만", reversed: "가정 불화, 이상과 현실의 괴리" },
      { name: "Page", nameKr: "시종", upright: "창의적 기회, 직관적 메시지", reversed: "감정적 미성숙, 공상" },
      { name: "Knight", nameKr: "기사", upright: "로맨스, 매력, 상상력", reversed: "기분 변화, 비현실적, 질투" },
      { name: "Queen", nameKr: "여왕", upright: "감정적 안정, 공감, 돌봄", reversed: "감정적 불안, 의존, 조종" },
      { name: "King", nameKr: "왕", upright: "감정적 균형, 외교, 관대", reversed: "감정적 조종, 변덕, 냉담" }
    ]),
    swords: generateSuit("Swords", "소드", "⚔️", "Air", "#708090", [
      { name: "Ace", nameKr: "에이스", upright: "명확한 사고, 새로운 아이디어, 진실", reversed: "혼란, 잔인한 진실, 오해" },
      { name: "Two", nameKr: "2", upright: "어려운 선택, 교착 상태, 회피", reversed: "결단, 정보 과부하, 거짓말" },
      { name: "Three", nameKr: "3", upright: "마음의 상처, 슬픔, 이별", reversed: "회복, 용서, 앞으로 나아감" },
      { name: "Four", nameKr: "4", upright: "휴식, 명상, 회복", reversed: "불안, 소진, 활동 재개" },
      { name: "Five", nameKr: "5", upright: "갈등, 패배, 이기심", reversed: "화해, 과거의 원한 놓기" },
      { name: "Six", nameKr: "6", upright: "전환, 여행, 어려움을 뒤로함", reversed: "정체, 미해결 문제" },
      { name: "Seven", nameKr: "7", upright: "속임수, 전략, 기지", reversed: "양심의 가책, 자백, 반성" },
      { name: "Eight", nameKr: "8", upright: "제한, 갇힌 느낌, 무력감", reversed: "해방, 새로운 관점, 자유" },
      { name: "Nine", nameKr: "9", upright: "불안, 걱정, 악몽", reversed: "희망, 회복, 도움 요청" },
      { name: "Ten", nameKr: "10", upright: "끝, 고통의 극한, 배신", reversed: "회복, 재생, 최악이 지남" },
      { name: "Page", nameKr: "시종", upright: "호기심, 새로운 아이디어, 소식", reversed: "험담, 속임수, 미성숙" },
      { name: "Knight", nameKr: "기사", upright: "야망, 빠른 행동, 결단력", reversed: "무모함, 공격성, 냉혹함" },
      { name: "Queen", nameKr: "여왕", upright: "독립, 명석함, 직접적 소통", reversed: "냉담, 잔인한 말, 편견" },
      { name: "King", nameKr: "왕", upright: "지적 권위, 진실, 명확한 사고", reversed: "조종, 독재, 잔인함" }
    ]),
    pentacles: generateSuit("Pentacles", "펜타클", "💰", "Earth", "#228B22", [
      { name: "Ace", nameKr: "에이스", upright: "새로운 재정적 기회, 번영", reversed: "기회 상실, 재정 불안, 계획 부족" },
      { name: "Two", nameKr: "2", upright: "균형, 멀티태스킹, 적응", reversed: "불균형, 우선순위 혼란" },
      { name: "Three", nameKr: "3", upright: "팀워크, 숙련, 학습", reversed: "노력 부족, 질 낮은 작업" },
      { name: "Four", nameKr: "4", upright: "절약, 안정, 소유욕", reversed: "탐욕, 물질주의, 인색함" },
      { name: "Five", nameKr: "5", upright: "경제적 어려움, 고립, 걱정", reversed: "회복, 도움, 영적 풍요" },
      { name: "Six", nameKr: "6", upright: "관대함, 나눔, 번영", reversed: "부채, 이기심, 일방적 관계" },
      { name: "Seven", nameKr: "7", upright: "인내, 장기 투자, 보상 기다림", reversed: "조급함, 투자 실패, 보상 없음" },
      { name: "Eight", nameKr: "8", upright: "장인 정신, 근면, 기술 개발", reversed: "완벽주의, 무목적, 동기 부족" },
      { name: "Nine", nameKr: "9", upright: "풍요, 자립, 사치", reversed: "재정적 좌절, 자립심 부족" },
      { name: "Ten", nameKr: "10", upright: "부, 가족의 번영, 유산", reversed: "재정적 손실, 가족 분쟁" },
      { name: "Page", nameKr: "시종", upright: "새로운 기회, 학습, 목표 설정", reversed: "비현실적 목표, 집중 부족" },
      { name: "Knight", nameKr: "기사", upright: "근면, 책임감, 꾸준한 노력", reversed: "지루함, 게으름, 정체" },
      { name: "Queen", nameKr: "여왕", upright: "실용적, 풍요, 안정감", reversed: "불안, 의존, 질투" },
      { name: "King", nameKr: "왕", upright: "풍요, 안정, 사업 성공", reversed: "탐욕, 물질만능주의, 독단" }
    ])
  }
};

function generateSuit(suit, suitKr, suitSymbol, element, color, cards) {
  return cards.map((card, index) => ({
    id: `${suit.toLowerCase()}_${card.name.toLowerCase()}`,
    suit,
    suitKr,
    suitSymbol,
    name: `${card.name} of ${suit}`,
    nameKr: `${suitKr} ${card.nameKr}`,
    symbol: suitSymbol,
    element,
    color,
    upright: card.upright,
    reversed: card.reversed,
    rank: index
  }));
}

function getAllCards() {
  const allCards = [];
  TAROT_CARDS.major.forEach(card => {
    allCards.push({ ...card, type: "major", suit: null, suitKr: "메이저 아르카나" });
  });
  Object.values(TAROT_CARDS.minor).forEach(suitCards => {
    suitCards.forEach(card => {
      allCards.push({ ...card, type: "minor" });
    });
  });
  return allCards;
}
