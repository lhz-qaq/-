import { LanternItem, LanternType } from '../types';

export const ANCIENT_NAMES = [
  "归巢", "寄情", "未央", "乘风", "拾忆", "听雨", "观澜", "止水", "逐光", "问月",
  "流觞", "藏风", "栖云", "落花", "烟雨", "寒笛", "清照", "照夜", "拂衣", "忘机",
  "溯流", "星渡", "微芒", "长吟", "惊鸿", "听涛", "听松", "见山", "望海", "幽兰",
  "竹影", "松风", "鹤唳", "寻山", "怀远"
];

export const COSMIC_ECHOES = [
  "此念已入夜河", "风已记得你的名字", "星光收下了这封信", "夜雾中有回响",
  "长河漫漫，你我不孤", "今夜万家灯火，有一盏为你而亮", "流光掠过山海，带走了沉重",
  "群星收到了你的低语", "雾气轻柔地拥抱了这份执念", "宇宙无言，但风已知晓",
  "时间会抚平所有的褶皱", "长风送万里，心念自生花", "浩瀚星海中，此念已被珍藏",
  "天幕倾听了你的故事", "心微动，星已觉", "风起时，回音袅袅",
  "流光织成夜的锦缎", "放下即是自在，升起便是祝福", "夜色温柔，收容一切情绪",
  "山川湖海，皆是心之归处"
];

export function generateAncientName(input: string): string {
  if (/[家乡父母归]/.test(input)) return "归巢";
  if (/[你卿爱恋情]/.test(input)) return "寄情";
  if (/[梦想愿望期]/.test(input)) return "逐光";
  if (/[忆旧昔曾年]/.test(input)) return "拾忆";
  return ANCIENT_NAMES[Math.floor(Math.random() * ANCIENT_NAMES.length)];
}

export function generateCosmicEcho(): string {
  return COSMIC_ECHOES[Math.floor(Math.random() * COSMIC_ECHOES.length)];
}

export function generateAtmosphereSvg(type: string, name: string): string {
  const c1 = type === '愿' ? '%23c43d3d' : type === '念' ? '%23d4af37' : '%2364748b';
  const c2 = type === '愿' ? '%238b261d' : type === '念' ? '%23785a08' : '%23334155';
  const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="360" viewBox="0 0 200 360"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%2305070e"/><stop offset="0.5" stop-color="${c1}" stop-opacity="0.85"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="200" height="360" fill="url(%23g)"/><circle cx="100" cy="130" r="55" fill="%23ffe899" opacity="0.25"/><path d="M0 360 L0 250 Q60 180 120 270 T200 210 L200 360 Z" fill="%23000000" opacity="0.5"/><path d="M0 360 L0 290 Q80 240 150 310 L200 270 L200 360 Z" fill="%23000000" opacity="0.75"/><text x="100" y="80" fill="%23ffe899" opacity="0.4" font-size="20" text-anchor="middle" font-family="serif">${name.slice(0, 2)}</text></svg>`;
  return `data:image/svg+xml;utf8,${rawSvg}`;
}

export function createLocalLantern(text: string, type: LanternType): LanternItem {
  const poem = text.length > 20 ? text.slice(0, 20) + "..." : text;
  const name = generateAncientName(text);
  const echo = generateCosmicEcho();
  const weight = Math.min(0.9, (text.length / 50) * 0.8 + Math.random() * 0.2);
  
  let destiny: "入星" | "化雾" | "归流" = "归流";
  if (weight >= 0.7) destiny = "入星";
  else if (weight < 0.4) destiny = "化雾";

  const imgUrl = generateAtmosphereSvg(type, name);

  return {
    id: "l-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    type,
    originalText: text,
    poem,
    name,
    echo,
    weight,
    destiny,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    author: "人间旅人",
    resonanceCount: 1,
    image: imgUrl,
    imageUrl: imgUrl
  };
}
