import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API Route for Gemini enhancement
app.post("/api/gemini/enhance", async (req, res) => {
  try {
    const { text, area, type } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Texto é obrigatório" });
    }

    if (!ai) {
      return res.status(500).json({
        error: "Chave de API do Gemini não configurada no servidor. Por favor, adicione sua chave GEMINI_API_KEY em Configurações > Secrets.",
      });
    }

    const systemInstruction = `Você é um consultor profissional de RH experiente no mercado de trabalho brasileiro e português.
Sua tarefa é aprimorar o texto curricular fornecido pelo usuário para a área temática de "${area || 'Carreira e Perfil Geral'}".
O tipo de texto a ser aprimorado é: "${type || 'resumo'}".

Instruções:
- Deixe o texto extremamente profissional, persuasivo, dinâmico e focado em conquistas/habilidades relevantes para a área.
- Corrija erros ortográficos ou gramaticais de português se houver.
- Mantenha na primeira pessoa do singular ("Atuei", "Desenvolvi") ou formato de tópicos objetivos.
- Torne a redação elegante e assertiva.
- NÃO invente novos empregos, datas ou empresas que não estejam no texto original, aprimore apenas o texto recebido de forma elegante.
- Retorne APENAS o texto polido/aprimorado de saída. Não coloque aspas, explicações, saudações ou comentários. Retorne o texto cru pronto para copiar e colar.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: text,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Erro no Gemini:", error);
    res.status(500).json({ error: error.message || "Erro interno ao processar IA" });
  }
});

async function startServer() {
  // Vite integration
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
