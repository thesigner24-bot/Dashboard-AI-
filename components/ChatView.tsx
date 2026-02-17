
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => {
        setSelectedImage(re.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const currentImage = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let contents: any;
      if (currentImage) {
        const base64Data = currentImage.split(',')[1];
        contents = {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/png' } },
            { text: input || "Analyze this image" }
          ]
        };
      } else {
        contents = input;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const groundingUrls = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => chunk.web)
        .filter(Boolean);

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || 'Sorry, I could not process that.',
        groundingUrls
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Error connecting to Gemini API. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Creative Assistant</h1>
        <p className="text-zinc-500 text-sm">Powered by Gemini 3 Flash with Search Grounding</p>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 mb-4">
              <i className="fas fa-sparkles text-indigo-500 text-2xl"></i>
            </div>
            <h2 className="text-xl font-semibold">How can I help you today?</h2>
            <p className="text-zinc-500 max-w-md">I can write code, analyze images, search the web, or just have a chat.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg mt-4">
              {['Design a modern landing page', 'Write a story about space', 'Explain quantum physics', 'What are current news?'].map((q) => (
                <button 
                  key={q}
                  onClick={() => setInput(q)}
                  className="p-3 text-left text-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] space-y-2`}>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
              }`}>
                {msg.image && (
                  <img src={msg.image} alt="User Upload" className="mb-3 rounded-lg max-h-60 object-contain" />
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
              
              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.groundingUrls.map((link, i) => (
                    <a 
                      key={i} 
                      href={link.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-2 py-1 rounded border border-zinc-700 transition-colors flex items-center gap-1"
                    >
                      <i className="fas fa-link text-[8px]"></i> {link.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 relative">
        {selectedImage && (
          <div className="absolute bottom-full mb-4 left-0 p-2 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
            <img src={selectedImage} alt="Preview" className="w-12 h-12 rounded object-cover" />
            <button onClick={() => setSelectedImage(null)} className="text-zinc-500 hover:text-white">
              <i className="fas fa-times-circle"></i>
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 p-2 bg-zinc-900 border border-zinc-800 rounded-2xl focus-within:border-indigo-500/50 transition-all">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageSelect} 
            className="hidden" 
            accept="image/*" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-zinc-400 hover:text-indigo-400 transition-colors"
          >
            <i className="fas fa-paperclip"></i>
          </button>
          <input 
            className="flex-1 bg-transparent border-none focus:ring-0 text-zinc-100 placeholder-zinc-500 py-3 px-2"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white transition-all flex items-center justify-center shadow-lg shadow-indigo-600/20"
          >
            <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
