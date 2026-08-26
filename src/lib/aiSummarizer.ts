import { AISummary, ThreatLevel, AIRoleImpact, NewsArticle } from "./types";

const COMMON_REGIONS = [
  "Ukraine", "Gaza", "Middle East", "Taiwan Strait", "Red Sea", "Sudan",
  "Pacific Rim", "Amazon Basin", "Arctic", "Mediterranean", "Horn of Africa",
  "Seoul", "Tokyo", "Washington", "Brussels", "Geneva", "한반도", "우크라이나",
  "가자지구", "중동", "동남아", "태평양", "아마존", "북극"
];

export function extractAffectedRegions(title: string, content: string): string[] {
  const text = (title + " " + content).toLowerCase();
  const found: Set<string> = new Set();

  for (const reg of COMMON_REGIONS) {
    if (text.includes(reg.toLowerCase())) {
      found.add(reg);
    }
  }

  const list = Array.from(found);
  return list.length > 0 ? list.slice(0, 3) : ["Global Watch"];
}

export function generateCrisisSummary(
  title: string,
  content: string,
  category: string,
  lang: "ko" | "en" = "ko"
): AISummary {
  const cleanContent = content
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();

  const regions = extractAffectedRegions(title, cleanContent);
  const lower = (title + " " + cleanContent).toLowerCase();

  const sentences = cleanContent
    .split(/(?<=[.?!])\s+/)
    .filter(
      s =>
        s.length > 15 &&
        !s.toLowerCase().includes("copyright") &&
        !s.toLowerCase().includes("subscribe") &&
        !s.includes("기자") &&
        !s.includes("무단전재")
    );

  // ------------------------------------------------------------------
  // 1. English Crisis & Recovery Logic
  // ------------------------------------------------------------------
  if (lang === "en") {
    let bullets: string[] = [];
    if (sentences.length >= 3) {
      bullets = [sentences[0], sentences[1], sentences[Math.min(2, sentences.length - 1)]];
    } else if (sentences.length === 2) {
      bullets = [
        sentences[0],
        sentences[1],
        `International monitors and humanitarian bodies are actively assessing ${category} fallout.`
      ];
    } else if (sentences.length === 1) {
      bullets = [
        sentences[0],
        `Critical planetary and defense developments unfolding in "${title}".`,
        `Urgent call for multilateral coordination and ethical AI risk mitigation.`
      ];
    } else {
      bullets = [
        `Live planetary crisis update on "${title}".`,
        `Emergency response protocols activated across affected zones.`,
        `Refer to the official UN/ReliefWeb report for real-time field data.`
      ];
    }

    bullets = bullets.map(b => b.replace(/\s+/g, " ").trim());

    // Threat Level Evaluation
    let threatLevel: ThreatLevel = "Level 3: Moderate Risk ⚡";
    if (
      lower.includes("missile") ||
      lower.includes("casualt") ||
      lower.includes("airstrike") ||
      lower.includes("nuclear") ||
      lower.includes("earthquake magnitude") ||
      lower.includes("category 5") ||
      lower.includes("famine") ||
      lower.includes("genocide")
    ) {
      threatLevel = "Level 1: Critical Emergency 🚨";
    } else if (
      lower.includes("drone attack") ||
      lower.includes("wildfire") ||
      lower.includes("flood") ||
      lower.includes("cyberattack") ||
      lower.includes("conflict escalation") ||
      lower.includes("heatwave record")
    ) {
      threatLevel = "Level 2: Severe Alert ⚠️";
    } else if (
      lower.includes("peace treaty") ||
      lower.includes("ceasefire") ||
      lower.includes("aid delivered") ||
      lower.includes("restoration") ||
      lower.includes("carbon neutral") ||
      lower.includes("reforestation")
    ) {
      threatLevel = "Level 4: Relief in Progress 🕊️";
    }

    // AI Dual-Role Assessment
    let aiRole: AIRoleImpact = "Dual-Use Cyber & Space Tech 🛰️";
    if (
      lower.includes("drone") ||
      lower.includes("autonomous weapon") ||
      lower.includes("military ai") ||
      lower.includes("cyber warfare") ||
      lower.includes("deepfake election")
    ) {
      aiRole = "Autonomous Weaponry Risk ⚔️";
    } else if (
      lower.includes("disaster prediction") ||
      lower.includes("satellite ai") ||
      lower.includes("climate modeling") ||
      lower.includes("rescue robot") ||
      lower.includes("early warning")
    ) {
      aiRole = "AI Humanitarian Rescue & Disaster Prediction 🌐";
    } else if (
      lower.includes("un resolution") ||
      lower.includes("treaty") ||
      lower.includes("governance") ||
      lower.includes("ethical framework")
    ) {
      aiRole = "Policy & Global Governance 📜";
    }

    // Why It Matters
    let whyItMatters = `Directly shapes civilian safety, global environmental resilience, and international peacekeeping readiness across ${regions.join(", ")}.`;
    if (lower.includes("climate") || lower.includes("flood") || lower.includes("wildfire")) {
      whyItMatters = "Accelerates the urgency for AI-powered early warning infrastructure to protect vulnerable global populations.";
    } else if (lower.includes("drone") || lower.includes("war") || lower.includes("conflict")) {
      whyItMatters = "Highlights the ethical flashpoint of autonomous decision-making in lethal combat zones.";
    }

    // Humanitarian Action
    const humanitarianAction = lower.includes("aid") || lower.includes("relief")
      ? "Emergency aid convoys and satellite restoration units deployed on the ground."
      : "Global humanitarian watchdog alerts issued; monitoring civilian safe zones.";

    return {
      tldr: bullets,
      whyItMatters,
      threatLevel,
      aiRole,
      affectedRegions: regions,
      humanitarianAction
    };
  }

  // ------------------------------------------------------------------
  // 2. Korean Crisis & Recovery Logic
  // ------------------------------------------------------------------
  let bullets: string[] = [];
  if (sentences.length >= 3) {
    bullets = [sentences[0], sentences[1], sentences[Math.min(2, sentences.length - 1)]];
  } else if (sentences.length === 2) {
    bullets = [
      sentences[0],
      sentences[1],
      `${category} 사태와 관련하여 국제사회와 구호기구의 긴급 대응이 이어지고 있습니다.`
    ];
  } else if (sentences.length === 1) {
    bullets = [
      sentences[0],
      `'${title}' 사태는 전 지구적 안보 및 기후 회복력에 중대한 영향을 미치는 사건입니다.`,
      `인도주의적 피해 최소화와 AI 기술을 활용한 신속한 대응이 요구됩니다.`
    ];
  } else {
    bullets = [
      `'${title}' 관련 실시간 지구 위기 속보입니다.`,
      `${category} 분야의 피해 규모와 긴급 구호 현황을 실시간 모니터링 중입니다.`,
      `세부적인 현장 상황은 공식 원문 보고서를 통해 확인하실 수 있습니다.`
    ];
  }

  bullets = bullets.map(b => b.replace(/\s+/g, " ").trim());

  // Threat Level (Korean)
  let threatLevel: ThreatLevel = "3단계: 주시 및 경계 ⚡";
  if (
    lower.includes("미사일") ||
    lower.includes("사망") ||
    lower.includes("폭격") ||
    lower.includes("핵") ||
    lower.includes("지진 규모") ||
    lower.includes("대형 참사") ||
    lower.includes("기근")
  ) {
    threatLevel = "1단계: 최고 비상 위기 🚨";
  } else if (
    lower.includes("드론 공격") ||
    lower.includes("산불") ||
    lower.includes("홍수") ||
    lower.includes("사이버 공격") ||
    lower.includes("교전") ||
    lower.includes("폭염 경보")
  ) {
    threatLevel = "2단계: 심각한 분쟁/재난 ⚠️";
  } else if (
    lower.includes("평화 협정") ||
    lower.includes("휴전") ||
    lower.includes("구호품 지원") ||
    lower.includes("복구 지원") ||
    lower.includes("탄소 감축") ||
    lower.includes("재건")
  ) {
    threatLevel = "4단계: 구호 및 복구 진행 🕊️";
  }

  // AI Dual-Role Assessment (Korean)
  let aiRole: AIRoleImpact = "사이버/우주 듀얼유즈 기술 🛰️";
  if (
    lower.includes("드론") ||
    lower.includes("자율 무기") ||
    lower.includes("군사 ai") ||
    lower.includes("사이버전") ||
    lower.includes("딥페이크")
  ) {
    aiRole = "자율무기/군사적 위험 ⚔️";
  } else if (
    lower.includes("재난 예측") ||
    lower.includes("위성 ai") ||
    lower.includes("기후 모델링") ||
    lower.includes("구조 로봇") ||
    lower.includes("조기 경보")
  ) {
    aiRole = "AI 인도주의 구호 & 조기경보 🌐";
  } else if (
    lower.includes("un 결의안") ||
    lower.includes("협정") ||
    lower.includes("거버넌스") ||
    lower.includes("윤리 기준")
  ) {
    aiRole = "글로벌 규범 및 평화 정책 📜";
  }

  // Why It Matters (Korean)
  let whyItMatters = `해당 지역(${regions.join(", ")})의 민간인 안전과 글로벌 기후/안보 회복력에 직결되는 중대한 사안입니다.`;
  if (lower.includes("기후") || lower.includes("홍수") || lower.includes("산불") || lower.includes("지진")) {
    whyItMatters = "기후재난의 파괴력을 줄이기 위한 AI 기반 조기경보 및 글로벌 구호 네트워크의 신속한 가동이 필수적입니다.";
  } else if (lower.includes("드론") || lower.includes("전쟁") || lower.includes("군사")) {
    whyItMatters = "살상 자율무기(LAWS) 확산 방지와 군사 AI 윤리 규범 확립을 위한 국제사회의 통제가 시급합니다.";
  }

  // Humanitarian Action (Korean)
  const humanitarianAction = lower.includes("구호") || lower.includes("지원")
    ? "국제 적십자 및 UN 현장 구호팀이 피해 지역에 긴급 물자를 지원 중입니다."
    : "국제 인도주의 감시 기구의 경보가 발령되었으며, 안전지대 확보를 모니터링 중입니다.";

  return {
    tldr: bullets,
    whyItMatters,
    threatLevel,
    aiRole,
    affectedRegions: regions,
    humanitarianAction
  };
}

/**
 * Format daily planetary crisis & recovery situation briefing text
 */
export function formatPlanetarySituationReport(articles: NewsArticle[], lang: "ko" | "en" = "ko"): string {
  const dateStr = new Date().toLocaleDateString(lang === "en" ? "en-US" : "ko-KR", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (lang === "en") {
    let body = `🌍 CrisisPulse - Planetary Situation Report & AI Recovery Dispatch (${dateStr})\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    articles.slice(0, 6).forEach((art, idx) => {
      body += `[${idx + 1}] ${art.title}\n`;
      body += `• Source: ${art.source} | Threat: ${art.aiSummary?.threatLevel || "Level 3"} | AI Role: ${art.aiSummary?.aiRole || "Global Tech"}\n`;
      body += `• Key Zones: ${art.regions?.join(", ") || "Global"}\n`;
      if (art.aiSummary?.tldr) {
        art.aiSummary.tldr.forEach(bullet => {
          body += `  - ${bullet}\n`;
        });
      }
      if (art.aiSummary?.whyItMatters) {
        body += `  ★ Strategic / Humanitarian Impact: ${art.aiSummary.whyItMatters}\n`;
      }
      body += `• Field Link: ${art.link}\n\n`;
    });

    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `Generated automatically by CrisisPulse (Planetary Defense & Recovery Network)\n`;
    return body;
  }

  let body = `🌍 글로벌 크라이시스 & AI 펄스 - 일일 지구 상황 & 구호 리포트 (${dateStr})\n`;
  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  articles.slice(0, 6).forEach((art, idx) => {
    body += `[${idx + 1}] ${art.title}\n`;
    body += `• 출처: ${art.source} | 위기등급: ${art.aiSummary?.threatLevel || "3단계"} | AI 역할: ${art.aiSummary?.aiRole || "국제 기술"}\n`;
    body += `• 주요지역: ${art.regions?.join(", ") || "글로벌"}\n`;
    if (art.aiSummary?.tldr) {
      art.aiSummary.tldr.forEach(bullet => {
        body += `  - ${bullet}\n`;
      });
    }
    if (art.aiSummary?.whyItMatters) {
      body += `  ★ 안보 및 인도주의 시사점: ${art.aiSummary.whyItMatters}\n`;
    }
    body += `• 원문 링크: ${art.link}\n\n`;
  });

  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  body += `발행: 글로벌 크라이시스 & AI 펄스 전 지구 상황실\n`;
  return body;
}
