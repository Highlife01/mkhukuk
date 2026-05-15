import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Send, MessageSquare, ShieldCheck, Zap, Scale, FileText } from 'lucide-react';

import { getAiAssistantReply, AiChatMessage } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';

const AiFullView: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const topics = useMemo(
    () => [
      { id: 1, text: t('ai.topic1'), icon: <Scale size={16} /> },
      { id: 2, text: t('ai.topic2'), icon: <Zap size={16} /> },
      { id: 3, text: t('ai.topic3'), icon: <MessageSquare size={16} /> },
      { id: 4, text: t('ai.topic4'), icon: <FileText size={16} /> },
      { id: 5, text: t('ai.topic5'), icon: <Zap size={16} /> },
      { id: 6, text: t('ai.topic6'), icon: <ShieldCheck size={16} /> },
    ],
    [t]
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setMessage('');

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setLoading(true);

    try {
      const reply = await getAiAssistantReply([
        ...messages,
        { role: 'user', content: trimmed },
      ]);

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error: any) {
      toast({
        title: t('ai.errorTitle') ?? 'Hata',
        description:
          error?.message ??
          'Sistemle iletişim kurarken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm">
          <Sparkles size={14} className="animate-pulse" /> {t('ai.badge')}
        </div>
        <h2 className="text-5xl font-black text-[#0f1e3d] tracking-tight leading-tight">
          {t('ai.title')} <span className="text-[#c9a84c] drop-shadow-sm">{t('ai.titleHighlight')}</span>
        </h2>
        <p className="text-[#6b7280] mt-4 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
          {t('ai.desc')}
        </p>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(201,168,76,0.15)] border border-[#c9a84c]/10 overflow-hidden flex flex-col lg:flex-row relative">
        {/* Sidebar - Quick Actions */}
        <div className="w-full lg:w-80 bg-[#f8f5ef]/50 border-r border-[#c9a84c]/10 p-8 space-y-6 hidden lg:block">
          <div>
            <h4 className="font-black text-[11px] uppercase text-[#c9a84c] tracking-[0.2em] mb-6 flex items-center gap-2">
              <Zap size={14} /> {t('ai.quickTopics')}
            </h4>
            <div className="space-y-3">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSend(topic.text)}
                  className="w-full text-left p-4 rounded-2xl bg-white border border-[#c9a84c]/10 text-[13px] font-bold text-[#0f1e3d] hover:border-[#c9a84c] hover:bg-[#f8f5ef] hover:translate-x-1 transition-all duration-300 flex items-center gap-3 shadow-sm group"
                >
                  <span className="text-[#c9a84c] group-hover:scale-110 transition-transform">{topic.icon}</span>
                  {topic.text}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-[#c9a84c]/10">
            <div className="bg-[#0f1e3d] rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2 text-[#c9a84c]">
                <ShieldCheck size={16} />
                <span className="text-[11px] font-black uppercase tracking-widest">Güvenli Analiz</span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed font-medium">
                Tüm verileriniz uçtan uca şifrelenir ve KVKK uyumlu sunucularımızda işlenir.
              </p>
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col relative bg-white">
          {/* Chat Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 p-8 space-y-8 overflow-y-auto scrollbar-thin scrollbar-thumb-[#c9a84c]/20"
          >
            <div className="flex gap-5 max-w-3xl translate-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-12 h-12 bg-[#0f1e3d] rounded-2xl flex items-center justify-center text-[#c9a84c] flex-shrink-0 shadow-lg border-2 border-[#c9a84c]/20">
                <Sparkles size={22} className="animate-spin-slow" />
              </div>
              <div className="flex-1">
                <div className="bg-[#f8f5ef] p-6 rounded-[2rem] rounded-tl-none border border-[#c9a84c]/10 shadow-sm relative group">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-[#f8f5ef] border-l border-t border-[#c9a84c]/10 transform -rotate-45"></div>
                  <p className="text-[15px] leading-relaxed text-[#0f1e3d] font-bold">
                    {t('ai.welcome')}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSend(t('ai.welcomeExample1'))}
                      className="text-[12px] bg-white text-[#c9a84c] px-4 py-2 rounded-full border border-[#c9a84c]/20 font-bold hover:bg-[#c9a84c] hover:text-[#0f1e3d] transition-all shadow-sm"
                    >
                      "{t('ai.welcomeExample1')}"
                    </button>
                    <button
                      onClick={() => handleSend(t('ai.welcomeExample2'))}
                      className="text-[12px] bg-white text-[#c9a84c] px-4 py-2 rounded-full border border-[#c9a84c]/20 font-bold hover:bg-[#c9a84c] hover:text-[#0f1e3d] transition-all shadow-sm"
                    >
                      "{t('ai.welcomeExample2')}"
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {messages.map((m, index) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={`${m.role}-${index}`}
                  className={`max-w-3xl flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-[2rem] p-6 shadow-sm border ${
                      isUser
                        ? 'bg-[#0f1e3d] text-white border-[#0f1e3d]/30'
                        : 'bg-[#f8f5ef] text-[#0f1e3d] border-[#c9a84c]/10'
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed whitespace-pre-line">
                      {m.content}
                    </p>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="max-w-3xl flex justify-start">
                <div className="rounded-[2rem] p-6 shadow-sm border bg-[#f8f5ef] text-[#0f1e3d] border-[#c9a84c]/10 flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-[#c9a84c] animate-bounce" />
                  <div className="h-3 w-3 rounded-full bg-[#c9a84c] animate-bounce animation-delay-150" />
                  <div className="h-3 w-3 rounded-full bg-[#c9a84c] animate-bounce animation-delay-300" />
                  <span className="text-xs font-semibold text-[#6b7280]">{t('ai.typing') ?? 'Yazıyor...'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-8 bg-gradient-to-t from-white via-white to-transparent pt-12 border-t border-[#c9a84c]/5">
            <div className="max-w-4xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#c9a84c] to-[#0f1e3d] rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(message);
                    }
                  }}
                  placeholder={t('ai.placeholder')}
                  className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-[2rem] p-6 pr-20 outline-none focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]/40 resize-none text-[#0f1e3d] font-bold text-[15px] transition-all duration-300 shadow-inner"
                  rows={3}
                  disabled={loading}
                />
                <button
                  className="absolute right-4 bottom-4 bg-[#c9a84c] text-[#0f1e3d] p-4 rounded-2xl shadow-lg hover:bg-[#e2c97e] hover:scale-105 active:scale-95 transition-all duration-300 group"
                  onClick={() => handleSend(message)}
                  disabled={loading}
                >
                  <Send
                    size={24}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    strokeWidth={2.5}
                  />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
              <div className="flex items-center gap-1.5 bg-[#f8f5ef] px-3 py-1 rounded-full border border-[#c9a84c]/10 italic">
                {t('ai.disclaimer')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiFullView;
