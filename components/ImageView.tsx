
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { GeneratedImage } from '../types';

const ImageView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [aspectRatio, setAspectRatio] = useState('1:1');

  const generateImage = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any
          }
        }
      });

      let imageUrl = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: imageUrl,
          prompt,
          timestamp: Date.now()
        };
        setGallery(prev => [newImage, ...prev]);
        setPrompt('');
      }
    } catch (error) {
      console.error('Image Generation Error:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Image Forge</h1>
            <p className="text-zinc-500">Transform ideas into high-fidelity visuals</p>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-800">
            {['1:1', '16:9', '9:16', '3:4', '4:3'].map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  aspectRatio === ratio 
                  ? 'bg-zinc-800 text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </header>

        <section className="relative group">
          <div className="flex flex-col md:flex-row gap-4">
            <textarea
              className="flex-1 min-h-[120px] bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-zinc-100 placeholder-zinc-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all shadow-xl"
              placeholder="A futuristic solarpunk city with floating gardens and crystal spires, cinematic lighting, 8k resolution..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={generateImage}
              disabled={isGenerating || !prompt.trim()}
              className="md:w-40 flex flex-col items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
            >
              <div className={`text-2xl ${isGenerating ? 'animate-spin' : ''}`}>
                <i className={`fas ${isGenerating ? 'fa-spinner' : 'fa-wand-magic-sparkles'}`}></i>
              </div>
              <span>{isGenerating ? 'Forging...' : 'Generate'}</span>
            </button>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Creations</h2>
            <span className="text-sm text-zinc-500">{gallery.length} items</span>
          </div>

          {gallery.length === 0 ? (
            <div className="h-64 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-600">
              <i className="far fa-images text-4xl mb-4"></i>
              <p>Your generated masterpieces will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((img) => (
                <div key={img.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-300">
                  <div className={`aspect-video overflow-hidden ${img.url.includes('9:16') ? 'aspect-[9/16]' : 'aspect-square'}`}>
                    <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 bg-gradient-to-t from-zinc-950 to-transparent">
                    <p className="text-sm text-zinc-300 line-clamp-2 italic">"{img.prompt}"</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-zinc-600">{new Date(img.timestamp).toLocaleTimeString()}</span>
                      <a href={img.url} download={`omni-gen-${img.id}.png`} className="text-zinc-400 hover:text-white transition-colors">
                        <i className="fas fa-download"></i>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ImageView;
