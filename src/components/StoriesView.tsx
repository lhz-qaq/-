import React from 'react';
import { LanternItem } from '../types';
import { BookOpen, Sparkles, Wind, ArrowRight } from 'lucide-react';

interface StoriesViewProps {
  lanterns: LanternItem[];
  onSelectLantern: (lantern: LanternItem) => void;
}

export const StoriesView: React.FC<StoriesViewProps> = ({ lanterns, onSelectLantern }) => {
  const topResonated = [...lanterns].sort((a, b) => b.resonanceCount - a.resonanceCount).slice(0, 6);

  return (
    <div className="relative w-full max-w-5xl mx-auto min-h-[70vh] px-4 py-8 flex flex-col justify-center">
      
      <div className="text-center max-w-lg mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#B8860B]/30 bg-[#B8860B]/10 text-[#FFE899] text-xs font-serif tracking-widest mb-4">
          <BookOpen size={14} />
          <span>人间未尽故事篇章</span>
        </div>
        <h2 className="text-3xl font-serif tracking-[0.3em] text-[#FFE899]">愿山河无恙，人间皆安</h2>
        <p className="text-xs font-serif text-gray-400 mt-2 tracking-widest leading-relaxed">
          这里收录了气流场中最具共鸣的情绪压缩体。每一句生命句背后，都曾有一位旅人在深夜凝望星空。
        </p>
      </div>

      {/* 故事主打横向回廊布局 (Editorial Horizontal Story Showcase) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-auto">
        {topResonated.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => onSelectLantern(item)}
            className="group relative bg-[#060913]/90 border border-gray-800 hover:border-[#C43D3D]/60 rounded-xl p-6 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(196,61,61,0.15)] flex gap-6 items-center cursor-pointer overflow-hidden"
          >
            {/* 左侧微缩倒梯形孔明灯 */}
            <div className="relative w-20 h-28 shrink-0 bg-gradient-to-b from-[#FFE899] via-[#E8A355] to-[#993D11] rounded-t-xl rounded-b-md p-2 shadow-md flex flex-col items-center justify-center text-[#3B1504]">
              <span className="text-[9px] font-mono mb-1">〔{item.type}〕</span>
              <h4 
                className="text-sm font-serif font-bold tracking-widest"
                style={{ writingMode: 'vertical-rl' }}
              >
                {item.name}
              </h4>
            </div>

            {/* 右侧文本叙事 */}
            <div className="flex-1 min-w-0 font-serif">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#B8860B] mb-1">
                <span>VOL. 0{idx + 1} / {item.destiny}</span>
                <span>共鸣 {item.resonanceCount}</span>
              </div>

              <h3 className="text-base font-bold text-gray-100 group-hover:text-[#FFE899] transition-colors tracking-wide mb-2 line-clamp-1">
                「 {item.poem} 」
              </h3>

              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 italic opacity-90">
                “{item.originalText}”
              </p>

              <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-[#F27D26]">
                <span>回应：{item.echo.slice(0, 14)}...</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 右上角水印角标 */}
            <div className="absolute -right-4 -top-4 text-6xl font-serif font-black text-white/[0.02] pointer-events-none">
              {item.type}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
