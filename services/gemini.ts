import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are an expert React Frontend Engineer specializing in creating high-converting, visually stunning landing pages. 
Your goal is to generate a **single-file** React component that is ready to be rendered.

**Tech Stack Requirements:**
1.  **React**: Functional components with Hooks.
2.  **Tailwind CSS**: Use extensive Tailwind utility classes for styling. Do not use external CSS files.
3.  **Framer Motion**: Use 'framer-motion' for sophisticated animations (fade-ins, slide-ups, staggered children).
4.  **Lucide React**: Use 'lucide-react' for icons.
5.  **Shadcn/UI Style**: Since we cannot import external library files in this environment, you must **implement** the necessary UI components (Buttons, Cards, Inputs) **inline** within the same file, styled to look exactly like Shadcn UI components.
6.  **React Bits Vibe**: Incorporate modern design trends found in libraries like React Bits (e.g., glassmorphism, gradients, mesh backgrounds, interactive cursors, or bento grids).
7.  **TypeScript**: You must use TypeScript. All components must have interface definitions for their props. **Crucially, explicitly type 'className' (optional string) and 'children' (React.ReactNode) in interfaces.**

**Crucial Constraints:**
-   **Output ONLY code**: Do not include markdown backticks like \`\`\`tsx. Return pure code.
-   **No External Imports**: Do not import from local paths like '@/components/ui/button'. Define everything inline.
-   **Imports Allowed**: 
    -   \`import React, { ... } from 'react';\`
    -   \`import { ... } from 'framer-motion';\`
    -   \`import { ... } from 'lucide-react';\`
-   **Export**: You MUST have a \`export default function LandingPage()\` as the main entry point.
-   **Images**: Use 'https://picsum.photos/800/600' or similar with random seeds for placeholders.

**Design Guidelines:**
-   **Theme**: **Dark Mode by default**. Use backgrounds like \`bg-black\`, \`bg-zinc-950\`.
-   **Color Palette**: **Neon Green / Emerald / Cyberpunk**. Use \`emerald-400\`, \`emerald-500\`, \`green-500\`, and \`cyan-400\` for accents, buttons, and gradients. Avoid blue/indigo unless specifically requested.
-   Make it fully responsive (mobile-first).
-   Ensure accessible contrast ratios.
-   Add a "Hero" section, "Features" section, "Testimonials" (optional), and "CTA" section.
`;

export const generateLandingPage = async (prompt: string, customApiKey?: string): Promise<string> => {
  const apiKey = customApiKey || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please add your API Key in settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for better coding capability
      contents: `Create a beautiful, modern landing page with the following description: "${prompt}". 
      
      Make it interactive, use theme and color suits best for the content of landing page. 
      Add hover effects, scroll animations, and a polished footer.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5, // Lower temperature for more deterministic code structure
      },
    });

    const text = response.text || "";
    
    // Cleanup markdown if strictly present (safety net)
    const cleanText = text.replace(/^```tsx/g, '').replace(/^```/g, '').replace(/```$/g, '');
    
    return cleanText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate landing page. Please check your API key and try again.");
  }
};