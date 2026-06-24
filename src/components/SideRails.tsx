import React from 'react';
import { ActiveTab } from '../types';
import { Volume2, VolumeX, Key, Download, Sparkles } from 'lucide-react';

interface SideRailsProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenKeyModal: () => void;
  onOpenExportModal: () => void;
  onOpenPromptModal: () => void;
}

export const SideRails: React.FC<SideRailsProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  onToggleMute,
  onOpenKeyModal,
  onOpenExportModal,
  onOpenPromptModal
}) => {
  const navItems: { id: ActiveTab; label: string; num: string }[] = [
    { id: 'release', label: '放灯', num: '壹' },
    { id: 'sky', label: '夜空', num: '贰' },
    { id: 'stories', label: '往事', num: '叁' },
    { id: 'phenomena', label: '天象', num: '肆' },
  ];

  return (
    <>
      {/* 左侧极简书法竖排导航栏 */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col gap-6 items-center pointer-events-auto">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#B8860B]/40 to-transparent mb-2" />
        
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center gap-1.5 group focus:outline-none"
            >
              <span className={`text-[10px] font-mono tracking-tighter transition-colors ${
                isActive ? 'text-[#C43D3D]' : 'text-gray-600 group-hover:text-[#B8860B]'
              }`}>
                {item.num}
              </span>
              <span 
                className={`text-base font-serif py-3 px-1.5 border transition-all duration-500 rounded-sm ${
                  isActive 
                    ? 'border-[#C43D3D] text-[#FFE899] bg-[#C43D3D]/20 shadow-[0_0_15px_rgba(196,61,61,0.3)]' 
                    : 'border-gray-800/80 text-gray-400 hover:border-[#B8860B]/60 hover:text-gray-200 bg-[#060913]/60 backdrop-blur-sm'
                }`}
                style={{ writingMode: 'vertical-rl' }}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#B8860B]/40 to-transparent mt-2" />
      </div>

      {/* 右侧极简仪式操作栏 */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-5 items-center pointer-events-auto">
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-[#B8860B]/40 to-transparent" />

        {/* 音疗静音开关 */}
        <button
          onClick={onToggleMute}
          title={isMuted ? "开启萨满音场" : "静音"}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`p-2.5 rounded-full border transition-all duration-300 ${
            !isMuted 
              ? 'border-[#B8860B] text-[#FFE899] bg-[#B8860B]/15 shadow-[0_0_12px_rgba(184,134,11,0.4)]' 
              : 'border-gray-800 text-gray-500 hover:border-gray-600 bg-[#060913]/60'
          }`}>
            {!isMuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </div>
          <span className="text-[10px] font-serif text-gray-500 group-hover:text-[#B8860B]" style={{ writingMode: 'vertical-rl' }}>
            {!isMuted ? "音起" : "寂静"}
          </span>
        </button>

        {/* 测试 Prompt 复制 */}
        <button
          onClick={onOpenPromptModal}
          title="查看独立测试 Prompt"
          className="flex flex-col items-center gap-1 group mt-2"
        >
          <div className="p-2.5 rounded-full border border-gray-800 text-gray-400 hover:border-[#C43D3D] hover:text-[#C43D3D] bg-[#060913]/60 transition-all">
            <Sparkles size={16} />
          </div>
          <span className="text-[10px] font-serif text-gray-500 group-hover:text-[#C43D3D]" style={{ writingMode: 'vertical-rl' }}>
            测试指令
          </span>
        </button>

        {/* 单文件 HTML 下载/复制 */}
        <button
          onClick={onOpenExportModal}
          title="导出单文件独立网页"
          className="flex flex-col items-center gap-1 group mt-2"
        >
          <div className="p-2.5 rounded-full border border-gray-800 text-gray-400 hover:border-[#B8860B] hover:text-[#B8860B] bg-[#060913]/60 transition-all">
            <Download size={16} />
          </div>
          <span className="text-[10px] font-serif text-gray-500 group-hover:text-[#B8860B]" style={{ writingMode: 'vertical-rl' }}>
            独立网页
          </span>
        </button>

        {/* API Key 设定 */}
        <button
          onClick={onOpenKeyModal}
          title="配置 Gemini 密钥"
          className="flex flex-col items-center gap-1 group mt-2"
        >
          <div className="p-2.5 rounded-full border border-gray-800 text-gray-400 hover:border-amber-400 hover:text-amber-400 bg-[#060913]/60 transition-all">
            <Key size={16} />
          </div>
          <span className="text-[10px] font-serif text-gray-500 group-hover:text-amber-400" style={{ writingMode: 'vertical-rl' }}>
            密钥
          </span>
        </button>

        <div className="w-px h-10 bg-gradient-to-b from-transparent via-[#B8860B]/40 to-transparent" />
      </div>

      {/* 移动端底部横向简易导航 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-[#060913]/90 backdrop-blur-md border-t border-[#B8860B]/20 py-3 px-6 flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`text-sm font-serif px-3 py-1 border rounded-sm ${
              activeTab === item.id 
                ? 'border-[#C43D3D] text-[#FFE899] bg-[#C43D3D]/20' 
                : 'border-transparent text-gray-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
};
