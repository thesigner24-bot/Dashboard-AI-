
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { GeneratedVideo } from '../types';

const VideoView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [videoGallery, setVideoGallery] = useState<GeneratedVideo[]>([]);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    try {
      // Accessing aistudio via window casting to bypass conflicting global declarations
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } catch (e) {
      console.error(e);
    }
  };

  const handleKeySelection = async () => {
    await (window as any).aistudio.openSelectKey();
    setHasKey(true);
  };

  const generateVideo = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setStatus('Initializing Veo engine...');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setStatus('Prompting model... This may take several minutes.');
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        setStatus('Generating cinematic frames... ' + (new Date().toLocaleTimeString()));
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setStatus('Finalizing video file...');
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);
        
        const newVideo: GeneratedVideo = {
          id: Date.now().toString(),
          url: videoUrl,
          prompt,
          timestamp: Date.now()
        };
        setVideoGallery(prev => [newVideo, ...prev]);
        setPrompt('');
      }
    } catch (error: any) {
      console.error('Video Generation Error:', error);
      if (error.message?.includes('Requested entity was not found')) {
        setHasKey(false);
        alert('API Key session expired. Please re-select your key.');
      } else {
        alert('Failed to generate video. Please try again.');
      }
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  if (!hasKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
          <i className="fas fa-key text-amber-500 text-3xl"></i>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">API Key Required for Veo</h2>
          <p className="text-zinc-500 max-w-md mx-auto">
            High-quality video generation requires a paid API key from a Google Cloud project with billing enabled.
          </p>
        </div>
        <button
          onClick={handleKeySelection}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-3"
        >
          <i className="fas fa-external-link-alt"></i>
          Select API Key
        </button>
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-indigo-400 text-sm hover:underline"
        >
          Learn about Gemini API billing
        </a>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Cinematic Studio</h1>
          <p className="text-zinc-500">Create stunning 720p videos with Veo 3.1 Fast</p>
        </header>

        <section className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl shadow-2xl">
          <div className="space-y-4">
            <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Describe your scene</label>
            <textarea
              className="w-full min-h-[100px] bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-zinc-100 placeholder-zinc-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all"
              placeholder="A drone shot flying through a neon cyberpunk city at night during a heavy rainstorm..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-zinc-500 italic">
                {status && (
                  <span className="flex items-center gap-2">
                    <i className="fas fa-circle-notch fa-spin text-indigo-500"></i>
                    {status}
                  </span>
                )}
              </div>
              <button
                onClick={generateVideo}
                disabled={isGenerating || !prompt.trim()}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-xl transition-all shadow-lg"
              >
                {isGenerating ? 'Processing...' : 'Create Video'}
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Production Gallery</h2>
          {videoGallery.length === 0 ? (
            <div className="h-48 border border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-600 gap-3">
              <i className="fas fa-clapperboard text-3xl"></i>
              <p>No videos generated yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videoGallery.map((video) => (
                <div key={video.id} className="group bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl transition-all hover:scale-[1.01]">
                  <video src={video.url} controls className="w-full aspect-video bg-black object-contain" />
                  <div className="p-5">
                    <p className="text-zinc-300 font-medium mb-2">"{video.prompt}"</p>
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>{new Date(video.timestamp).toLocaleString()}</span>
                      <a href={video.url} download={`veo-${video.id}.mp4`} className="text-indigo-400 hover:text-indigo-300">
                        <i className="fas fa-download mr-1"></i> Download
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

export default VideoView;
