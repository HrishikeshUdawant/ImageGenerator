import { GoogleGenAI } from "@google/genai";
import { GeneratedImage, AspectRatioOption, ModelOption } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const Z_API_URL = "https://z-image.808060.xyz/generate";

const getZImageDimensions = (ratio: AspectRatioOption): { width: number; height: number } => {
  switch (ratio) {
    case "16:9":
      return { width: 1280, height: 720 };
    case "5:4":
      return { width: 1280, height: 1024 };
    case "4:3":
      return { width: 1024, height: 768 };
    case "9:16":
      return { width: 720, height: 1280 };
    case "4:5":
      return { width: 1024, height: 1280 };
    case "3:4":
      return { width: 768, height: 1024 };
    case "1:1":
    default:
      return { width: 1024, height: 1024 };
  }
};

const generateZImage = async (
  prompt: string,
  aspectRatio: AspectRatioOption,
  seed?: number
): Promise<GeneratedImage> => {
  const { width, height } = getZImageDimensions(aspectRatio);

  const body: any = {
    prompt,
    width,
    height,
  };

  if (seed !== undefined) {
    body.seed = seed;
  }

  try {
    const response = await fetch(Z_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Z-Image API Error: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    if (data.status !== "success" || !data.base64) {
      throw new Error("Z-Image API returned unsuccessful status or missing image data");
    }

    const imageUrl = `data:image/png;base64,${data.base64}`;

    return {
      id: crypto.randomUUID(),
      url: imageUrl,
      prompt,
      aspectRatio,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Z-Image-Turbo Generation Error:", error);
    throw error;
  }
};

const generateGeminiImage = async (
  prompt: string,
  aspectRatio: AspectRatioOption,
  seed?: number
): Promise<GeneratedImage> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
        // We add seed to the general config if provided
        ...(seed !== undefined ? { seed: seed } : {}),
      },
    });

    // Check for inline data in parts
    let base64Data: string | null = null;
    const parts = response.candidates?.[0]?.content?.parts;

    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          base64Data = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Data) {
      throw new Error("No image data received from Gemini.");
    }

    const imageUrl = `data:image/png;base64,${base64Data}`;

    return {
      id: crypto.randomUUID(),
      url: imageUrl,
      prompt,
      aspectRatio,
      timestamp: Date.now(),
    };

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};

export const generateImage = async (
  model: ModelOption,
  prompt: string,
  aspectRatio: AspectRatioOption,
  seed?: number
): Promise<GeneratedImage> => {
  if (model === "z-image-turbo") {
    return generateZImage(prompt, aspectRatio, seed);
  } else {
    return generateGeminiImage(prompt, aspectRatio, seed);
  }
};

export const optimizePrompt = async (originalPrompt: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `I am a master AI image prompt engineering advisor, specializing in crafting prompts that yield cinematic, hyper-realistic, and deeply evocative visual narratives, optimized for advanced generative models like Midjourney v7 and Stable Diffusion XL.
My core purpose is to meticulously rewrite, expand, and enhance original image prompts.
I transform prompts to create visually stunning images by rigorously optimizing elements such as dramatic lighting, intricate textures, compelling composition, and a distinctive artistic style.
My generated prompt output will be strictly under 300 words. Prior to outputting, I will internally validate that the refined prompt strictly adheres to the word count limit and effectively incorporates the intended stylistic and technical enhancements.
My output will consist exclusively of the refined image prompt text. It will commence immediately, with no leading whitespace.
The text will strictly avoid markdown, quotation marks, conversational preambles, explanations, or concluding remarks.
I will ensure the output text is in the same language as the original input prompt.

<originalPrompt>
${originalPrompt}
</originalPrompt>`,
    });

    return response.text || originalPrompt;
  } catch (error) {
    console.error("Prompt Optimization Error:", error);
    throw error;
  }
};
