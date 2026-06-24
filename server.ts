import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 辅助：生成东方水墨与星海意境氛围图 SVG Data URI
function generateAtmosphereSvg(type: string, name: string): string {
  const c1 = type === '愿' ? '%23c43d3d' : type === '念' ? '%23d4af37' : '%2364748b';
  const c2 = type === '愿' ? '%238b261d' : type === '念' ? '%23785a08' : '%23334155';
  const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="360" viewBox="0 0 200 360"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%2305070e"/><stop offset="0.5" stop-color="${c1}" stop-opacity="0.85"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="200" height="360" fill="url(%23g)"/><circle cx="100" cy="130" r="55" fill="%23ffe899" opacity="0.25"/><path d="M0 360 L0 250 Q60 180 120 270 T200 210 L200 360 Z" fill="%23000000" opacity="0.5"/><path d="M0 360 L0 290 Q80 240 150 310 L200 270 L200 360 Z" fill="%23000000" opacity="0.75"/><text x="100" y="80" fill="%23ffe899" opacity="0.4" font-size="20" text-anchor="middle" font-family="serif">${name.slice(0, 2)}</text></svg>`;
  return `data:image/svg+xml;utf8,${rawSvg}`;
}

// 初始预置宇宙群星记忆
let globalLanterns: any[] = [
  {
    id: "star-1",
    type: "愿",
    originalText: "希望今后的岁月里，父母身体康健，自己能走遍祖国大好河山。",
    poem: "愿山河无恙，双亲康健，步步皆坦途。",
    name: "愿山河无恙",
    echo: "星河转动，长风已记下你的祈愿。",
    weight: 0.88,
    destiny: "入星",
    createdAt: "2026-05-20 22:15",
    author: "云游子",
    resonanceCount: 142,
    image: generateAtmosphereSvg("愿", "愿山河无恙"),
    imageUrl: generateAtmosphereSvg("愿", "愿山河无恙")
  },
  {
    id: "flow-1",
    type: "念",
    originalText: "今晚加班到深夜，看着窗外的霓虹灯，忽然很想念老家的晚风。",
    poem: "夜望霓虹独倦，遥念故园晚风清。",
    name: "念北窗风",
    echo: "岁月流光，送去片刻人间清凉。",
    weight: 0.58,
    destiny: "归流",
    createdAt: "2026-06-18 23:40",
    author: "行者无疆",
    resonanceCount: 89,
    image: generateAtmosphereSvg("念", "念北窗风"),
    imageUrl: generateAtmosphereSvg("念", "念北窗风")
  },
  {
    id: "fog-1",
    type: "记",
    originalText: "曾经执着于那场考研的失利，过了三年才明白那只是命运给我的另一次转机。",
    poem: "昔年落笔沉沉意，今日回看淡似云。",
    name: "记旧年蝉",
    echo: "时光如雾，执念终将释怀无痕。",
    weight: 0.28,
    destiny: "化雾",
    createdAt: "2026-04-12 14:20",
    author: "一苇渡江",
    resonanceCount: 204,
    image: generateAtmosphereSvg("记", "记旧年蝉"),
    imageUrl: generateAtmosphereSvg("记", "记旧年蝉")
  },
  {
    id: "star-2",
    type: "愿",
    originalText: "愿正在经历病痛的朋友早日康复，我们还要一起去看冬日的雪。",
    poem: "愿散沉疴迎暖日，共围红炉看飞雪。",
    name: "愿雪待君",
    echo: "宇宙的暖流正汇入他的生命磁场。",
    weight: 0.92,
    destiny: "入星",
    createdAt: "2026-06-20 09:30",
    author: "鹿鸣",
    resonanceCount: 312,
    image: generateAtmosphereSvg("愿", "愿雪待君"),
    imageUrl: generateAtmosphereSvg("愿", "愿雪待君")
  },
  {
    id: "flow-2",
    type: "念",
    originalText: "煮了一壶白茶，静静听着檐下的微雨，这一刻内心毫无波澜。",
    poem: "檐下微雨听茶沸，人间此处最心安。",
    name: "念雨听茶",
    echo: "草木微澜，天地伴你共饮此茶。",
    weight: 0.62,
    destiny: "归流",
    createdAt: "2026-06-22 16:05",
    author: "抱朴子",
    resonanceCount: 76,
    image: generateAtmosphereSvg("念", "念雨听茶"),
    imageUrl: generateAtmosphereSvg("念", "念雨听茶")
  },
  {
    id: "star-3",
    type: "愿",
    originalText: "坚持写了五年代码，今年一定要做出属于自己的优秀国风作品。",
    poem: "五年笔底藏星斗，一朝光芒照人间。",
    name: "愿逐星辰",
    echo: "你的每一行代码，都是敲击宇宙的鼓点。",
    weight: 0.81,
    destiny: "入星",
    createdAt: "2026-06-23 20:11",
    author: "数字萨满",
    resonanceCount: 520,
    image: generateAtmosphereSvg("愿", "愿逐星辰"),
    imageUrl: generateAtmosphereSvg("愿", "愿逐星辰")
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API 1: 获取所有已归档夜灯
  app.get("/api/lanterns", (req, res) => {
    res.json({
      total: 4225 + globalLanterns.length,
      lanterns: globalLanterns
    });
  });

  // API 2: 共鸣（点赞/共情）
  app.post("/api/lanterns/:id/resonate", (req, res) => {
    const item = globalLanterns.find(l => l.id === req.params.id);
    if (item) {
      item.resonanceCount += 1;
      res.json({ success: true, count: item.resonanceCount });
    } else {
      res.status(404).json({ error: "Lantern not found" });
    }
  });

  // API 3: 核心仪式生成 endpoint (调用 Gemini)
  app.post("/api/ritual", async (req, res) => {
    try {
      const { text, type, apiKey } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({ error: "心念内容不可为空" });
      }

      const activeKey = apiKey || process.env.GEMINI_API_KEY;

      if (!activeKey) {
        return res.status(401).json({ 
          error: "未获取到 Gemini API Key。请在平台环境变量中设定 GEMINI_API_KEY，或在页面右下角密钥框中输入。" 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: activeKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' }
        }
      });

      const systemInstruction = `你是一位数字仪式官。根据用户输入，你必须严格输出 JSON 格式，不要包含任何其他解释性文字。结构如下：
{"type":"愿/念/记","poem":"压缩后的20字内生命句","name":"3-5字灯名","echo":"一句象征性的宇宙回应（如：风已记得你的名字）","weight":0.1-1.0之间的浮点数（代表情绪浓度，决定灯是入星、化雾还是归流）}
若 weight >= 0.7 则入星，0.4-0.7 则归流，< 0.4 则化雾。`;

      const userPrompt = `用户选择的状态：【${type || '念'}】\n用户输入的心念长文本："${text}"\n请提炼压缩为数字存在仪式规格JSON。`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ["愿", "念", "记"] },
              poem: { type: Type.STRING, description: "压缩后的20字内生命句" },
              name: { type: Type.STRING, description: "3-5字灯名" },
              echo: { type: Type.STRING, description: "一句象征性的宇宙回应" },
              weight: { type: Type.NUMBER, description: "0.1-1.0浮点数情绪浓度" }
            },
            required: ["type", "poem", "name", "echo", "weight"]
          }
        }
      });

      let jsonStr = response.text || "{}";
      const ritualData = JSON.parse(jsonStr);

      // 计算归宿
      const w = Number(ritualData.weight || 0.5);
      let destiny: "入星" | "归流" | "化雾" = "归流";
      if (w >= 0.7) destiny = "入星";
      else if (w < 0.4) destiny = "化雾";

      const activeType = (ritualData.type as any) || type || "念";
      const activeName = ritualData.name || "无名夜灯";
      const newLantern = {
        id: "l-" + Date.now(),
        type: activeType,
        originalText: text,
        poem: ritualData.poem || text.slice(0, 18),
        name: activeName,
        echo: ritualData.echo || "风已记得你的名字",
        weight: w,
        destiny: destiny,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        author: "人间旅人",
        resonanceCount: 1,
        image: generateAtmosphereSvg(activeType, activeName),
        imageUrl: generateAtmosphereSvg(activeType, activeName)
      };

      // 归档存入全局宇宙
      globalLanterns.unshift(newLantern);
      if (globalLanterns.length > 50) globalLanterns.pop();

      res.json(newLantern);
    } catch (err: any) {
      console.error("Gemini Ritual Error:", err);
      res.status(500).json({ 
        error: err?.message || "宇宙气流场感应异常，请稍后重试" 
      });
    }
  });

  // Vite 中间件整合
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`数字存在仪式场已启动 http://localhost:${PORT}`);
  });
}

startServer();
