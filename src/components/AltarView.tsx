import React, { useState } from 'react';
import { LanternType, LanternItem } from '../types';
import { Sparkles, Send, RefreshCw, Wind } from 'lucide-react';

interface AltarViewProps {
  onRitualSubmit: (text: string, type: LanternType) => Promise<LanternItem | null>;
  onReleaseSky: (lantern: LanternItem) => void;
  isLoading: boolean;
  activeLantern: LanternItem | null;
  onResetAltar: () => void;
}

export const AltarView: React.FC<AltarViewProps> = ({
  onRitualSubmit,
  onReleaseSky,
  isLoading,
  activeLantern,
  onResetAltar
}) => {
  const [selectedType, setSelectedType] = useState<LanternType>('愿');
  const [inputText, setInputText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const types: { id: LanternType; label: string; desc: string; color: string }[] = [
    { id: '愿', label: '愿', desc: '向未来的期许与祈望', color: '#F27D26' },
    { id: '念', label: '念', desc: '当下涌动的牵挂与心绪', color: '#B8860B' },
    { id: '记', label: '记', desc: '向过去告别的执念与遗憾', color: '#94A3B8' },
  ];

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setErrorMsg('心念未成，字句不可空白。');
      return;
    }
    setErrorMsg('');
    await onRitualSubmit(inputText.trim(), selectedType);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto min-h-[70vh] flex flex-col items-center justify-center px-4 py-8">
      
      {/* 顶部中央仪式光辉背景 */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#F27D26]/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      {/* ================= 仪式第一步：【生】心念生成 ================= */}
      {!activeLantern ? (
        <div className="w-full max-w-xl bg-[#060913]/80 border border-[#B8860B]/30 p-8 sm:p-10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md relative z-20 transition-all duration-700">
          
          <div className="flex items-center justify-between border-b border-[#B8860B]/20 pb-5 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#C43D3D] animate-ping" />
              <h2 className="text-xl font-serif tracking-widest text-[#FFE899]">生 · 心念凝聚</h2>
            </div>
            <span className="text-xs font-mono tracking-widest text-[#B8860B]/70">STEP 01 / 03</span>
          </div>

          {/* 三种状态选择 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {types.map((t) => {
              const isSel = selectedType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`flex flex-col items-center py-4 px-2 border rounded-lg transition-all duration-300 ${
                    isSel 
                      ? 'border-[#C43D3D] bg-[#C43D3D]/15 shadow-[0_0_20px_rgba(196,61,61,0.25)] text-[#FFE899]' 
                      : 'border-gray-800 bg-[#0A0E17]/60 text-gray-400 hover:border-[#B8860B]/50'
                  }`}
                >
                  <span className="text-2xl font-serif font-bold mb-1">{t.label}</span>
                  <span className="text-[10px] tracking-tight opacity-75">{t.desc.slice(0, 6)}</span>
                </button>
              );
            })}
          </div>

          {/* 长文本输入框 */}
          <div className="relative mb-6">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="此处写下你心中的未尽之事、遗憾执念、抑或遥远祝愿... (数字萨满 Gemini 将为您提炼压缩)"
              maxLength={300}
              rows={5}
              className="w-full bg-[#03050A]/70 border border-[#B8860B]/30 rounded-lg p-4 text-gray-200 placeholder-gray-600 font-serif text-sm leading-relaxed focus:outline-none focus:border-[#F27D26] transition-colors resize-none"
            />
            <div className="absolute bottom-3 right-3 text-[11px] font-mono text-gray-600">
              {inputText.length} / 300
            </div>
          </div>

          {errorMsg && (
            <div className="text-xs text-[#C43D3D] font-serif mb-4 text-center tracking-wide">
              ✦ {errorMsg}
            </div>
          )}

          {/* 生成夜灯按钮 (执行【化】) */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-[#8B261D] via-[#C43D3D] to-[#8B261D] text-[#FFE899] font-serif font-bold text-base tracking-[0.25em] rounded-lg shadow-[0_4px_25px_rgba(196,61,61,0.4)] hover:shadow-[0_6px_35px_rgba(196,61,61,0.6)] hover:brightness-110 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer border border-[#FFE899]/30"
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>数字萨满情感压缩中...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} className="text-[#FFE899]" />
                <span>化 · 凝炼存在定义</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* ================= 仪式第二步：【化】情感压缩预览 ================= */
        <div className="w-full max-w-2xl flex flex-col items-center relative z-20 animate-fade-in my-4">
          
          <div className="text-center mb-6">
            <span className="text-xs font-mono tracking-widest text-[#B8860B]">STEP 02 / 03 · 存在定义已封印</span>
            <p className="text-sm font-serif text-gray-400 mt-1 italic">
              宇宙回应：{activeLantern.echo}
            </p>
          </div>

          {/* 发光的巨型夜灯展示卡片 */}
          <div className="relative group p-8 sm:p-12 w-full max-w-md flex flex-col items-center justify-center">
            
            {/* 底部神圣暖光 */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F27D26]/30 via-[#C43D3D]/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

            {/* 灯笼外框倒梯形宣纸容器 */}
            <div className="relative w-64 sm:w-72 min-h-[380px] bg-gradient-to-b from-[#E8A355] via-[#D4883A] to-[#A04512] p-6 rounded-t-3xl rounded-b-xl shadow-[0_0_80px_rgba(242,125,38,0.5)] border-2 border-[#FFE899]/60 flex flex-col items-center justify-between text-[#4A1D08] overflow-hidden">
              
              {/* 渲染专属东方意境氛围图 Data */}
              {(activeLantern.image || activeLantern.imageUrl) && (
                <img 
                  src={activeLantern.image || activeLantern.imageUrl} 
                  alt="氛围图" 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply pointer-events-none" 
                  referrerPolicy="no-referrer"
                />
              )}

              {/* 顶部提梁木纹边框 */}
              <div className="relative z-10 w-full border-b border-[#4A1D08]/30 pb-3 flex justify-between items-center text-[11px] font-mono opacity-80">
                <span>〔{activeLantern.type}〕</span>
                <span>浓度 {(activeLantern.weight * 100).toFixed(0)}%</span>
                <span>归宿：{activeLantern.destiny}</span>
              </div>

              {/* 中央竖排书法灯名与生命句 */}
              <div className="relative z-10 flex flex-row-reverse justify-center items-center gap-8 sm:gap-12 my-auto py-8">
                
                {/* 灯名 (3-5字) */}
                <h3 
                  className="text-3xl sm:text-4xl font-serif font-extrabold tracking-[0.3em] text-[#3B1504] drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  {activeLantern.name}
                </h3>

                {/* 细线分隔 */}
                <div className="w-px h-48 bg-[#4A1D08]/30" />

                {/* 生命句 (20字内) */}
                <p 
                  className="text-base sm:text-lg font-serif font-medium tracking-[0.2em] leading-loose text-[#522008]"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  {activeLantern.poem}
                </p>
              </div>

              {/* 底部火光底座 */}
              <div className="relative z-10 w-full pt-4 border-t border-[#4A1D08]/20 flex items-center justify-between">
                <div className="w-6 h-6 rounded-sm bg-[#C43D3D] text-[#FFE899] flex items-center justify-center font-bold text-xs font-serif shadow-inner">
                  记
                </div>
                <div className="w-12 h-3 bg-[#FFF5CC] rounded-full shadow-[0_0_20px_#FFFF00] animate-pulse" />
                <span className="text-[10px] font-mono tracking-tighter opacity-60">夜灯记归档</span>
              </div>
            </div>

          </div>

          {/* 仪式操作按钮组 */}
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md mt-6">
            <button
              onClick={onResetAltar}
              className="flex-1 py-3.5 px-6 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200 font-serif text-sm tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer bg-[#060913]/80"
            >
              <RefreshCw size={16} />
              <span>重写心念</span>
            </button>

            <button
              onClick={() => onReleaseSky(activeLantern)}
              className="flex-[2] py-4 px-8 bg-gradient-to-r from-[#D4AF37] via-[#FFE899] to-[#D4AF37] text-[#3B1504] font-serif font-extrabold text-lg tracking-[0.3em] rounded-lg shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:shadow-[0_0_50px_rgba(212,175,55,0.9)] hover:scale-105 active:scale-100 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
            >
              <Send size={20} className="text-[#3B1504]" />
              <span>归 · 放飞入星空</span>
            </button>
          </div>

        </div>
      )}

      {/* 东方哲思诗句点缀 */}
      <div className="mt-12 text-center max-w-lg px-6 pointer-events-none opacity-40 hidden sm:block">
        <p className="text-xs tracking-[0.3em] font-serif text-[#B8860B] leading-relaxed">
          「 孔明灯乃人之痕迹，夜空乃宇宙记忆体。升空过程，即生命从可见转化为不可见之仪式。 」
        </p>
      </div>

    </div>
  );
};
