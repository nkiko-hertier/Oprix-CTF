import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton-loader';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css'; // Dark theme for code blocks
import { useUser } from '@clerk/clerk-react';

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useUser()

  const systemMessage: Message = {
    role: 'user',
    content: `Hiii, my names are ${user?.fullName}`
  };
  

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://oprix-ai-backend.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [systemMessage, ...messages, userMessage] }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      const fullText = data.reply || 'Sorry, no response from the AI.';
      typeMessage(fullText);
    } catch (err) {
      console.error(err);
      toast.error('Failed to get response from AI');
      setLoading(false);
    }
  };

  const typeMessage = (text: string) => {
    let index = 0;
    const newMessage: Message = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, newMessage]);

    typingRef.current = setInterval(() => {
      index++;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = text.slice(0, index);
        return updated;
      });

      if (index >= text.length && typingRef.current) {
        clearInterval(typingRef.current);
        typingRef.current = null;
        setLoading(false);
      }
    }, 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) sendMessage();
  };

  return (
    <div className="w-full md:p-6 space-y-6">
      {/* <h1 className="text-2xl font-bold text-white">Learning Chatbot</h1> */}

      <div
        ref={chatContainerRef}
        className="bg-white/1s0 rounded-lg p-4 flex flex-col gap-4 max-h-[67vh] overflow-y-auto scrollbar-hide"
      >
        {messages.length === 0 && !loading && (
          <div className='flex flex-col justify-center'>
            <img src="/icons/ai1.png" className='w-[200px] mx-auto mb-2' alt="Ai icons" />
            <h1 className='mx-auto text-xl'>Oprix GPT ai</h1>
            <p className="text-gray-400 text-center">Start chatting with your tutor...</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-1  rounded-lg max-full break-words ${
              msg.role === 'user'
                ? 'bg-blue-500/30 px-4 rounded-full! self-end text-white'
                : 'bg-gray-800/80 p-3 self-start text-gray-200 md:p-6 w-full!'
            }`}
          >
            {msg.role === 'assistant' ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const language = className?.replace('language-', '') || '';
                    return (!inline && language) ? (
                      <div className="relative group my-5">
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                        <button
                          onClick={() => navigator.clipboard.writeText(String(children))}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-gray-700 px-2 py-1 text-xs rounded text-white"
                        >
                          Copy
                        </button>
                      </div>
                    ) : (
                      <code className="bg-gray-700 px-2 text-sm rounded">{children}</code>
                    );
                  },
                  table({ children }) {
                    return (
                      <table className="border border-gray-600 rounded overflow-hidden my-2">
                        {children}
                      </table>
                    );
                  },
                  th({ children }) {
                    return <th className="border border-gray-600 bg-gray-700 px-2 py-1">{children}</th>;
                  },
                  td({ children }) {
                    return <td className="border border-gray-600 px-2 py-1">{children}</td>;
                  },
                }}
              >
                {msg.content}
              </ReactMarkdown>
            ) : (
              msg.content
            )}
          </div>
        ))}

        {loading && (
          <div className="">
            <img src="/icons/loader.svg" className='size-[30px]' alt="Thinking..." />
          </div>
        )}
      </div>

      <div className="flex gap-2 fixed bottom-[20px] bg-white/10 p-3 rounded-md w-[90%] md:w-[70%]">
        <input
          placeholder="Type your question..."
          className='bg-transparent! border-none! outline-none! focus:ring-none! w-full'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
        />
        <Button onClick={sendMessage} disabled={loading || !input.trim()}>
          {loading ? '...' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
