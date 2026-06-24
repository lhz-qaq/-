/**
 * 数字萨满极简音疗引擎 (Web Audio API)
 * 无需外部音频源，本地纯函数合成东方深邃冥想长音与微风白噪音
 */

let audioCtx: AudioContext | null = null;
let isPlaying = false;
let masterGain: GainNode | null = null;

export function toggleAmbientSound(playState?: boolean): boolean {
  if (playState !== undefined) {
    if (playState === isPlaying) return isPlaying;
  }

  if (!isPlaying) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 3);
      masterGain.connect(audioCtx.destination);

      // 1. 基础低频共鸣 (108Hz - 宇宙嗡鸣基频 OM / 嗡音)
      const oscLow = audioCtx.createOscillator();
      oscLow.type = 'sine';
      oscLow.frequency.setValueAtTime(108, audioCtx.currentTime);
      
      const lowGain = audioCtx.createGain();
      lowGain.gain.value = 0.5;
      oscLow.connect(lowGain);
      lowGain.connect(masterGain);
      oscLow.start();

      // 2. 五度相生泛音 (162Hz - 东方商音氛围)
      const oscMid = audioCtx.createOscillator();
      oscMid.type = 'triangle';
      oscMid.frequency.setValueAtTime(162, audioCtx.currentTime);
      
      const midGain = audioCtx.createGain();
      midGain.gain.value = 0.15;
      oscMid.connect(midGain);
      midGain.connect(masterGain);
      oscMid.start();

      // 3. 缓动微风气流声 (Pink Noise Filtered)
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const windFilter = audioCtx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.setValueAtTime(320, audioCtx.currentTime);

      // 让风声随时间呼吸微动
      setInterval(() => {
        if (!audioCtx || !isPlaying) return;
        const now = audioCtx.currentTime;
        const targetFreq = 260 + Math.random() * 180;
        windFilter.frequency.exponentialRampToValueAtTime(targetFreq, now + 4);
      }, 4000);

      const windGain = audioCtx.createGain();
      windGain.gain.value = 0.25;

      whiteNoise.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);
      whiteNoise.start();

      isPlaying = true;
      return true;
    } catch (e) {
      console.error("Audio Engine boot failed:", e);
      isPlaying = false;
      return false;
    }
  } else {
    // Fade out
    if (audioCtx && masterGain) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
      setTimeout(() => {
        if (audioCtx) audioCtx.close();
        audioCtx = null;
        masterGain = null;
      }, 1500);
    }
    isPlaying = false;
    return false;
  }
}
