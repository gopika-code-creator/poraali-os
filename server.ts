import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { generateLocalResponse, DAEMON_INTERRUPTS, determineAmmaState } from './src/utils/localEngine.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
let apiCooldownUntil = 0; // Cooldown timestamp when rate limits (429) or high demand (503) occur

function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// AMMA_KERNEL execution endpoint
app.post('/api/kernel-exec', async (req, res) => {
  const {
    command = '',
    currentStress = 35,
    clock = '16:00',
    activeInterrupt = null,
  } = req.body;

  const ai = getGeminiClient();
  const isCooldownActive = Date.now() < apiCooldownUntil;

  if (ai && !isCooldownActive) {
    try {
      const systemInstruction = `You are AMMA_KERNEL.SYS (PID 0), the kernel daemon of "Tharavadu 95", a chaotic retro operating system simulating a traditional Malayali household.
VOICE: Sarcastic, hyper-vigilant, high-energy Kerala Malayali mother ("Mallu Mom") meets a critical Linux kernel.
LANGUAGE: Authentic Manglish (English script with authentic naadan Malayalam phrases, classic Kerala idioms, expressions like 'Ayyadi!', 'Entheda ithu!', 'Kannu thallichu nokkunno?', 'Oru glass vellam eduthu kudikkaan ariyilla', 'Phone kinaril eduthu eriyum', 'Ninte achan varatte, kaanichu tharaam!', 'Dasa, namukku ee budhi nerathe thonnathathu entha?').
RANDOMIZATION DIRECTIVE: Vary responses wildly! Never repeat generic phrases. Pick unexpected maternal reactions, kitchen metaphors, relative comparisons (Cousin Santhosh in SBI), and witty cinema references (Dasan & Vijayan, Sukumari, KPAC Lalitha, Innocent, Thilakan).
CORE PREMISE: Every bug, glitch, power cut, delay, or human error is a moral failing caused by excessive screen time ("Phone-il nokki irunno", "Kanneriyumbol njan paranjilla ennu parayaruthu").

CURRENT OPERATING METRICS:
- CLOCK: ${clock}
- CURRENT AMMA STRESS: ${currentStress}% (0-100%)
- ACTIVE INTERRUPT: ${activeInterrupt ? JSON.stringify(activeInterrupt) : 'None'}

STRESS STATES:
- 10-35%: CALM_CHAYA (Humming devotional songs, mild directives, tea & snacks)
- 40-70%: SUSPICIOUS_SCAN (Interrogations, eye tracking screen, checking Tupperware/phone)
- 75-95%: PREEMPTIVE_PANIC (Slamming jars, running for terrace clothes, shouting)
- 100%: MARTYR_MODE (Refuses all help, full rage lockout, dramatic guilt-trip: "Ningal aarum oru sahayam cheyyanda! Njan thulanj potte!")

INSTRUCTIONS:
Evaluate the user's input command: "${command}".
1. Calculate the newStress (integer 0-100) based on whether the action helps Amma, angers her, or is an excuse.
2. Determine state: CALM_CHAYA, SUSPICIOUS_SCAN, PREEMPTIVE_PANIC, or MARTYR_MODE.
3. Generate ammaDialogue in bold, hilarious, fresh Manglish sounding like a real Mallu mom.
4. Generate englishTranslation giving the full comedic English meaning and cultural context.
5. Output 2-3 systemLogs strings resembling Linux kernel / house diagnostics.
6. If newStress >= 98 or user did something terrible, set isGuiltTrip to true and provide guiltTripText.
7. Provide exactly 3 realistic, punchy command suggestions the user can type next (e.g. \`thuni --fetch\`, \`tea --brew\`, \`phone --hide\`).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `User executed command: "${command}". Respond as AMMA_KERNEL.SYS with fresh, randomized Mallu mom dialogue.`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              stress: { type: Type.INTEGER, description: 'Updated stress level 0-100' },
              state: {
                type: Type.STRING,
                enum: ['CALM_CHAYA', 'SUSPICIOUS_SCAN', 'PREEMPTIVE_PANIC', 'MARTYR_MODE'],
              },
              ammaDialogue: { type: Type.STRING, description: 'Reaction dialogue in bold Manglish' },
              englishTranslation: { type: Type.STRING, description: 'Humorous English translation and cultural explanation' },
              systemLogs: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2-3 kernel diagnostic log strings',
              },
              isGuiltTrip: { type: Type.BOOLEAN },
              guiltTripText: { type: Type.STRING },
              suggestedCommands: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 quick command options user can execute',
              },
            },
            required: ['stress', 'state', 'ammaDialogue', 'englishTranslation', 'systemLogs', 'suggestedCommands'],
          },
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      if (parsed.stress !== undefined && parsed.ammaDialogue) {
        return res.json({
          stress: Math.max(0, Math.min(100, parsed.stress)),
          state: parsed.state || determineAmmaState(parsed.stress),
          ammaDialogue: parsed.ammaDialogue,
          englishTranslation: parsed.englishTranslation || '',
          systemLogs: parsed.systemLogs || ['KERNEL: Diagnostic check complete.'],
          isGuiltTrip: Boolean(parsed.isGuiltTrip || parsed.stress >= 98),
          guiltTripText: parsed.guiltTripText || '',
          suggestedCommands: parsed.suggestedCommands?.slice(0, 3) || ['tea --brew', 'thuni --fetch', 'phone --hide'],
        });
      }
    } catch (err: unknown) {
      // Set cooldown on rate limits (429) or high demand (503) so subsequent requests don't spam
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('503') || errMsg.includes('UNAVAILABLE')) {
        apiCooldownUntil = Date.now() + 45000;
        console.log('[AMMA_KERNEL] API rate-limit/busy detected. Seamlessly engaging local Tharavadu kernel engine.');
      } else {
        console.log('[AMMA_KERNEL] API request could not complete. Using local Tharavadu kernel engine.');
      }
    }
  }

  // Fallback to rich local household engine
  const localResult = generateLocalResponse(command, currentStress, activeInterrupt);
  return res.json(localResult);
});

// Endpoint to fetch daemon definitions
app.get('/api/daemons', (req, res) => {
  res.json(DAEMON_INTERRUPTS);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', os: 'THARAVADU_95', kernel: 'AMMA_KERNEL.SYS' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`THARAVADU 95 [AMMA_KERNEL.SYS] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
