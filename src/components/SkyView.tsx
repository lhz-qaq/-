import React, { useState } from 'react';
import { LanternItem } from '../types';
import { Sparkles, Heart, Search, Filter, Compass } from 'lucide-react';

interface SkyViewProps {
  lanterns: LanternItem[];
  onResonate: (id: string) => Promise<void>;
  totalCount: number;
}

export const SkyView: React.FC<SkyViewProps> = ({ lanterns, onResonate, totalCount }) => {
  const [filterType, setFilterType] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetail, setActiveDetail] = useState<LanternItem | null>(null);
  const [resonatingId, setResonatingId] = useState<string | null>(null);

  const filteredLanterns = lanterns.filter(l => {
    if (filterType !== '全部' && l.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return l.name.toLowerCase().includes(q) || l.poem.toLowerCase().includes(q) || l.originalText.toLowerCase().includes(q);
    }
    return true;
  });

  const handleResonateClick = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (resonatingId) return;
    setResonatingId(id);
    await onResonate(id);
    setResonatingId(null);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto min-h-[75vh] flex flex-col pt-6 px-4 pb-20">
      
      {/* 顶部标题与数据流统计 */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-[#B8860B]/20 pb-6 mb-8 gap-4 z-20">
        <div>
          <h2 className="text-2xl font-serif tracking-[0.25em] text-[#FFE899] flex items-center gap-3">
            <Compass className="text-[#C43D3D] animate-spin-slow" size={24} />
            <span>宇宙记忆体 · 人间执念星海</span>
          </h2>
          <p className="text-xs font-serif text-gray-400 mt-1.5 tracking-wider">
            今日已有 <span className="text-[#F27D26] font-mono font-bold text-sm">{totalCount.toLocaleString()}</span> 盏心念归档升空。点击任意灵灯，倾听来自平行时空的未尽之事。
          </p>
        </div>

        {/* 筛选与搜索 */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索灯名或执念..."
              className="w-full bg-[#03050A]/80 border border-gray-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#B8860B]"
            />
          </div>

          <div className="flex bg-[#060913]/90 border border-gray-800 rounded-full p-1 text-xs">
            {['全部', '愿', '念', '记'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-full transition-all ${
                  filterType === t 
                    ? 'bg-[#C43D3D] text-[#FFE899] font-serif shadow' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 星海灵灯网格 ================= */}
      {filteredLanterns.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-auto py-20 text-gray-500 font-serif">
          <Sparkles size={36} className="opacity-20 mb-4 animate-pulse" />
          <p className="tracking-widest">气流场中暂无契合此印记的孔明灯</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 z-20 my-auto py-4">
          {filteredLanterns.map((item, idx) => {
            const isStar = item.destiny === '入星';
            const isFlow = item.destiny === '归流';
            
            return (
              <div
                key={item.id}
                onClick={() => setActiveDetail(item)}
                className="group relative flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-500 hover:-translate-y-2"
              >
                {/* 悬浮光晕 */}
                <div className={`absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-60 transition-opacity pointer-events-none ${
                  isStar ? 'bg-amber-400' : isFlow ? 'bg-[#F27D26]' : 'bg-slate-400'
                }`} />

                {/* 孔明灯小剪影 */}
                <div className={`relative w-24 h-32 p-3 rounded-t-2xl rounded-b-lg border shadow-lg flex flex-col items-center justify-between transition-all ${
                  isStar 
                    ? 'bg-gradient-to-b from-[#FFE899] via-[#E8A355] to-[#B85D19] border-amber-300 shadow-[0_0_20px_rgba(255,215,0,0.3)]' 
                    : isFlow
                    ? 'bg-gradient-to-b from-[#F5AA50] via-[#D4883A] to-[#8B3A10] border-amber-500/60 shadow-[0_0_15px_rgba(242,125,38,0.2)]'
                    : 'bg-gradient-to-b from-[#CBD5E1] via-[#94A3B8] to-[#475569] border-slate-400/50 opacity-80'
                }`}>
                  <span className="text-[10px] font-mono text-[#3B1504] font-bold">[{item.type}]</span>
                  
                  {/* 书法灯名 */}
                  <h4 
                    className="text-lg font-serif font-bold tracking-widest text-[#2A0F02]"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    {item.name}
                  </h4>

                  {/* 底部小火芯 */}
                  <div className="w-4 h-1.5 bg-[#FFFFFF] rounded-full shadow-[0_0_8px_#FFFF00]" />
                </div>

                {/* 下方悬浮信息提示 */}
                <div className="mt-3 text-center">
                  <p className="text-xs font-serif text-gray-300 group-hover:text-[#FFE899] transition-colors tracking-wider line-clamp-1">
                    「 {item.poem} 」
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-1 text-[11px] font-mono text-gray-500">
                    <span>{item.createdAt.slice(5)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[#C43D3D]">
                      <Heart size={10} className="fill-[#C43D3D]" />
                      {item.resonanceCount}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ================= 详情共鸣弹窗 (Ritual Detail Modal) ================= */}
      {activeDetail && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03050A]/85 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveDetail(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-[#080C16] border border-[#B8860B]/40 p-8 sm:p-10 rounded-2xl shadow-[0_0_80px_rgba(184,134,11,0.25)] flex flex-col sm:flex-row gap-8 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 左侧实体灯笼侧影 */}
            <div className="w-36 h-52 bg-gradient-to-b from-[#FFE899] via-[#E8A355] to-[#8B3A10] rounded-t-3xl rounded-b-xl border-2 border-amber-300 p-4 shadow-[0_0_35px_rgba(255,200,80,0.4)] flex flex-col items-center justify-center text-[#3B1504]">
              <span className="text-xs font-mono mb-2">〔{activeDetail.type}〕</span>
              <h3 
                className="text-2xl font-serif font-extrabold tracking-widest my-auto"
                style={{ writingMode: 'vertical-rl' }}
              >
                {activeDetail.name}
              </h3>
              <div className="w-8 h-2 bg-white rounded-full shadow-[0_0_15px_#FFFF00] mt-2" />
            </div>

            {/* 右侧仪式解读文献 */}
            <div className="flex-1 font-serif text-gray-200">
              <div className="flex items-center justify-between text-xs font-mono text-[#B8860B] mb-3">
                <span>归宿：{activeDetail.destiny} ({activeDetail.destiny === '入星' ? '永久闪烁' : activeDetail.destiny === '归流' ? '记忆光河' : '雾化释怀'})</span>
                <span>浓度 {(activeDetail.weight * 100).toFixed(0)}%</span>
              </div>

              <h4 className="text-lg font-bold text-[#FFE899] tracking-wider mb-3">
                「 {activeDetail.poem} 」
              </h4>

              <div className="bg-[#03050A]/70 border border-gray-800/80 p-4 rounded-lg mb-4 text-xs text-gray-400 leading-relaxed italic">
                原始心念：“{activeDetail.originalText}”
              </div>

              <div className="text-xs text-[#F27D26] tracking-wide mb-6">
                ✦ 宇宙回应：{activeDetail.echo}
              </div>

              {/* 操作栏 */}
              <div className="flex items-center justify-between border-t border-gray-800/80 pt-5">
                <span className="text-xs text-gray-500 font-mono">归档于 {activeDetail.createdAt}</span>

                <button
                  onClick={(e) => handleResonateClick(activeDetail.id, e)}
                  disabled={resonatingId === activeDetail.id}
                  className="px-5 py-2.5 bg-[#C43D3D]/20 hover:bg-[#C43D3D]/40 text-[#FFE899] border border-[#C43D3D] rounded-full text-xs font-serif tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(196,61,61,0.3)]"
                >
                  <Heart size={14} className="fill-[#C43D3D] text-[#C43D3D] animate-ping" />
                  <span>与此信念共鸣 ({activeDetail.resonanceCount})</span>
                </button>
              </div>

            </div>

            {/* 关闭叉叉 */}
            <button
              onClick={() => setActiveDetail(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 font-mono text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
