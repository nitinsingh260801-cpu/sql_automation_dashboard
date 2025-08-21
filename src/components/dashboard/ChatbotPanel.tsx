import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Loader2,
  Database,
  TrendingUp,
  AlertTriangle,
  Thermometer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'data' | 'error';
}

interface ChatbotPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatbotPanel = ({ isOpen, onToggle }: ChatbotPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your HVAC system assistant. I can help you analyze data, explain system behavior, and provide insights about your chiller unit. What would you like to know?',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQueries = [
    {
      text: "Show last 1 hour LP/HP vs setpoints",
      icon: TrendingUp,
      category: "Analytics"
    },
    {
      text: "Why is ΔT low right now?",
      icon: Thermometer,
      category: "Diagnostics"
    },
    {
      text: "List active faults and probable causes",
      icon: AlertTriangle,
      category: "Alarms"
    },
    {
      text: "Trend blower speed and supply temp for 24h",
      icon: Database,
      category: "Data Query"
    }
  ];

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the webhook endpoints
      const response = await fetch('https://pretty-definitely-gazelle.ngrok-free.app/webhook/chatbot-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          session_id: sessionId,
          user_id: 'dashboard_user',
          image_url: null,
          image_base64: null
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      let assistantContent = 'I apologize, but I received an unexpected response format.';
      let messageType: 'text' | 'data' | 'error' = 'text';

      if (data.success && data.data?.message) {
        assistantContent = data.data.message;
        
        // Check if the response contains structured data (JSON)
        try {
          const parsedMessage = JSON.parse(data.data.message);
          if (parsedMessage && typeof parsedMessage === 'object') {
            messageType = 'data';
            assistantContent = JSON.stringify(parsedMessage, null, 2);
          }
        } catch {
          // Not JSON, treat as regular text
          messageType = 'text';
        }
      } else if (data.message) {
        assistantContent = data.message;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        type: messageType
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m experiencing connectivity issues. Please check that the n8n webhook is accessible and try again. For now, I can help explain the dashboard data you see.',
        timestamp: new Date(),
        type: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to reach the AI assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestedQuery = (query: string) => {
    sendMessage(query);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    
    return (
      <div key={message.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        {!isUser && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        )}
        
        <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
          <div className={`p-3 rounded-lg ${
            isUser 
              ? 'bg-primary text-primary-foreground ml-auto' 
              : message.type === 'error'
                ? 'bg-destructive/10 border border-destructive/20'
                : message.type === 'data'
                  ? 'bg-muted border border-border'
                  : 'glass-panel'
          }`}>
            {message.type === 'data' ? (
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                {message.content}
              </pre>
            ) : (
              <p className="text-sm">{message.content}</p>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1 px-2">
            {formatTime(message.timestamp)}
          </div>
        </div>
        
        {isUser && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-4 h-4 text-secondary-foreground" />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggle}
          size="lg"
          className="rounded-full w-14 h-14 glow-primary"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed right-4 bottom-20 w-96 h-[600px] z-40 glass-card border border-border/50 rounded-lg overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Bot className="w-5 h-5 mr-2 text-primary" />
              HVAC Assistant
              <Badge variant="secondary" className="ml-auto">
                Online
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {messages.map(renderMessage)}
              
              {/* Suggested Queries */}
              {messages.length === 1 && (
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
                  <div className="space-y-2">
                    {suggestedQueries.map((query, index) => {
                      const IconComponent = query.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuery(query.text)}
                          className="w-full text-left p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border/30"
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-primary" />
                            <span className="text-sm">{query.text}</span>
                          </div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {query.category}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {isLoading && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="glass-panel p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            {/* Input Area */}
            <div className="p-4 border-t border-border/50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about system performance..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                Connected to n8n AI agent for real-time analysis
              </p>
            </div>
          </CardContent>
        </div>
      )}
    </>
  );
};
