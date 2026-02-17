
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { encode, decode, decodeAudioData } from '../utils/audioUtils';

const LiveView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<{role: string, text: string}[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const transcriptionRef = useRef({ input: '', output: '' });

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    if (inputAudioCtxRef.current) inputAudioCtxRef.current.close();
    if (outputAudioCtxRef.current) outputAudioCtxRef.current.close();
    
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    
    setIsActive(false);
    setIsConnecting(false);
  }, []);

  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      inputAudioCtxRef.current = inputCtx;
      outputAudioCtxRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            if (message.serverContent?.outputTranscription) {
              transcriptionRef.current.output += message.serverContent.outputTranscription.text;
            } else if (message.serverContent?.inputTranscription) {
              transcriptionRef.current.input += message.serverContent.inputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              const u = transcriptionRef.current.input;
              const m = transcriptionRef.current.output;
              if (u || m) {
                setTranscriptions(prev => [...prev, {role: 'user', text: u}, {role: 'model', text: m}]);
              }
              transcriptionRef.current = { input: '', output: '' };
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live Error:', e);
            stopSession();
          },
          onclose: () => {
            stopSession();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: 'You are a helpful and charismatic AI companion. Keep your answers brief and conversational.'
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start Live session:', err);
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, [stopSession]);

  return (
    <div className="h-full flex flex-col p-6 md:p-12">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col gap-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Aura Live</h1>
          <p className="text-zinc-500">Natural voice conversation with zero latency</p>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center gap-12">
          {/* Visualizer Circle */}
          <div className="relative">
            <div className={`absolute inset-0 rounded-full bg-indigo-500/20 blur-3xl transition-all duration-700 ${isActive ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`} />
            <div className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
              isActive ? 'border-indigo-500 shadow-[0_0_50px_rgba(79,70,229,0.3)] bg-zinc-900' : 'border-zinc-800 bg-zinc-950'
            }`}>
              {isActive ? (
                <div className="flex items-center gap-1.5 h-12">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-2 bg-indigo-500 rounded-full animate-pulse" 
                      style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              ) : (
                <i className="fas fa-microphone-slash text-zinc-800 text-5xl"></i>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={isActive ? stopSession : startSession}
              disabled={isConnecting}
              className={`px-10 py-5 rounded-3xl font-bold text-lg transition-all shadow-2xl flex items-center gap-4 ${
                isActive 
                ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <i className={`fas ${isConnecting ? 'fa-spinner fa-spin' : isActive ? 'fa-phone-slash' : 'fa-microphone'}`}></i>
              {isConnecting ? 'Connecting...' : isActive ? 'End Call' : 'Start Conversation'}
            </button>
            <p className="text-zinc-500 text-sm">
              {isActive ? 'OmniAI is listening...' : 'Click to start a live audio session'}
            </p>
          </div>
        </div>

        {/* Live Transcript Panel */}
        {transcriptions.length > 0 && (
          <div className="h-48 glass rounded-3xl p-6 overflow-y-auto space-y-4 border border-zinc-800/50">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live Transcript
            </h3>
            {transcriptions.map((t, i) => (
              <div key={i} className={`flex gap-3 text-sm ${t.role === 'user' ? 'text-zinc-300' : 'text-indigo-400 font-medium'}`}>
                <span className="opacity-50 w-12 flex-shrink-0 uppercase text-[10px] pt-1">{t.role}:</span>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveView;
