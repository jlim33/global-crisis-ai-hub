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
    id: "classic-canon",
    title: "Pachelbel - Canon in D major (파헬벨 캐논 변주곡)",
    artist: "Classic Best Masterpiece",
    category: "classical",
    categoryLabel: "평화의 클래식 🎻",
    src: "/audio/classic-best/01-pachelbel-canon.mp3",
    duration: "6:23",
  },
  {
    id: "classic-fur-elise",
    title: "Beethoven - Für Elise (베토벤 엘리제를 위하여)",
    artist: "Classic Best Masterpiece",
    category: "classical",
    categoryLabel: "클래식 피아노 🎹",
    src: "/audio/classic-best/02-beethoven-fur-elise.mp3",
    duration: "3:49",
  },
  {
    id: "classic-winter",
    title: "Vivaldi - Four Seasons 'Winter' 1st Mvt (비발디 사계 '겨울' 1악장)",
    artist: "Classic Best Masterpiece",
    category: "classical",
    categoryLabel: "클래식 현악 🎻",
    src: "/audio/classic-best/03-vivaldi-winter-1st.mp3",
    duration: "3:44",
  },
  {
    id: "classic-liebesfreud",
    title: "Kreisler - Liebesfreud (크라이슬러 사랑의 기쁨)",
    artist: "Classic Best Masterpiece",
    category: "classical",
    categoryLabel: "클래식 바이올린 🎻",
    src: "/audio/classic-best/04-kreisler-liebesfreud.mp3",
    duration: "3:32",
  },
  {
    id: "classic-thais",
    title: "Massenet - Méditation from Thaïs (마스네 타이스의 명상곡)",
    artist: "Classic Best Masterpiece",
    category: "classical",
    categoryLabel: "클래식 명상 🎻",
    src: "/audio/classic-best/05-massenet-meditation-thais.mp3",
    duration: "5:01",
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
  },
];
