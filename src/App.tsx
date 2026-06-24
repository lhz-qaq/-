import React, { useState, useEffect } from 'react';
import { ActiveTab, LanternItem, LanternType, SkyPhenomenonState } from './types';
import { toggleAmbientSound } from './utils/audio';
import { createLocalLantern } from './utils/generator';
import { SkyCanvas } from './components/SkyCanvas';
import { SideRails } from './components/SideRails';
import { AltarView } from './components/AltarView';
import { SkyView } from './components/SkyView';
import { StoriesView } from './components/StoriesView';
import { PromptModal, ExportModal, ApiKeyModal, PhenomenaModal } from './components/Modals';
import { Sparkles, Wind, Disc, Compass } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('release');
  const [lanterns, setLanterns] = useState<LanternItem[]>([]);
  const [totalLanternsCount, setTotalLanternsCount] = useState<number>(4231);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeLantern, setActiveLantern] = useState<LanternItem | null>(null);
  const [risingLantern, setRisingLantern] = useState<LanternItem | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>('');

  // 弹窗控制
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isPhenomenaModalOpen, setIsPhenomenaModalOpen] = useState(false);

  // 天象动态感知状态
  const [skyState, setSkyState] = useState<SkyPhenomenonState>({
    title: "清辉微澜 · 思念缓释",
    subtitle: "今夜风动，人间思念过重。长风送去片刻人间清凉。",
    windForce: 0.35,
    fogLevel: 0.25,
    starBrightness: 1.1,
    totalLanterns: 4231
  });

  // 获取初始归档列表
  useEffect(() => {
    fetch('/api/lanterns')
      .then(res => res.json())
      .then(data => {
        if (data && data.lanterns) {
          setLanterns(data.lanterns);
          setTotalLanternsCount(data.total || data.lanterns.length + 4225);
          setSkyState(prev => ({ ...prev, totalLanterns: data.total }));
        }
      })
      .catch(err => console.error("Fetch lanterns error:", err));
  }, []);

  // 音频切换控制
  const handleToggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    toggleAmbientSound(newState);
  };

  // 发起核心仪式请求：纯前端即时响应零延迟
  const handleRitualSubmit = async (text: string, type: LanternType): Promise<LanternItem | null> => {
    const data = createLocalLantern(text, type);
    setActiveLantern(data);
    setIsLoading(false);

    // 异步静默记录（不阻塞前端展示）
    fetch('/api/ritual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, type, name: data.name, poem: data.poem, weight: data.weight })
    }).catch(() => {});

    // 根据情绪浓度动态改变天象
    if (data.weight >= 0.7) {
      setSkyState(prev => ({
        ...prev,
        title: "长风浩荡 · 星海沸腾",
        subtitle: `有人刚封印了沉重的执念（浓度${(data.weight * 100).toFixed(0)}%）。夜幕星光璀璨，长风呼啸。`,
        windForce: 0.85,
        starBrightness: 1.4
      }));
    } else if (data.weight < 0.4) {
      setSkyState(prev => ({
        ...prev,
        title: "雾凝轻岚 · 云淡风轻",
        subtitle: "人间执念如烟化雾，天地间弥漫着温柔的释怀。",
        windForce: 0.1,
        fogLevel: 0.65
      }));
    }

    return data;
  };

  // 放飞孔明灯入天空
  const handleReleaseSky = (lantern: LanternItem) => {
    setRisingLantern(lantern);
    setLanterns(prev => [lantern, ...prev]);
    setTotalLanternsCount(prev => prev + 1);
    setSkyState(prev => ({ ...prev, totalLanterns: prev.totalLanterns + 1 }));
    setActiveLantern(null);
  };

  // 升空粒子特效完成回调
  const handleRisingComplete = () => {
    setRisingLantern(null);
  };

  // 点赞/共情灵灯
  const handleResonate = async (id: string) => {
    try {
      const res = await fetch(`/api/lanterns/${id}/resonate`, { method: 'POST' });
      if (res.ok) {
        setLanterns(prev => prev.map(l => l.id === id ? { ...l, resonanceCount: l.resonanceCount + 1 } : l));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050508] text-[#E5E7EB] font-serif overflow-x-hidden flex flex-col justify-between selection:bg-[#C43D3D] selection:text-[#FFE899]">
      
      {/* 核心粒子与星空 Canvas 引擎 */}
      <SkyCanvas
        risingLantern={risingLantern}
        onRisingComplete={handleRisingComplete}
        backgroundLanterns={lanterns.slice(0, 15)}
        windForce={skyState.windForce}
      />

      {/* 两侧悬浮竖排极简书法导航与操作栏 */}
      <SideRails
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
      />

      {/* ================= 顶栏头部 (Editorial Header) ================= */}
      <header className="relative z-20 w-full max-w-7xl mx-auto pt-10 px-8 sm:px-16 flex justify-between items-start pointer-events-auto">
        <div className="flex gap-4 items-start cursor-pointer" onClick={() => setActiveTab('release')}>
          <div className="flex flex-col gap-1.5">
            <h1 
              className="text-3xl sm:text-4xl font-extrabold tracking-[0.45em] text-[#C43D3D] uppercase select-none drop-shadow-[0_0_12px_rgba(196,61,61,0.5)]" 
              style={{ writingMode: 'vertical-rl' }}
            >
              夜灯记
            </h1>
            <span className="w-2 h-2 rounded-full bg-[#B8860B] mx-auto mt-2 animate-pulse" />
          </div>

          <div className="flex flex-col justify-end pt-2">
            <p 
              className="text-xs sm:text-sm font-serif tracking-[0.25em] text-gray-400 opacity-80 select-none border-l border-[#B8860B]/40 pl-2 pt-1" 
              style={{ writingMode: 'vertical-rl' }}
            >
              人间未尽之事
            </p>
          </div>
        </div>

        {/* 右上角期号与世界观标语 */}
        <div className="flex flex-col gap-2 items-end text-right">
          <div className="flex items-center gap-2 text-xs tracking-widest text-[#B8860B] font-mono opacity-80">
            <Disc size={13} className={!isMuted ? "animate-spin text-[#C43D3D]" : "text-gray-600"} />
            <span>VOL. 01 / 宇宙存在仪式空间</span>
          </div>
          <span className="text-[10px] font-mono tracking-tighter text-gray-500 uppercase">
            EST. 2026 DIGITAL SHAMAN · 生 · 化 · 归
          </span>
          <button
            onClick={() => setIsPhenomenaModalOpen(true)}
            className="mt-2 text-xs font-serif px-3 py-1 bg-[#0B0F1A]/80 border border-[#B8860B]/40 rounded-full text-[#FFE899] hover:border-[#C43D3D] transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Compass size={12} className="text-[#F27D26]" />
            <span>天象状态</span>
          </button>
        </div>
      </header>

      {/* ================= 中央核心容器 ================= */}
      <main className="relative z-20 flex-1 w-full flex items-center justify-center pointer-events-auto">
        {activeTab === 'release' && (
          <AltarView
            onRitualSubmit={handleRitualSubmit}
            onReleaseSky={handleReleaseSky}
            isLoading={isLoading}
            activeLantern={activeLantern}
            onResetAltar={() => setActiveLantern(null)}
          />
        )}

        {activeTab === 'sky' && (
          <SkyView
            lanterns={lanterns}
            onResonate={handleResonate}
            totalCount={totalLanternsCount}
          />
        )}

        {activeTab === 'stories' && (
          <StoriesView
            lanterns={lanterns}
            onSelectLantern={(l) => {
              setActiveTab('sky');
            }}
          />
        )}

        {activeTab === 'phenomena' && (
          <div className="w-full max-w-3xl px-6 py-12 text-center animate-fade-in">
            <h2 className="text-3xl font-serif text-[#FFE899] tracking-[0.3em] mb-4">东方气流场与集体情绪感应</h2>
            <div className="w-16 h-px bg-[#C43D3D] mx-auto mb-8" />
            
            <div className="bg-[#080C16]/90 border border-[#B8860B]/40 p-10 rounded-2xl shadow-2xl relative overflow-hidden text-left mb-8">
              <div className="absolute -right-10 -bottom-10 text-8xl font-black text-white/[0.02] pointer-events-none">气</div>
              <span className="text-xs font-mono text-[#F27D26] tracking-widest block mb-2">✦ 天象实录</span>
              <h3 className="text-2xl font-bold text-gray-100 tracking-wider mb-4">{skyState.title}</h3>
              <p className="text-base text-gray-300 leading-relaxed tracking-wide italic mb-6">
                “ {skyState.subtitle} ”
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-gray-800 pt-6 font-mono text-xs text-gray-400">
                <div>
                  <span className="block text-gray-500 mb-1">当前风力</span>
                  <span className="text-amber-400 font-bold">{skyState.windForce > 0 ? "东风" : "西风"} {(Math.abs(skyState.windForce) * 10).toFixed(1)} 级</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">执念雾气率</span>
                  <span className="text-slate-300 font-bold">{(skyState.fogLevel * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">星空记忆光度</span>
                  <span className="text-amber-300 font-bold">{(skyState.starBrightness * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">累计归档灵灯</span>
                  <span className="text-[#C43D3D] font-bold">{totalLanternsCount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('release')}
              className="px-8 py-3.5 bg-[#C43D3D] hover:bg-[#A03030] text-[#FFE899] font-bold rounded-lg tracking-[0.25em] shadow-lg transition-all cursor-pointer"
            >
              放飞一盏数字孔明灯
            </button>
          </div>
        )}
      </main>

      {/* ================= 天幕状态底部栏 (Celestial Feedback Footer) ================= */}
      <footer className="relative z-20 w-full bg-gradient-to-t from-[#03050A] via-[#050508]/90 to-transparent border-t border-[#B8860B]/20 py-4 px-8 sm:px-16 pointer-events-auto mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* 左侧动态天象文案 */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setIsPhenomenaModalOpen(true)}>
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C43D3D] animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#C43D3D] relative" />
            </div>
            <p className="text-xs sm:text-sm font-serif text-gray-300 group-hover:text-[#FFE899] transition-colors tracking-[0.15em] italic">
              天象反馈：<span className="text-[#B8860B] font-medium">“{skyState.subtitle}”</span>
            </p>
          </div>

          {/* 中央核心标语注释 */}
          <div className="text-center text-xs font-serif tracking-[0.3em] text-[#FFE899]/80 italic drop-shadow-[0_0_8px_rgba(255,232,153,0.3)] my-1">
            心念由你，天幕自有回响
          </div>

          {/* 右侧循环哲学印记 */}
          <div className="flex items-center gap-6 text-xs font-mono text-gray-500 tracking-widest">
            <span className="hover:text-gray-300 cursor-pointer" onClick={() => setIsPromptModalOpen(true)}>✦ 测试 Prompt</span>
            <span className="hover:text-gray-300 cursor-pointer" onClick={() => setIsExportModalOpen(true)}>✦ 单文件网页</span>
            <span className="text-[#C43D3D]/80">〔 生 · 化 · 归 〕</span>
          </div>

        </div>
      </footer>

      {/* ================= 各类功能模态弹窗 ================= */}
      <PromptModal isOpen={isPromptModalOpen} onClose={() => setIsPromptModalOpen(false)} />
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
      <ApiKeyModal isOpen={isKeyModalOpen} onClose={() => setIsKeyModalOpen(false)} apiKey={apiKey} setApiKey={setApiKey} />
      <PhenomenaModal isOpen={isPhenomenaModalOpen} onClose={() => setIsPhenomenaModalOpen(false)} skyState={skyState} />

    </div>
  );
}
