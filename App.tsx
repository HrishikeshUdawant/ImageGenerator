import React, { useState } from 'react';
import { generateImage, optimizePrompt } from './services/geminiService';
import { GeneratedImage, AspectRatioOption, ModelOption } from './types';
import { HistoryGallery } from './components/HistoryGallery';
import { CustomSelect } from './components/CustomSelect';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { 
  Sparkles, 
  Dices, 
  Loader2, 
  Download, 
  AlertCircle, 
  Paintbrush,
  Cpu,
  Minus,
  Plus,
  Wand2
} from 'lucide-react';

// Initial placeholder data
const INITIAL_HISTORY: GeneratedImage[] = [];

const MODEL_OPTIONS = [
  { value: 'z-image-turbo', label: 'Z-Image Turbo' },
  { value: 'gemini-2.5-flash-image', label: 'Nano Banana' }
];

const ASPECT_RATIO_OPTIONS = [
  { value: '1:1', label: 'Square 1:1' },
  { value: '9:16', label: 'Photography 9:16' },
  { value: '16:9', label: 'Movie 16:9' },
  { value: '4:5', label: 'Instagram 4:5' },
  { value: '5:4', label: 'Print 5:4' },
  { value: '3:4', label: 'Portrait 3:4' },
  { value: '4:3', label: 'Landscape 4:3' },
];

export default function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [model, setModel] = useState<ModelOption>('z-image-turbo');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('1:1');
  const [seed, setSeed] = useState<string>(''); // Keep as string for input handling, convert to number for API
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>(INITIAL_HISTORY);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentImage(null);

    try {
      const seedNumber = seed.trim() === '' ? undefined : parseInt(seed, 10);
      const newImage = await generateImage(model, prompt, aspectRatio, seedNumber);
      
      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev]);
    } catch (err: any) {
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimizePrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsOptimizing(true);
    setError(null);
    try {
        const optimized = await optimizePrompt(prompt);
        setPrompt(optimized);
    } catch (err: any) {
        console.error("Optimization failed", err);
        // We don't necessarily show a big error for this, maybe just shake or no-op
        // But let's set a small error just in case
        setError("Failed to optimize prompt. Please try again.");
    } finally {
        setIsOptimizing(false);
    }
  };

  const handleRandomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000).toString());
  };

  const handleAdjustSeed = (amount: number) => {
    const current = parseInt(seed || '0', 10);
    if (isNaN(current)) {
        setSeed((0 + amount).toString());
    } else {
        setSeed((current + amount).toString());
    }
  };

  const handleHistorySelect = (image: GeneratedImage) => {
    setCurrentImage(image);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-gradient-brilliant">
      <div className="flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 md:px-8 md:py-6 backdrop-blur-md sticky top-0 z-50 bg-background-dark/30 border-b border-white/5">
          <div className="flex items-center gap-4 text-white">
            <div className="size-8">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w.org/2000/svg">
                <g clipPath="url(#clip0_6_535)">
                  <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd"></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_535">
                    <rect fill="white" height="48" width="48"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h1 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">AI Image Gen</h1>
          </div>
        </header>

        <main className="w-full max-w-7xl flex-1 flex flex-col md:items-stretch md:mx-auto md:flex-row gap-6 px-6 md:px-6 pb-8 pt-6">
          
          {/* Left Column: Controls */}
          <aside className="w-full md:max-w-sm flex-shrink-0 flex flex-col gap-6">
            <div className="flex-grow space-y-6">
              <div className="relative z-10 bg-black/20 p-6 rounded-xl backdrop-blur-xl border border-white/10 flex flex-col gap-6 shadow-2xl shadow-black/20">
                
                {/* Prompt Input */}
                <div className="group">
                  <label className="flex flex-col flex-1">
                    <div className="flex items-center justify-between pb-3">
                        <p className="text-white text-lg font-medium leading-normal group-focus-within:text-purple-400 transition-colors">Prompt</p>
                        <button
                            onClick={handleOptimizePrompt}
                            disabled={isOptimizing || !prompt.trim()}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 bg-white/5 hover:bg-white/10 hover:text-purple-300 rounded-lg transition-all border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Enhance prompt with AI"
                        >
                            {isOptimizing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Wand2 className="w-3.5 h-3.5" />
                            )}
                            {isOptimizing ? 'Optimizing...' : 'Optimize'}
                        </button>
                    </div>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isOptimizing}
                      className="form-input flex w-full min-w-0 flex-1 resize-none rounded-lg text-white/90 focus:outline-0 focus:ring-2 focus:ring-purple-500/50 border border-white/10 bg-white/5 focus:border-purple-500 min-h-36 placeholder:text-white/30 p-4 text-base font-normal leading-normal transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                      placeholder="A synthwave-style illustration of a futuristic city..."
                    />
                  </label>
                </div>

                {/* Parameters */}
                <div className="space-y-6">
                  {/* Model Selection */}
                  <CustomSelect
                    label="Model"
                    value={model}
                    onChange={(val) => setModel(val as ModelOption)}
                    options={MODEL_OPTIONS}
                    icon={<Cpu className="w-5 h-5" />}
                  />

                  {/* Aspect Ratio */}
                  <CustomSelect
                    label="Aspect Ratio"
                    value={aspectRatio}
                    onChange={(val) => setAspectRatio(val as AspectRatioOption)}
                    options={ASPECT_RATIO_OPTIONS}
                  />

                  {/* Seed */}
                  <div className="group">
                    <div className="flex items-center justify-between pb-3">
                      <p className="text-white text-lg font-medium leading-normal group-focus-within:text-purple-400 transition-colors">Seed</p>
                      <span className="text-white/50 text-sm">Optional</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-1 items-center rounded-lg border border-white/10 bg-white/5 focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:border-purple-500 transition-all h-12 overflow-hidden">
                        <button 
                            onClick={() => handleAdjustSeed(-1)}
                            className="h-full px-3 text-white/40 hover:text-white hover:bg-white/5 transition-colors border-r border-white/5"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <input 
                            type="number"
                            value={seed}
                            onChange={(e) => setSeed(e.target.value)}
                            className="form-input flex-1 h-full bg-transparent border-none text-white/90 focus:ring-0 placeholder:text-white/30 px-2 text-sm font-medium text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                            placeholder="Random" 
                        />
                        <button 
                            onClick={() => handleAdjustSeed(1)}
                            className="h-full px-3 text-white/40 hover:text-white hover:bg-white/5 transition-colors border-l border-white/5"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={handleRandomizeSeed}
                        aria-label="Randomize Seed" 
                        className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors active:scale-95"
                      >
                        <Dices className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button 
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="group relative flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 text-white text-lg font-bold leading-normal tracking-[0.015em] transition-all shadow-lg shadow-purple-900/40 generate-button-gradient hover:shadow-purple-700/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:grayscale"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Dreaming...</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                    <span className="truncate">Generate</span>
                  </span>
                )}
              </button>
            </div>
          </aside>

          {/* Right Column: Preview & Gallery */}
          {/* Added overflow-x-hidden to correct desktop layout overflow */}
          <div className="flex-1 flex flex-col overflow-x-hidden">
            
            {/* Main Preview Area */}
            <section className="flex-1 flex flex-col w-full min-h-[360px] max-h-[450px]">
              <div className="w-full flex-grow flex flex-col items-center justify-center bg-black/20 rounded-xl backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20 overflow-hidden relative group">
                
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
                         <div className="relative">
                            <div className="h-24 w-24 rounded-full border-4 border-white/10 border-t-purple-500 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Paintbrush className="text-purple-400 animate-pulse w-8 h-8" />
                            </div>
                         </div>
                         <p className="mt-8 text-white/80 font-medium animate-pulse text-lg">Creating your masterpiece...</p>
                    </div>
                ) : null}

                {error ? (
                    <div className="text-center text-red-400 p-8 max-w-md animate-in zoom-in-95 duration-300">
                        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500/50" />
                        <h3 className="text-xl font-bold text-white mb-2">Generation Failed</h3>
                        <p className="text-white/60">{error}</p>
                    </div>
                ) : currentImage ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black/40 animate-in zoom-in-95 duration-500">
                     <TransformWrapper
                        initialScale={1}
                        minScale={1}
                        maxScale={8}
                        centerOnInit={true}
                        key={currentImage.id} // Forces component reset on new image
                        wheel={{ step: 0.5 }}
                     >
                       <TransformComponent 
                          wrapperStyle={{ width: "100%", height: "100%" }}
                          contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                       >
                         <img 
                            src={currentImage.url} 
                            alt={currentImage.prompt} 
                            className="max-w-full max-h-full object-contain shadow-2xl cursor-grab active:cursor-grabbing"
                         />
                       </TransformComponent>
                     </TransformWrapper>
                     
                     <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto z-20">
                        <a 
                            href={currentImage.url} 
                            download={`generated-${currentImage.id}.png`}
                            title="Download Image"
                            className="flex items-center justify-center h-10 w-10 rounded-lg bg-black/60 hover:bg-white text-white hover:text-black backdrop-blur-md transition-all shadow-lg border border-white/10"
                        >
                            <Download className="w-5 h-5" />
                        </a>
                     </div>
                  </div>
                ) : !isLoading && (
                  <div className="text-center text-white/60 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="relative inline-block">
                        <Sparkles className="w-20 h-20 text-white/10" />
                        <Sparkles className="w-20 h-20 text-purple-500/40 absolute top-0 left-0 blur-lg animate-pulse" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-white/90">Creations Appear Here</h2>
                    <p className="mt-2 text-base text-white/40 max-w-xs mx-auto">Describe your vision and watch it come to life using AI.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Gallery Strip */}
            <HistoryGallery 
                images={history} 
                onSelect={handleHistorySelect} 
                selectedId={currentImage?.id}
            />

          </div>
        </main>
      </div>
    </div>
  );
}