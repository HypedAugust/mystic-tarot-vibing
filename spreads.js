// 5가지 타로 스프레드 정의
const SPREADS = [
  {
    id: "one-card",
    name: "원 카드",
    nameEn: "One Card",
    description: "간단한 질문이나 오늘의 운세에 적합합니다.",
    cardCount: 1,
    icon: "🎴",
    positions: [
      { name: "답변", description: "질문에 대한 핵심 답변" }
    ],
    layout: [{ x: 50, y: 50, rotate: 0 }]
  },
  {
    id: "three-card",
    name: "쓰리 카드",
    nameEn: "Three Card",
    description: "과거, 현재, 미래를 통해 상황의 흐름을 파악합니다.",
    cardCount: 3,
    icon: "🃏",
    positions: [
      { name: "과거", description: "과거의 영향과 배경" },
      { name: "현재", description: "현재 상황과 도전" },
      { name: "미래", description: "앞으로의 가능성과 결과" }
    ],
    layout: [
      { x: 25, y: 50, rotate: 0 },
      { x: 50, y: 50, rotate: 0 },
      { x: 75, y: 50, rotate: 0 }
    ]
  },
  {
    id: "celtic-cross",
    name: "켈틱 크로스",
    nameEn: "Celtic Cross",
    description: "가장 전통적이고 깊이 있는 10장 스프레드입니다.",
    cardCount: 10,
    icon: "✝️",
    positions: [
      { name: "현재 상황", description: "지금 당신이 처한 상황" },
      { name: "도전/장애물", description: "현재 직면한 도전" },
      { name: "의식적 목표", description: "당신이 의식하는 목표" },
      { name: "무의식적 기반", description: "무의식에 자리잡은 영향" },
      { name: "과거", description: "최근 과거의 영향" },
      { name: "가까운 미래", description: "곧 다가올 영향" },
      { name: "자신의 태도", description: "상황에 대한 당신의 태도" },
      { name: "주변 환경", description: "외부 환경과 타인의 영향" },
      { name: "희망과 두려움", description: "내면의 희망과 두려움" },
      { name: "최종 결과", description: "상황의 최종적 결과" }
    ],
    layout: [
      { x: 35, y: 50, rotate: 0 },
      { x: 35, y: 50, rotate: 90 },
      { x: 35, y: 20, rotate: 0 },
      { x: 35, y: 80, rotate: 0 },
      { x: 15, y: 50, rotate: 0 },
      { x: 55, y: 50, rotate: 0 },
      { x: 75, y: 80, rotate: 0 },
      { x: 75, y: 60, rotate: 0 },
      { x: 75, y: 40, rotate: 0 },
      { x: 75, y: 20, rotate: 0 }
    ]
  },
  {
    id: "relationship",
    name: "연애 스프레드",
    nameEn: "Relationship Spread",
    description: "연애와 관계에 대한 깊이 있는 분석을 제공합니다.",
    cardCount: 5,
    icon: "💕",
    positions: [
      { name: "나의 현재 감정", description: "관계에서 느끼는 감정" },
      { name: "상대방의 감정", description: "상대방이 느끼는 감정" },
      { name: "관계의 기반", description: "두 사람 사이의 기반" },
      { name: "도전 과제", description: "관계에서 해결해야 할 과제" },
      { name: "관계의 미래", description: "관계의 발전 방향" }
    ],
    layout: [
      { x: 25, y: 35, rotate: 0 },
      { x: 75, y: 35, rotate: 0 },
      { x: 50, y: 50, rotate: 0 },
      { x: 50, y: 20, rotate: 0 },
      { x: 50, y: 80, rotate: 0 }
    ]
  },
  {
    id: "career",
    name: "진로 스프레드",
    nameEn: "Career Path",
    description: "직업과 진로에 대한 방향을 제시합니다.",
    cardCount: 5,
    icon: "💼",
    positions: [
      { name: "현재 직업 상황", description: "현재 직업/진로의 상태" },
      { name: "강점", description: "활용할 수 있는 강점" },
      { name: "약점/도전", description: "극복해야 할 약점" },
      { name: "조언", description: "나아가야 할 방향의 조언" },
      { name: "결과/전망", description: "진로의 향후 전망" }
    ],
    layout: [
      { x: 50, y: 80, rotate: 0 },
      { x: 25, y: 55, rotate: 0 },
      { x: 75, y: 55, rotate: 0 },
      { x: 50, y: 35, rotate: 0 },
      { x: 50, y: 10, rotate: 0 }
    ]
  }
];
