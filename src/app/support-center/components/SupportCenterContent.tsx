'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Ticket,
  Mail,
  Phone,
  Send,
  X,
  Minimize2,
  Maximize2,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Headphones,
  Bot,
  User,
  Paperclip,
  Smile,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  text: string;
  time: string;
}

interface TicketForm {
  subject: string;
  category: string;
  priority: string;
  description: string;
  orderId: string;
}

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const BOT_RESPONSES: Record<string, string> = {
  default: "Thanks for reaching out! A support agent will be with you shortly. In the meantime, can you describe your issue in detail?",
  order: "I can see you have a question about an order. Please provide your Order ID and I'll pull up the details for you.",
  payment: "For payment issues, please share your transaction reference number. Our finance team typically resolves payment queries within 2 hours.",
  refund: "Refund requests are processed within 3–5 business days. Please provide your order ID and reason for the refund.",
  account: "For account-related issues, please verify your registered email address so we can locate your account.",
};

function getBotResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('order')) return BOT_RESPONSES.order;
  if (lower.includes('payment') || lower.includes('pay')) return BOT_RESPONSES.payment;
  if (lower.includes('refund')) return BOT_RESPONSES.refund;
  if (lower.includes('account') || lower.includes('login') || lower.includes('password')) return BOT_RESPONSES.account;
  return BOT_RESPONSES.default;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function SupportCenterContent() {
  const [activeTab, setActiveTab] = useState<'contact' | 'ticket'>('contact');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'agent',
      text: "👋 Hello! Welcome to PrimeBoost Nigeria Support. I'm here to help you with any questions about your orders, payments, or account. How can I assist you today?",
      time: formatTime(new Date()),
    },
  ]);

  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [ticketForm, setTicketForm] = useState<TicketForm>({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
    orderId: '',
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      time: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        text: getBotResponse(text),
        time: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, agentMsg]);
    }, 1500);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 4000);
    setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => setTicketSubmitted(false), 4000);
    setTicketForm({ subject: '', category: '', priority: 'medium', description: '', orderId: '' });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Support Center</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Get help with your orders, payments, and account issues.</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Support Online
        </span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Clock, label: 'Avg. Response', value: '< 2 hrs', color: 'text-yellow-400' },
          { icon: CheckCircle, label: 'Resolved Today', value: '47', color: 'text-green-400' },
          { icon: Ticket, label: 'Open Tickets', value: '3', color: 'text-primary' },
          { icon: AlertCircle, label: 'Pending', value: '1', color: 'text-orange-400' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <stat.icon size={20} className={stat.color} />
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold tabular-nums">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/2349168783729?text=Hello%20PrimeBoost%20Nigeria%20Support"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-4 rounded-xl border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-all group"
      >
        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-green-400" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-green-400">Chat on WhatsApp</p>
          <p className="text-xs text-muted-foreground">Instant support via WhatsApp — available 8am–10pm WAT</p>
        </div>
        <ChevronDown size={16} className="text-muted-foreground rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
      </a>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted/30 rounded-xl w-fit">
        {(['contact', 'ticket'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'btn-primary rounded-lg' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'contact' ? (
              <span className="flex items-center gap-2"><Mail size={14} /> Contact Us</span>
            ) : (
              <span className="flex items-center gap-2"><Ticket size={14} /> Submit Ticket</span>
            )}
          </button>
        ))}
      </div>

      {/* Contact Form */}
      {activeTab === 'contact' && (
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-1">Send Us a Message</h2>
          <p className="text-sm text-muted-foreground mb-6">We'll get back to you within 2 business hours.</p>

          {contactSubmitted && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 mb-6">
              <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-400">Message sent successfully! We'll respond to your email shortly.</p>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Adaeze Chukwu"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="adaeze@gmail.com"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="+234 800 000 0000"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Subject *</label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="How can we help?"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Message *</label>
              <textarea
                required
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Describe your issue or question in detail..."
                className="input-field resize-none"
              />
            </div>

            <button type="submit" className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm">
              <Send size={15} />
              Send Message
            </button>
          </form>
        </div>
      )}

      {/* Ticket Form */}
      {activeTab === 'ticket' && (
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-1">Submit a Support Ticket</h2>
          <p className="text-sm text-muted-foreground mb-6">Track your issue with a dedicated ticket number.</p>

          {ticketSubmitted && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 mb-6">
              <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-green-400 font-medium">Ticket submitted successfully!</p>
                <p className="text-xs text-muted-foreground mt-0.5">Ticket #PB-{Math.floor(Math.random() * 90000) + 10000} created. Check your email for updates.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Ticket Subject *</label>
              <input
                type="text"
                required
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                placeholder="Brief description of your issue"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Category *</label>
                <select
                  required
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select category</option>
                  <option value="order">Order Issue</option>
                  <option value="payment">Payment Problem</option>
                  <option value="refund">Refund Request</option>
                  <option value="account">Account Issue</option>
                  <option value="technical">Technical Problem</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Priority</label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Order ID (if applicable)</label>
                <input
                  type="text"
                  value={ticketForm.orderId}
                  onChange={(e) => setTicketForm({ ...ticketForm, orderId: e.target.value })}
                  placeholder="e.g. PB-10234"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Detailed Description *</label>
              <textarea
                required
                rows={6}
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                placeholder="Please describe your issue in as much detail as possible. Include any error messages, screenshots descriptions, or steps to reproduce the problem..."
                className="input-field resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm">
                <Ticket size={15} />
                Submit Ticket
              </button>
              <p className="text-xs text-muted-foreground">You'll receive a confirmation email with your ticket number.</p>
            </div>
          </form>
        </div>
      )}

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Mail,
            title: 'Email Support',
            detail: 'primeboostnigeria@gmail.com',
            sub: 'Response within 2 hours',
            color: 'text-primary',
            bg: 'bg-primary/10',
          },
          {
            icon: Phone,
            title: 'Phone Support',
            detail: '+234 916 878 3729',
            sub: 'Mon–Fri, 8am–6pm WAT',
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
          },
          {
            icon: Headphones,
            title: 'Live Chat',
            detail: 'Available Now',
            sub: 'Click the chat button below',
            color: 'text-green-400',
            bg: 'bg-green-400/10',
          },
        ].map((item) => (
          <div key={item.title} className="glass-card rounded-xl p-4 flex items-start gap-3">
            <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
              <item.icon size={18} className={item.color} />
            </div>
            <div>
              <p className="text-sm font-semibold">{item.title}</p>
              <p className={`text-sm ${item.color} font-medium`}>{item.detail}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Live Chat Widget */}
      {/* Chat Toggle Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full btn-primary flex items-center justify-center shadow-2xl glow-gold hover:scale-110 transition-transform"
          aria-label="Open live chat"
        >
          <MessageCircle size={22} />
        </button>
      )}

      {/* Chat Window */}
      {chatOpen && (
        <div
          className={`fixed right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-border transition-all duration-300 ${
            chatMinimized ? 'bottom-6 h-14' : 'bottom-6 h-[520px]'
          }`}
          style={{ background: 'var(--card)' }}
        >
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 gold-gradient-bg flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
              <Headphones size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-black">PrimeBoost Support</p>
              <p className="text-xs text-black/70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" />
                Online — typically replies instantly
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setChatMinimized(!chatMinimized)}
                className="p-1.5 rounded-lg hover:bg-black/10 transition-colors"
                aria-label={chatMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                {chatMinimized ? <Maximize2 size={14} className="text-black" /> : <Minimize2 size={14} className="text-black" />}
              </button>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1.5 rounded-lg hover:bg-black/10 transition-colors"
                aria-label="Close chat"
              >
                <X size={14} className="text-black" />
              </button>
            </div>
          </div>

          {!chatMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-gold" style={{ background: 'var(--background)' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'agent' ? 'gold-gradient-bg' : 'bg-muted'
                      }`}
                    >
                      {msg.role === 'agent' ? (
                        <Bot size={13} className="text-black" />
                      ) : (
                        <User size={13} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div
                        className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'agent' ?'bg-muted text-foreground rounded-tl-sm' :'btn-primary rounded-tr-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 items-end">
                    <div className="w-7 h-7 rounded-full gold-gradient-bg flex items-center justify-center flex-shrink-0">
                      <Bot size={13} className="text-black" />
                    </div>
                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-3 py-2 flex gap-2 overflow-x-auto scrollbar-gold flex-shrink-0 border-t border-border/50">
                {['Order issue', 'Payment help', 'Refund request', 'Account problem'].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setChatInput(q);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 p-3 border-t border-border flex-shrink-0">
                <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" aria-label="Attach file">
                  <Paperclip size={16} />
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/50 transition-colors"
                />
                <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" aria-label="Emoji">
                  <Smile size={16} />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim()}
                  className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
