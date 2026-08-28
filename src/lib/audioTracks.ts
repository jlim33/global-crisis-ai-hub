export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  category: "ambient" | "classical" | "meditation" | "nature";
  categoryLabel: string;
  src: string;
  duration?: string;
  icon?: string;
}

export const CRISIS_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: "crisis-peaceful-piano",
    title: "Chopin - Nocturne in E-flat major, Op. 9 No. 2",
    artist: "Classical Piano Lounge",
    category: "classical",
    categoryLabel: "평화의 클래식 🎹",
    src: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=chopin-nocturne-op-9-no-2-110829.mp3",
    duration: "4:32",
  },
  {
    id: "crisis-bach-air",
    title: "Bach - Air on the G String",
    artist: "Chamber Strings Ensemble",
    category: "classical",
    categoryLabel: "클래식 현악 🎻",
    src: "https://cdn.pixabay.com/download/audio/2022/03/24/audio_341bbec7bb.mp3?filename=bach-air-on-the-g-string-orchestral-suite-no-3-in-d-major-bwv-1068-105151.mp3",
    duration: "4:15",
  },
  {
    id: "crisis-chanson-cafe",
    title: "Breeze of Paris (Acoustic Chanson)",
    artist: "Parisian Cafe Trio",
    category: "ambient",
    categoryLabel: "파리지앵 샹송 ☕",
    src: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=french-accordion-chanson-122941.mp3",
    duration: "3:10",
  },
  {
    id: "crisis-528hz-peace",
    title: "528Hz Global Peace & Mind Calm",
    artist: "Solfeggio Frequency Project",
    category: "meditation",
    categoryLabel: "528Hz 평화 명상 🕊️",
    src: "https://cdn.pixabay.com/download/audio/2022/11/06/audio_c97693998b.mp3?filename=528hz-healing-meditation-125867.mp3",
    duration: "5:00",
  },
  {
    id: "crisis-tibetan-bowl",
    title: "Tibetan Singing Bowl & Zen Breath",
    artist: "Himalayan Zen Master",
    category: "meditation",
    categoryLabel: "싱잉볼 이완 🌿",
    src: "https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1e01.mp3?filename=tibetan-singing-bowl-meditation-10940.mp3",
    duration: "4:45",
  },
  {
    id: "crisis-forest-rain",
    title: "Healing Forest Rain & Gentle Stream",
    artist: "Nature Bio-Acoustics",
    category: "nature",
    categoryLabel: "치유의 숲 빗소리 🌧️",
    src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-rain-ambient-111154.mp3",
    duration: "6:10",
  }
];
