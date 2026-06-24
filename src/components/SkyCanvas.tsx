import React, { useEffect, useRef } from 'react';
import { LanternItem } from '../types';

interface SkyCanvasProps {
  risingLantern: LanternItem | null;
  onRisingComplete: () => void;
  backgroundLanterns: LanternItem[];
  windForce: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'spark' | 'star' | 'flow' | 'mist';
  twinkleSpeed?: number;
}

export const SkyCanvas: React.FC<SkyCanvasProps> = ({
  risingLantern,
  onRisingComplete,
  backgroundLanterns,
  windForce
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeAnimationRef = useRef<{
    lantern: LanternItem;
    x: number;
    y: number;
    targetY: number;
    phase: 'rising' | 'exploding' | 'done';
    timer: number;
  } | null>(null);

  const particlesRef = useRef<Particle[]>([]);
  const permanentStarsRef = useRef<{ x: number; y: number; size: number; alpha: number; speed: number; color: string }[]>([]);
  const windLinesRef = useRef<{ x: number; y: number; length: number; speed: number; alpha: number }[]>([]);
  const loadedAtmosphereImgRef = useRef<HTMLImageElement | null>(null);

  // 辅助：生成默认意境氛围图 Data URL
  const getAtmosphereUrl = (l: LanternItem): string => {
    if (l.image || l.imageUrl) return l.image || l.imageUrl || '';
    const c1 = l.type === '愿' ? '%23c43d3d' : l.type === '念' ? '%23d4af37' : '%2364748b';
    const c2 = l.type === '愿' ? '%238b261d' : l.type === '念' ? '%23785a08' : '%23334155';
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="360" viewBox="0 0 200 360"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%2305070e"/><stop offset="0.5" stop-color="${c1}" stop-opacity="0.85"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="200" height="360" fill="url(%23g)"/><circle cx="100" cy="130" r="55" fill="%23ffe899" opacity="0.25"/><path d="M0 360 L0 250 Q60 180 120 270 T200 210 L200 360 Z" fill="%23000000" opacity="0.5"/><path d="M0 360 L0 290 Q80 240 150 310 L200 270 L200 360 Z" fill="%23000000" opacity="0.75"/></svg>`;
  };

  // === 视差系统开始 ===
  const targetNormXRef = useRef(0);
  const targetNormYRef = useRef(0);
  const currNormXRef = useRef(0);
  const currNormYRef = useRef(0);
  const isTouchRef = useRef(false);

  useEffect(() => {
    isTouchRef.current = window.matchMedia('(hover: none), (pointer: coarse)').matches || 'ontouchstart' in window;
    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchRef.current) return;
      targetNormXRef.current = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
      targetNormYRef.current = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  // === 视差系统结束 ===

  // 初始化星空背景与风场线条
  useEffect(() => {
    if (permanentStarsRef.current.length === 0) {
      const stars = [];
      const count = window.innerWidth < 768 ? 80 : 180;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * (window.innerHeight * 0.85),
          size: Math.random() * 1.8 + 0.4,
          alpha: Math.random() * 0.7 + 0.2,
          speed: Math.random() * 0.03 + 0.01,
          color: Math.random() > 0.8 ? '#F7E6C1' : '#E2E8F0'
        });
      }
      permanentStarsRef.current = stars;
    }

    if (windLinesRef.current.length === 0) {
      const lines = [];
      const lCount = window.innerWidth < 768 ? 18 : 42;
      for (let i = 0; i < lCount; i++) {
        lines.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          length: Math.random() * 140 + 50,
          speed: Math.random() * 1.8 + 0.6,
          alpha: Math.random() * 0.2 + 0.03
        });
      }
      windLinesRef.current = lines;
    }
  }, []);

  // 当触发新放灯动画
  useEffect(() => {
    if (risingLantern && canvasRef.current) {
      const w = canvasRef.current.width;
      const h = canvasRef.current.height;

      // 解析 LanternItem 中的图片数据并加载
      const imgUrl = getAtmosphereUrl(risingLantern);
      if (imgUrl) {
        const img = new Image();
        img.src = imgUrl;
        img.onload = () => {
          loadedAtmosphereImgRef.current = img;
        };
        if (img.complete) {
          loadedAtmosphereImgRef.current = img;
        } else {
          loadedAtmosphereImgRef.current = null;
        }
      } else {
        loadedAtmosphereImgRef.current = null;
      }

      activeAnimationRef.current = {
        lantern: risingLantern,
        x: w / 2,
        y: h * 0.78,
        targetY: h * 0.22,
        phase: 'rising',
        timer: 0
      };
    } else {
      loadedAtmosphereImgRef.current = null;
    }
  }, [risingLantern]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // 辅助：画一盏微小的背景静态远景灯（附带动态描边）
    const drawBgLantern = (x: number, y: number, scale: number, alpha: number, name: string) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);

      // 光晕
      const gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, 28 * scale);
      gradient.addColorStop(0, 'rgba(255, 180, 80, 0.45)');
      gradient.addColorStop(1, 'rgba(255, 140, 40, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, 28 * scale, 0, Math.PI * 2);
      ctx.fill();

      // 灯体轮廓路径
      ctx.beginPath();
      ctx.moveTo(-10 * scale, -14 * scale);
      ctx.quadraticCurveTo(0, -18 * scale, 10 * scale, -14 * scale);
      ctx.lineTo(8 * scale, 12 * scale);
      ctx.quadraticCurveTo(0, 15 * scale, -8 * scale, 12 * scale);
      ctx.closePath();
      
      ctx.fillStyle = '#D4883A';
      ctx.fill();

      // 动态描边效果
      ctx.strokeStyle = 'rgba(255, 232, 153, 0.55)';
      ctx.lineWidth = 1 * scale;
      ctx.stroke();

      // 内火焰
      ctx.fillStyle = '#FFF5CC';
      ctx.beginPath();
      ctx.arc(0, 8 * scale, 3 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // === 视差系统开始 ===
      // 当鼠标静止时，背景有极缓慢的“呼吸漂移”（模拟宇宙膨胀）
      const breathX = Math.sin(time * 0.007) * 0.06;
      const breathY = Math.cos(time * 0.005) * 0.06;

      const finalTargetX = isTouchRef.current ? 0 : Math.max(-1, Math.min(1, targetNormXRef.current + breathX));
      const finalTargetY = isTouchRef.current ? 0 : Math.max(-1, Math.min(1, targetNormYRef.current + breathY));

      // Lerp 线性插值缓动
      currNormXRef.current += (finalTargetX - currNormXRef.current) * 0.045;
      currNormYRef.current += (finalTargetY - currNormYRef.current) * 0.045;

      const cx = currNormXRef.current;
      const cy = currNormYRef.current;

      // 分层视差偏移计算
      // 第 1 层（最远背景）：深空渐变底色，移动幅度最大 maxOffset = 40px
      const layer1X = -cx * 40;
      const layer1Y = -cy * 40;

      // 第 2 层（粒子星辰）：散布的星点与雾气等，移动幅度中等 maxOffset = 25px
      const layer2X = -cx * 25;
      const layer2Y = -cy * 25;

      // 第 3 层（前景/孔明灯主体）：本体与近处粒子，轻微反向移动 maxOffset = -5px（制造聚焦冲突感）
      const layer3X = cx * 5;
      const layer3Y = cy * 5;
      // === 视差系统结束 ===

      // 1. 第 1 层渲染（最远深空底色渐变）
      ctx.save();
      ctx.translate(layer1X, layer1Y);
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#060913');
      bgGrad.addColorStop(0.5, '#0B0F1A');
      bgGrad.addColorStop(1, '#111827');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(-60, -60, canvas.width + 120, canvas.height + 120);
      ctx.restore();

      // 2. 开始第 2 层变换（背景星辰、风线、光河、远景灯、云雾）
      ctx.save();
      ctx.translate(layer2X, layer2Y);

      // 2. 绘制背景星空（星辰轨迹随风向轻微偏转漂移）
      permanentStarsRef.current.forEach(st => {
        st.alpha += Math.sin(time * st.speed) * 0.008;
        
        // 基于风力产生轻微水平位移循环
        st.x += windForce * st.size * 0.45;
        if (st.x > canvas.width + 10) st.x = -10;
        if (st.x < -10) st.x = canvas.width + 10;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, st.alpha));
        ctx.fillStyle = st.color;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
        ctx.fill();

        // 为大星增添十字柔光
        if (st.size > 1.4) {
          ctx.strokeStyle = 'rgba(247, 230, 193, 0.3)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(st.x - 4, st.y);
          ctx.lineTo(st.x + 4, st.y);
          ctx.moveTo(st.x, st.y - 4);
          ctx.lineTo(st.x, st.y + 4);
          ctx.stroke();
        }
        ctx.restore();
      });

      // 3. 绘制动态风场线条 (Dynamic Wind Lines)
      windLinesRef.current.forEach(wl => {
        const dir = windForce >= 0 ? 1 : -1;
        wl.x += (wl.speed + Math.abs(windForce) * 7) * dir;
        wl.y += Math.sin(time * 0.02 + wl.x * 0.01) * 0.4;
        
        if (wl.x > canvas.width + 150) wl.x = -150;
        if (wl.x < -150) wl.x = canvas.width + 150;

        ctx.save();
        const activeAlpha = wl.alpha * (0.4 + Math.abs(windForce) * 1.2);
        ctx.globalAlpha = Math.min(0.8, Math.max(0.02, activeAlpha));
        
        const endX = wl.x + wl.length * dir;
        const endY = wl.y - windForce * 12;
        
        const grad = ctx.createLinearGradient(wl.x, wl.y, endX, endY);
        grad.addColorStop(0, 'rgba(247, 230, 193, 0)');
        grad.addColorStop(0.5, 'rgba(247, 230, 193, 0.5)');
        grad.addColorStop(1, 'rgba(247, 230, 193, 0)');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1 + Math.abs(windForce) * 1.5;
        ctx.beginPath();
        ctx.moveTo(wl.x, wl.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
      });

      // 4. 顶端“记忆光河” (Memory River)
      const riverY = canvas.height * 0.12;
      ctx.save();
      const riverGrad = ctx.createLinearGradient(0, riverY - 40, canvas.width, riverY + 40);
      riverGrad.addColorStop(0, 'rgba(212, 175, 55, 0)');
      riverGrad.addColorStop(0.3, 'rgba(212, 175, 55, 0.08)');
      riverGrad.addColorStop(0.7, 'rgba(196, 61, 61, 0.06)');
      riverGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = riverGrad;
      ctx.fillRect(0, riverY - 50, canvas.width, 100);

      // 产生少量流动的河中微光粒子
      if (Math.random() < 0.4) {
        particlesRef.current.push({
          x: Math.random() * canvas.width * 0.1,
          y: riverY + (Math.random() - 0.5) * 60,
          vx: Math.random() * 1.5 + 0.8,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 1.5 + 0.5,
          color: '#F7E6C1',
          alpha: 0,
          life: 0,
          maxLife: 200,
          type: 'flow'
        });
      }
      ctx.restore();

      // 5. 绘制悬浮的远景背景孔明灯
      backgroundLanterns.forEach((bgL, idx) => {
        const seed = (idx + 1) * 137.5;
        const xPos = ((seed * 11) % (canvas.width * 0.8)) + canvas.width * 0.1;
        const yBase = ((seed * 7) % (canvas.height * 0.45)) + canvas.height * 0.2;
        const yPos = yBase + Math.sin(time * 0.015 + seed) * 8;
        const scale = 0.55 + ((seed % 30) / 100);
        drawBgLantern(xPos + Math.sin(time * 0.005) * windForce * 15, yPos, scale, 0.4, bgL.name);
      });

      // 6. 更新并绘制所有背景粒子（排除近处拖尾火星 spark）
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life += 1;
        p.x += p.vx + windForce * 0.5;
        p.y += p.vy;

        // 生命淡入淡出
        const progress = p.life / p.maxLife;
        if (progress < 0.2) p.alpha = (progress / 0.2);
        else if (progress > 0.7) p.alpha = (1 - progress) / 0.3;

        if (p.type !== 'spark') {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

          if (p.type === 'star') {
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = '#FFAA00';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'flow') {
            ctx.fillStyle = '#E6C875';
            ctx.fillRect(p.x, p.y, p.size * 2.5, p.size * 0.8);
          } else if (p.type === 'mist') {
            const mGrad = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, p.size * 12);
            mGrad.addColorStop(0, 'rgba(220, 225, 235, 0.15)');
            mGrad.addColorStop(1, 'rgba(220, 225, 235, 0)');
            ctx.fillStyle = mGrad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 12, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }
      ctx.restore(); // 结束第 2 层背景变换

      // 3. 开始第 3 层变换（前景：近处拖尾火星与上升主体孔明灯）
      ctx.save();
      ctx.translate(layer3X, layer3Y);

      // 绘制近处火星粒子 (spark)
      particlesRef.current.forEach(p => {
        if (p.type === 'spark') {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // 7. 核心：放飞孔明灯主特效 (Rising Active Lantern)
      const anim = activeAnimationRef.current;
      if (anim) {
        anim.timer += 1;

        if (anim.phase === 'rising') {
          // 向上缓动
          const dy = (anim.targetY - anim.y) * 0.018;
          anim.y += dy;
          anim.x += Math.sin(time * 0.05) * 0.8 + windForce * 1.2;

          // 拖尾火星
          if (time % 2 === 0) {
            particlesRef.current.push({
              x: anim.x + (Math.random() - 0.5) * 30,
              y: anim.y + 70,
              vx: (Math.random() - 0.5) * 0.8,
              vy: Math.random() * 1.5 + 0.5,
              size: Math.random() * 2.2 + 0.8,
              color: Math.random() > 0.4 ? '#FFAA44' : '#FF4422',
              alpha: 0.9,
              life: 0,
              maxLife: 40 + Math.random() * 20,
              type: 'spark'
            });
          }

          // 绘制大孔明灯
          ctx.save();
          ctx.translate(anim.x, anim.y);

          // 外层圣洁暖光晕
          const halo = ctx.createRadialGradient(0, 0, 10, 0, 0, 160);
          halo.addColorStop(0, 'rgba(255, 190, 90, 0.55)');
          halo.addColorStop(0.5, 'rgba(255, 120, 30, 0.15)');
          halo.addColorStop(1, 'rgba(255, 80, 10, 0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(0, 0, 160, 0, Math.PI * 2);
          ctx.fill();

          // 灯笼宣纸路径 (仿照设计稿中的倒梯形大灯)
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(-50, -85);
          ctx.quadraticCurveTo(0, -100, 50, -85);
          ctx.lineTo(38, 75);
          ctx.quadraticCurveTo(0, 88, -38, 75);
          ctx.closePath();
          ctx.clip(); // 裁剪到灯笼本体内部

          // 基础宣纸底色
          ctx.fillStyle = '#E8A355';
          ctx.fillRect(-60, -110, 120, 210);

          // 宣纸内部透光渐变
          const paperGrad = ctx.createLinearGradient(0, 70, 0, -80);
          paperGrad.addColorStop(0, '#FFE899');
          paperGrad.addColorStop(0.4, '#F5AA50');
          paperGrad.addColorStop(1, '#B85D19');
          ctx.fillStyle = paperGrad;
          ctx.fillRect(-60, -110, 120, 210);

          // ✦ 解析图片数据：使用 Canvas 的 drawImage 将氛围图渲染在升空的孔明灯本体上
          if (loadedAtmosphereImgRef.current) {
            ctx.save();
            ctx.globalAlpha = 0.65;
            ctx.mixBlendMode = 'multiply';
            ctx.drawImage(loadedAtmosphereImgRef.current, -50, -95, 100, 180);
            ctx.restore();
          }

          // 底部烛光提亮层
          const innerLight = ctx.createRadialGradient(0, 45, 5, 0, 0, 90);
          innerLight.addColorStop(0, 'rgba(255, 255, 220, 0.45)');
          innerLight.addColorStop(1, 'rgba(255, 200, 100, 0)');
          ctx.fillStyle = innerLight;
          ctx.fillRect(-60, -110, 120, 210);

          ctx.restore(); // 结束灯笼区域裁剪

          // ✦ 动态流光金色描边效果 (Dynamic Golden Glowing Outline)
          ctx.shadowColor = '#FFD700';
          ctx.shadowBlur = 14 + Math.sin(time * 0.12) * 8;
          ctx.strokeStyle = '#FFE899';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // 底部烛光核心
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFFF00';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(0, 68, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // 灯体上的书签书法字 (竖排)
          ctx.fillStyle = '#4A1D08';
          ctx.font = 'bold 22px "Songti SC", "SimSun", serif';
          ctx.textAlign = 'center';
          
          // 绘制3-5字灯名
          const nameChars = anim.lantern.name.split('');
          nameChars.forEach((ch, ci) => {
            ctx.fillText(ch, 12, -40 + ci * 28);
          });

          // 侧边极细生命句
          ctx.font = '12px "SimSun", serif';
          ctx.fillStyle = 'rgba(74, 29, 8, 0.65)';
          const poemSub = anim.lantern.poem.slice(0, 8);
          poemSub.split('').forEach((pch, pci) => {
            ctx.fillText(pch, -20, -30 + pci * 16);
          });

          // 朱砂印章
          ctx.fillStyle = '#C43D3D';
          ctx.fillRect(-10, 42, 20, 20);
          ctx.fillStyle = '#FFE899';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(anim.lantern.type, 0, 56);

          ctx.restore();

          // 到达顶部高度后触发【化】->【归】特效
          if (Math.abs(anim.targetY - anim.y) < 5 || anim.timer > 240) {
            anim.phase = 'exploding';
            anim.timer = 0;

            const dest = anim.lantern.destiny;
            if (dest === '入星') {
              // 爆裂为金色光点并记入 background stars
              for (let k = 0; k < 65; k++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = Math.random() * 6 + 1;
                particlesRef.current.push({
                  x: anim.x,
                  y: anim.y,
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd,
                  size: Math.random() * 3 + 1,
                  color: '#FFD700',
                  alpha: 1,
                  life: 0,
                  maxLife: 90 + Math.random() * 40,
                  type: 'star'
                });
              }
              // 永久存入群星
              permanentStarsRef.current.push({
                x: anim.x,
                y: anim.y,
                size: 3.2,
                alpha: 1,
                speed: 0.05,
                color: '#FFD700'
              });
            } else if (dest === '归流') {
              // 化为向右上横向飞驰的光流
              for (let k = 0; k < 50; k++) {
                particlesRef.current.push({
                  x: anim.x + (Math.random() - 0.5) * 40,
                  y: anim.y + (Math.random() - 0.5) * 40,
                  vx: Math.random() * 4 + 3, // 向右飞入光河
                  vy: (riverY - anim.y) * 0.03 + (Math.random() - 0.5) * 1.5,
                  size: Math.random() * 2.5 + 1,
                  color: '#F7E6C1',
                  alpha: 1,
                  life: 0,
                  maxLife: 100,
                  type: 'flow'
                });
              }
            } else {
              // 化雾 (低情绪浓度，释怀消散)
              for (let k = 0; k < 35; k++) {
                particlesRef.current.push({
                  x: anim.x + (Math.random() - 0.5) * 60,
                  y: anim.y + (Math.random() - 0.5) * 60,
                  vx: (Math.random() - 0.5) * 1.2 + windForce * 2,
                  vy: -Math.random() * 0.8 - 0.2,
                  size: Math.random() * 8 + 4,
                  color: '#94A3B8',
                  alpha: 0.7,
                  life: 0,
                  maxLife: 140,
                  type: 'mist'
                });
              }
            }
          }
        } else if (anim.phase === 'exploding') {
          // 等待粒子散开2秒钟
          if (anim.timer > 100) {
            anim.phase = 'done';
            activeAnimationRef.current = null;
            onRisingComplete();
          }
        }
      }
      ctx.restore(); // 结束第 3 层前景变换

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [risingLantern, backgroundLanterns, windForce]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {/* 水墨宣纸质感混合层 Overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(#d4af37_0.6px,transparent_0.6px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#170e0a]/40 via-transparent to-[#070402]/50 mix-blend-multiply pointer-events-none" />
    </div>
  );
};
