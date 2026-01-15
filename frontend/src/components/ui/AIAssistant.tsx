
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Bot, MessageSquare } from 'lucide-react';

interface AIAssistantProps {
    userData: any;
    tasks: any[];
    leaves: any[];
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ userData, tasks, leaves }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Hello Dr. ${userData?.name || 'Faculty'}. I am your AI Assistant. How can I help you today?`,
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const generateResponse = (query: string) => {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('task') || lowerQuery.includes('work') || lowerQuery.includes('assignment')) {
            const pendingTasks = tasks.filter(t => t.status !== 'Completed');
            if (pendingTasks.length > 0) {
                return `You have ${pendingTasks.length} pending task(s): ${pendingTasks.map(t => t.title).join(', ')}. Would you like more details on any of them?`;
            } else {
                return "You have no pending tasks right now. Great job!";
            }
        }

        if (lowerQuery.includes('leave') || lowerQuery.includes('vacation') || lowerQuery.includes('off')) {
            const pendingLeaves = leaves.filter(l => l.status === 'Pending');
            if (pendingLeaves.length > 0) {
                return `You have ${pendingLeaves.length} leave request(s) pending approval.`;
            }
            return "You don't have any active leave requests at the moment.";
        }

        if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
            return `Hello Dr. ${userData?.name || 'Smith'}! Ready for the day?`;
        }

        if (lowerQuery.includes('time') || lowerQuery.includes('date')) {
            return `It is currently ${new Date().toLocaleString()}.`;
        }

        return "I can help you check your tasks, leave status, or schedule. Just ask!";
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI thinking delay
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: generateResponse(userMsg.text),
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center shadow-lg shadow-neon-blue/30 z-50 transition-all ${isOpen ? 'hidden' : 'flex'}`}
            >
                <Bot className="text-white w-8 h-8" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
            </motion.button>

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-8 right-8 w-full max-w-md bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-neon-blue/20 to-transparent flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-blue to-purple-500 flex items-center justify-center">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">NEXUS AI</h3>
                                    <p className="text-[10px] text-neon-blue">Virtual Assistant</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                            ? 'bg-neon-blue text-black rounded-tr-none font-medium'
                                            : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-black/40">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about tasks, leaves, or schedule..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50 transition-all placeholder:text-gray-600"
                                />
                                <button
                                    onClick={handleSend}
                                    className="bg-neon-blue text-black p-2 rounded-xl hover:bg-white transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIAssistant;
