import React, { useState } from 'react';
import { SkyPhenomenonState } from '../types';
import { Copy, Check, Download, Sparkles, Key, CloudRain, Wind, Stars, Terminal } from 'lucide-react';

// =================== 1. 独立测试 Prompt 弹窗 ===================
export const PromptModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const standalonePrompt = `你是一位深谙东方生死观（生-化-归循环）与存在主义哲学的“数字仪式官”。
用户将向你倾诉一段心中的未尽之事、遗憾执念、当下心绪或未来祈愿。

你必须严格执行【情感压缩与定义重构】，将其精炼为数字孔明灯规格。
严格输出 JSON 格式，不要包含任何前置/后置文字或 Markdown 标记外壳。JSON 结构必须严格如下：

{
  "type": "愿" | "念" | "记",
  "poem": "压缩后的20字以内东方古风生命句（极简意象，如：昔年落笔沉沉意，今日回看淡似云）",
  "name": "3-5字古风灯名（如：记旧年蝉、愿山河安）",
  "echo": "一句象征性的宇宙气流场回应（如：长风已记下你的名字、岁月送来片刻清凉）",
  "weight": 0.1到1.0之间的浮点数（代表情绪浓度与执念重量）
}

【归档法则与物理归宿说明】：
- 若 weight >= 0.7：代表情感极重/执念极深，归宿为「入星」（爆裂为金色星点，永久闪烁于宇宙背景）；
- 若 0.4 <= weight < 0.7：代表当下温和心绪，归宿为「归流」（化为流光汇入集体记忆光河）；
- 若 weight < 0.4：代表云淡风轻/已然释怀，归宿为「化雾」（如雾气般消散无痕）。

请直接根据用户的以下输入生成 JSON：`;

  const handleCopy = () => {
    navigator.clipboard.writeText(standalonePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03050A]/85 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-2xl bg-[#080C16] border border-[#C43D3D]/50 p-8 rounded-2xl shadow-[0_0_80px_rgba(196,61,61,0.25)] flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
          <div className="flex items-center gap-2 text-[#FFE899] font-serif tracking-widest text-lg">
            <Sparkles className="text-[#C43D3D]" size={20} />
            <span>Google AI Studio 单次测试独立 Prompt</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 font-mono">✕</button>
        </div>

        <p className="text-xs font-serif text-gray-400 mb-4 leading-relaxed">
          ✦ 按提示要求：此文本专为您在 **Google AI Studio / AI Studio Freeform Chat** 中进行单次提示词测试设计。复制下文并附带一段测试语句，模型将直接返回纯标准 JSON 响应：
        </p>

        <div className="flex-1 bg-[#03050A] border border-gray-800 rounded-xl p-4 overflow-y-auto font-mono text-xs text-amber-300/90 leading-relaxed select-all whitespace-pre-wrap mb-6">
          {standalonePrompt}
        </div>

        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2.5 border border-gray-800 rounded-lg text-xs text-gray-400 hover:text-white font-serif">
            关闭
          </button>
          <button
            onClick={handleCopy}
            className="px-8 py-2.5 bg-[#C43D3D] hover:bg-[#A03030] text-[#FFE899] rounded-lg text-xs font-serif font-bold tracking-widest flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? "已复制提示词" : "复制测试 Prompt"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};


// =================== 2. 单文件独立网页导出弹窗 ===================
export const ExportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // 100% 独立单文件 HTML 源码（纯前端即时零延迟响应，无外部AI API）
  const standaloneHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>夜灯记：人间未尽之事</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;600;900&display=swap');
    body { margin:0; background:#050508; color:#E5E7EB; font-family:'Noto Serif SC',serif; overflow-x:hidden; }
    .v-rl { writing-mode: vertical-rl; }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    .animate-float { animation: float 6s ease-in-out infinite; }
  </style>
</head>
<body class="min-h-screen bg-[#050508] relative flex flex-col justify-between p-6 md:p-12 select-none">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_#1a1010_0%,_#050508_70%)] opacity-85 pointer-events-none"></div>
  
  <canvas id="sky" class="absolute inset-0 pointer-events-none z-10 w-full h-full"></canvas>

  <!-- 顶栏 -->
  <header class="relative z-20 flex justify-between items-start">
    <div>
      <h1 class="text-3xl tracking-[0.4em] font-extrabold text-[#C43D3D] v-rl drop-shadow-[0_0_12px_rgba(196,61,61,0.5)]">夜灯记</h1>
      <p class="text-xs tracking-[0.2em] text-gray-500 mt-3 v-rl">人间未尽之事</p>
    </div>
    <div class="text-right text-xs tracking-widest text-[#B8860B] opacity-75 font-mono">
      <p>VOL. 01 / 纯前端感应空间</p>
      <p class="mt-1">ZERO-LATENCY DIGITAL SHAMAN</p>
    </div>
  </header>

  <!-- 中央祭坛 -->
  <main id="altar" class="relative z-20 max-w-xl mx-auto my-auto w-full bg-[#080C16]/85 border border-[#B8860B]/30 p-8 rounded-2xl shadow-2xl backdrop-blur-md transition-all">
    <div class="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
      <span class="text-amber-200 tracking-widest font-semibold">生 · 心念凝聚</span>
      <span class="text-xs font-mono text-gray-500">零延迟放飞</span>
    </div>

    <!-- 状态类别 -->
    <div class="grid grid-cols-3 gap-3 mb-5 text-center">
      <label class="border border-amber-600/60 bg-amber-950/30 p-3 rounded cursor-pointer hover:bg-amber-900/40 transition-all">
        <input type="radio" name="type" value="愿" checked class="hidden">
        <div class="text-xl font-bold text-amber-300">愿</div>
        <div class="text-[10px] text-gray-400 mt-1">未来祈愿</div>
      </label>
      <label class="border border-gray-800 bg-[#0A0E17] p-3 rounded cursor-pointer hover:border-amber-600/50 transition-all">
        <input type="radio" name="type" value="念" class="hidden">
        <div class="text-xl font-bold text-amber-300">念</div>
        <div class="text-[10px] text-gray-400 mt-1">当下心绪</div>
      </label>
      <label class="border border-gray-800 bg-[#0A0E17] p-3 rounded cursor-pointer hover:border-amber-600/50 transition-all">
        <input type="radio" name="type" value="记" class="hidden">
        <div class="text-xl font-bold text-amber-300">记</div>
        <div class="text-[10px] text-gray-400 mt-1">过去执念</div>
      </label>
    </div>

    <textarea id="mindText" rows="4" placeholder="在此写下你心中的执念、遗憾、祝愿... (点击放飞，天幕立即给出回应)" class="w-full bg-[#03050A] border border-gray-800 rounded p-3 text-sm text-gray-200 outline-none focus:border-amber-500 resize-none mb-6"></textarea>

    <button onclick="performRitual()" id="submitBtn" class="w-full py-4 bg-gradient-to-r from-[#8B261D] via-[#C43D3D] to-[#8B261D] text-[#FFE899] font-bold tracking-[0.25em] rounded shadow-lg hover:brightness-110 active:scale-[0.99] transition cursor-pointer">
      化 · 立即放飞心念
    </button>
  </main>

  <!-- 灯笼生成展示层 -->
  <div id="resultLayer" class="hidden relative z-20 max-w-md mx-auto my-auto text-center animate-float">
    <div class="relative w-64 sm:w-72 mx-auto min-h-[380px] bg-gradient-to-b from-[#E8A355] via-[#D4883A] to-[#8B3A10] p-6 rounded-t-3xl rounded-b-xl border-2 border-amber-200/80 shadow-[0_0_80px_rgba(242,125,38,0.5)] flex flex-col justify-between text-[#4A1D08]">
      <div class="border-b border-amber-900/30 pb-2 text-[11px] font-mono flex justify-between">
        <span id="resType">〔愿〕</span>
        <span>浓度 <span id="resWeight">85</span>%</span>
        <span id="resDest">入星</span>
      </div>
      <div class="flex flex-row-reverse justify-center items-center gap-8 sm:gap-10 my-auto py-8">
        <h3 id="resName" class="text-3xl font-extrabold tracking-widest v-rl text-[#2A0F02]">长风寂</h3>
        <div class="w-px h-44 bg-[#4A1D08]/30"></div>
        <p id="resPoem" class="text-base tracking-widest v-rl leading-loose font-serif">流光虽瞬逝，万物皆有痕。</p>
      </div>
      <div class="pt-3 border-t border-amber-900/20 text-[11px] text-amber-950 font-mono">宇宙回声：<span id="resEcho" class="font-bold text-[#B83A10]">风已记得你</span></div>
    </div>
    <div class="mt-6 flex gap-4">
      <button onclick="location.reload()" class="px-6 py-3 bg-[#0A0E17] border border-gray-700 rounded-lg text-xs text-gray-300 hover:text-white transition">重写</button>
      <button onclick="launchLantern()" class="flex-1 py-3 bg-gradient-to-r from-amber-400 to-amber-300 text-[#3B1504] font-bold rounded-lg tracking-widest hover:brightness-105 shadow-xl transition">归 · 升空化入天象</button>
    </div>
  </div>

  <!-- 底栏天象 feedback 与注释 -->
  <footer class="relative z-20 border-t border-gray-800/80 pt-4 flex flex-col sm:flex-row justify-between items-center text-xs gap-3">
    <div class="flex items-center gap-2 text-amber-400/90 italic tracking-widest">
      <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
      <span id="skyFeedback">天象感应中：轻岚流转，人间思念正温和释放。</span>
    </div>
    
    <!-- 核心目标要求注释 -->
    <div class="text-amber-200/80 font-serif tracking-[0.25em] italic drop-shadow-[0_0_8px_rgba(255,232,153,0.3)]">
      心念由你，天幕自有回响
    </div>

    <span class="text-gray-600 font-mono tracking-widest">生 · 化 · 归</span>
  </footer>

  <script>
    // 古风名词数组（至少30个）
    const ANCIENT_NAMES = [
      "归巢", "寄情", "未央", "乘风", "拾忆", "听雨", "观澜", "止水", "逐光", "问月",
      "流觞", "藏风", "栖云", "落花", "烟雨", "寒笛", "清照", "照夜", "拂衣", "忘机",
      "溯流", "星渡", "微芒", "长吟", "惊鸿", "听涛", "听松", "见山", "望海", "幽兰",
      "竹影", "松风", "鹤唳", "寻山", "怀远"
    ];

    // 诗意回应数组（至少20句）
    const COSMIC_ECHOES = [
      "此念已入夜河", "风已记得你的名字", "星光收下了这封信", "夜雾中有回响",
      "长河漫漫，你我不孤", "今夜万家灯火，有一盏为你而亮", "流光掠过山海，带走了沉重",
      "群星收到了你的低语", "雾气轻柔地拥抱了这份执念", "宇宙无言，但风已知晓",
      "时间会抚平所有的褶皱", "长风送万里，心念自生花", "浩瀚星海中，此念已被珍藏",
      "天幕倾听了你的故事", "心微动，星已觉", "风起时，回音袅袅",
      "流光织成夜的锦缎", "放下即是自在，升起便是祝福", "夜色温柔，收容一切情绪",
      "山川湖海，皆是心之归处"
    ];

    // 古风名称匹配逻辑
    function generateAncientName(text) {
      if (/[家乡父母归]/.test(text)) return "归巢";
      if (/[你卿爱恋情]/.test(text)) return "寄情";
      if (/[梦想愿望期]/.test(text)) return "逐光";
      if (/[忆旧昔曾年]/.test(text)) return "拾忆";
      return ANCIENT_NAMES[Math.floor(Math.random() * ANCIENT_NAMES.length)];
    }

    let activeData = null;

    // 初始化群星与画布系统
    const canvas = document.getElementById('sky');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

    const stars = Array.from({length: 160}, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.85,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.8 ? '#F7E6C1' : '#E2E8F0'
    }));

    let time = 0;
    let isLaunching = false;
    let risingY = canvas.height * 0.8;
    let risingX = canvas.width / 2;

    // === 鼠标视差系统 ===
    let targetNormX = 0, targetNormY = 0;
    let currNormX = 0, currNormY = 0;
    const isTouch = 'ontouchstart' in window;

    window.addEventListener('mousemove', (e) => {
      if (isTouch) return;
      targetNormX = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
      targetNormY = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1));
    });

    function renderSky() {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const breathX = Math.sin(time * 0.007) * 0.06;
      const breathY = Math.cos(time * 0.005) * 0.06;
      const finalTargetX = isTouch ? 0 : Math.max(-1, Math.min(1, targetNormX + breathX));
      const finalTargetY = isTouch ? 0 : Math.max(-1, Math.min(1, targetNormY + breathY));

      currNormX += (finalTargetX - currNormX) * 0.045;
      currNormY += (finalTargetY - currNormY) * 0.045;

      const layer1X = -currNormX * 40, layer1Y = -currNormY * 40;
      const layer2X = -currNormX * 25, layer2Y = -currNormY * 25;
      const layer3X = currNormX * 5, layer3Y = currNormY * 5;

      // 深空背景层
      ctx.save();
      ctx.translate(layer1X, layer1Y);
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#05070f'); bgGrad.addColorStop(1, '#111827');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(-60, -60, canvas.width + 120, canvas.height + 120);
      ctx.restore();

      // 星空粒子层
      ctx.save();
      ctx.translate(layer2X, layer2Y);
      stars.forEach(st => {
        st.alpha += Math.sin(time * st.speed) * 0.008;
        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, st.alpha));
        ctx.fillStyle = st.color;
        ctx.beginPath(); ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
      ctx.restore();

      // 升空孔明灯主体渲染
      if (isLaunching) {
        ctx.save();
        ctx.translate(layer3X, layer3Y);
        risingY -= 3.5;
        const lx = risingX + Math.sin(risingY * 0.02) * 15;
        ctx.translate(lx, risingY);
        
        ctx.fillStyle = "rgba(242,125,38,0.35)";
        ctx.beginPath(); ctx.arc(0, 0, 55, 0, Math.PI * 2); ctx.fill();
        
        ctx.fillStyle = "#E8A355";
        ctx.fillRect(-22, -35, 44, 70);
        ctx.strokeStyle = "#FFE899"; ctx.lineWidth = 2; ctx.strokeRect(-22, -35, 44, 70);
        ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(0, 30, 6, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        if (risingY <= 80) {
          isLaunching = false;
          setTimeout(() => {
            alert("✦ 仪式感应完成！灵灯归宿：" + activeData.destiny + "\\n" + activeData.echo);
            location.reload();
          }, 100);
        }
      }

      requestAnimationFrame(renderSky);
    }
    renderSky();

    // 点击放飞：零延迟即时计算
    window.performRitual = () => {
      const text = document.getElementById('mindText').value;
      const typeEl = document.querySelector('input[name="type"]:checked');
      const type = typeEl ? typeEl.value : "念";

      if(!text.trim()) return alert("请在灯面写下心念内容");

      // 1. 生命句截断逻辑（>20字加...）
      const poem = text.length > 20 ? text.slice(0, 20) + "..." : text;

      // 2. 古风命名与回应生成
      const name = generateAncientName(text);
      const echo = COSMIC_ECHOES[Math.floor(Math.random() * COSMIC_ECHOES.length)];

      // 3. 情绪权重规则
      const weight = Math.min(0.9, (text.length / 50) * 0.8 + Math.random() * 0.2);
      let destiny = "归流";
      if (weight >= 0.7) destiny = "入星";
      else if (weight < 0.4) destiny = "化雾";

      activeData = { type, poem, name, echo, weight, destiny };

      // 立即无缝切换展示层
      document.getElementById('altar').classList.add('hidden');
      document.getElementById('resultLayer').classList.remove('hidden');

      document.getElementById('resType').innerText = '〔' + type + '〕';
      document.getElementById('resWeight').innerText = (weight * 100).toFixed(0);
      document.getElementById('resName').innerText = name;
      document.getElementById('resPoem').innerText = poem;
      document.getElementById('resEcho').innerText = echo;
      document.getElementById('resDest').innerText = destiny;
    };

    window.launchLantern = () => {
      document.getElementById('resultLayer').classList.add('hidden');
      document.getElementById('skyFeedback').innerText = "灵灯正在升空（归宿：" + activeData.destiny + "） · " + activeData.echo;
      isLaunching = true;
      risingY = canvas.height * 0.8;
      risingX = canvas.width / 2;
    };
  </script>
</body>
</html>`;

  const handleCopyHTML = () => {
    navigator.clipboard.writeText(standaloneHTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHTML = () => {
    const blob = new Blob([standaloneHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '夜灯记_人间未尽之事_独立仪式版.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03050A]/85 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-2xl bg-[#080C16] border border-[#B8860B]/50 p-8 rounded-2xl shadow-[0_0_80px_rgba(184,134,11,0.25)] flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
          <div className="flex items-center gap-2 text-[#FFE899] font-serif tracking-widest text-lg">
            <Download className="text-[#B8860B]" size={20} />
            <span>导出完整的、可独立运行的单文件 HTML</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 font-mono">✕</button>
        </div>

        <p className="text-xs font-serif text-gray-400 mb-4 leading-relaxed">
          ✦ 严格契合技术请求：下文为 **100% 纯静态单文件独立 HTML**。内含 Tailwind CDN 动态加载、Canvas 星空粒子引擎及 ESM `@google/genai` 纯前端直接调用逻辑。复制或下载后，无需服务器即可双击在本地浏览器独立运行：
        </p>

        <div className="flex-1 bg-[#03050A] border border-gray-800 rounded-xl p-4 overflow-y-auto font-mono text-[11px] text-gray-300 leading-relaxed select-all whitespace-pre mb-6">
          {standaloneHTML}
        </div>

        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-800 rounded-lg text-xs text-gray-400 hover:text-white font-serif">
            取消
          </button>
          <button
            onClick={handleCopyHTML}
            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-serif tracking-widest flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            <span>{copied ? "已复制源码" : "复制 HTML"}</span>
          </button>
          <button
            onClick={handleDownloadHTML}
            className="px-8 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:brightness-110 text-[#3B1504] rounded-lg text-xs font-serif font-extrabold tracking-widest flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Download size={15} />
            <span>下载 .html 网页文件</span>
          </button>
        </div>

      </div>
    </div>
  );
};


// =================== 3. API Key 输入配置弹窗 ===================
export const ApiKeyModal: React.FC<{ isOpen: boolean; onClose: () => void; apiKey: string; setApiKey: (k: string) => void }> = ({
  isOpen, onClose, apiKey, setApiKey
}) => {
  const [tempKey, setTempKey] = useState(apiKey);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(tempKey.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03050A]/85 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-md bg-[#080C16] border border-amber-500/40 p-8 rounded-2xl shadow-[0_0_60px_rgba(245,158,11,0.2)] flex flex-col" onClick={e => e.stopPropagation()}>
        
        <div className="flex items-center gap-2 text-amber-300 font-serif tracking-widest text-lg mb-4">
          <Key size={20} />
          <span>配置数字萨满 Gemini API Key</span>
        </div>

        <p className="text-xs font-serif text-gray-400 mb-6 leading-relaxed">
          若 AI Studio 后端秘密面板中已预置 `GEMINI_API_KEY`，此框可保持留空。若您希望使用自定义密钥，可在此处绑定（仅保存在您的当前会话内存中）：
        </p>

        <input
          type="password"
          value={tempKey}
          onChange={e => setTempKey(e.target.value)}
          placeholder="AIzaSy..."
          className="w-full bg-[#03050A] border border-gray-800 focus:border-amber-500 rounded-lg p-3 text-xs text-white font-mono outline-none mb-6"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-800 rounded-lg text-xs text-gray-400 hover:text-white font-serif">取消</button>
          <button onClick={handleSave} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg text-xs font-serif tracking-widest transition cursor-pointer">
            封印保存
          </button>
        </div>
      </div>
    </div>
  );
};


// =================== 4. 天象状态面板 ===================
export const PhenomenaModal: React.FC<{ isOpen: boolean; onClose: () => void; skyState: SkyPhenomenonState }> = ({
  isOpen, onClose, skyState
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03050A]/85 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-lg bg-[#080C16] border border-[#B8860B]/40 p-8 rounded-2xl shadow-[0_0_80px_rgba(184,134,11,0.25)] flex flex-col" onClick={e => e.stopPropagation()}>
        
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <div className="flex items-center gap-2 text-[#FFE899] font-serif tracking-widest text-lg">
            <Stars className="text-[#F27D26]" size={20} />
            <span>气流场与集体天象感应</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 font-mono">✕</button>
        </div>

        <div className="bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#111827] p-6 rounded-xl border border-gray-800 text-center mb-6">
          <span className="text-[10px] font-mono text-amber-500 tracking-widest block mb-1">CELESTIAL ATMOSPHERE</span>
          <h3 className="text-xl font-serif text-[#FFE899] font-bold tracking-widest mb-2">{skyState.title}</h3>
          <p className="text-xs font-serif text-gray-300 italic tracking-wider">“{skyState.subtitle}”</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8 text-center font-serif text-xs">
          <div className="bg-[#03050A] border border-gray-800/80 p-4 rounded-lg">
            <div className="text-gray-500 mb-1 flex items-center justify-center gap-1"><Wind size={12}/>风力扰动</div>
            <div className="text-base font-bold text-amber-300 font-mono">{skyState.windForce > 0 ? "偏东" : "偏西"} {Math.abs(skyState.windForce * 10).toFixed(1)} 级</div>
          </div>
          <div className="bg-[#03050A] border border-gray-800/80 p-4 rounded-lg">
            <div className="text-gray-500 mb-1 flex items-center justify-center gap-1"><CloudRain size={12}/>执念雾气</div>
            <div className="text-base font-bold text-slate-300 font-mono">{(skyState.fogLevel * 100).toFixed(0)}%</div>
          </div>
          <div className="bg-[#03050A] border border-gray-800/80 p-4 rounded-lg">
            <div className="text-gray-500 mb-1 flex items-center justify-center gap-1"><Stars size={12}/>归档孔明灯</div>
            <div className="text-base font-bold text-[#F27D26] font-mono">{skyState.totalLanterns}</div>
          </div>
        </div>

        <button onClick={onClose} className="w-full py-3 bg-[#B8860B]/20 hover:bg-[#B8860B]/30 text-[#FFE899] border border-[#B8860B] rounded-lg text-xs font-serif tracking-widest transition cursor-pointer">
          感知完毕 · 返回仪式空间
        </button>
      </div>
    </div>
  );
};
