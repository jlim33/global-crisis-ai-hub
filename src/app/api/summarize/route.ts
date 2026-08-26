import { NextRequest, NextResponse } from "next/server";
import { generateCrisisSummary } from "@/lib/aiSummarizer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { title, content, category, apiKey, lang } = await req.json();
    const effectiveLang = lang === "en" ? "en" : "ko";

    const geminiKey = apiKey || process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      const local = generateCrisisSummary(title, content, category, effectiveLang);
      return NextResponse.json({ summary: local });
    }

    const prompt = effectiveLang === "en"
      ? `You are an elite planetary defense and humanitarian AI intelligence analyst. Summarize this global crisis / AI warfare / climate disaster report in 3 high-impact bullet points and diagnose strategic and civilian implications.
Title: ${title}
Category: ${category}
Content: ${content.slice(0, 1500)}

Respond in valid JSON only with keys:
"tldr": (array of 3 punchy situation strings),
"whyItMatters": (string explaining civilian safety, geopolitical balance, or planetary resilience),
"threatLevel": ("Level 1: Critical Emergency 🚨" | "Level 2: Severe Alert ⚠️" | "Level 3: Moderate Risk ⚡" | "Level 4: Relief in Progress 🕊️"),
"aiRole": ("Autonomous Weaponry Risk ⚔️" | "AI Humanitarian Rescue & Disaster Prediction 🌐" | "Dual-Use Cyber & Space Tech 🛰️" | "Policy & Global Governance 📜"),
"affectedRegions": (array of region strings, e.g. ["Ukraine", "Pacific Rim"]),
"humanitarianAction": (short string summarizing actionable aid or response status)`
      : `당신은 최고 권위의 전 지구 안보 및 AI 인도주의 구호 분석가입니다. 다음 글로벌 위기, AI 군사/전쟁, 기후재난 기사를 3줄로 요약하고 안보 및 인도주의적 시사점을 진단해주세요.
제목: ${title}
카테고리: ${category}
본문: ${content.slice(0, 1500)}

반드시 다음 JSON 형식으로만 응답하세요:
{
  "tldr": ["요약1", "요약2", "요약3"],
  "whyItMatters": "민간인 안전, 안보 균형 및 기후 회복력 관점의 시사점",
  "threatLevel": "1단계: 최고 비상 위기 🚨" | "2단계: 심각한 분쟁/재난 ⚠️" | "3단계: 주시 및 경계 ⚡" | "4단계: 구호 및 복구 진행 🕊️",
  "aiRole": "자율무기/군사적 위험 ⚔️" | "AI 인도주의 구호 & 조기경보 🌐" | "사이버/우주 듀얼유즈 기술 🛰️" | "글로벌 규범 및 평화 정책 📜",
  "affectedRegions": ["주요지역1", "주요지역2"],
  "humanitarianAction": "긴급 구호 및 현장 대응 현황"
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      const local = generateCrisisSummary(title, content, category, effectiveLang);
      return NextResponse.json({ summary: local });
    }

    const data = await response.json();
    const rawJsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJsonText) {
      const local = generateCrisisSummary(title, content, category, effectiveLang);
      return NextResponse.json({ summary: local });
    }

    const parsed = JSON.parse(rawJsonText);
    return NextResponse.json({ summary: parsed });
  } catch (err: any) {
    console.error("[API/Summarize] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
