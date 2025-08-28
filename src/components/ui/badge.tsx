// import { useState, useRef, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { 
//   MessageCircle, 
//   Send, 
//   X, 
//   Bot, 
//   User, 
//   Loader2,
//   Database,
//   TrendingUp,
//   AlertTriangle,
//   Thermometer
// } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

// interface Message {
//   id: string;
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: Date;
//   type?: 'text' | 'data' | 'error';
// }

// interface ChatbotPanelProps {
//   isOpen: boolean;
//   onToggle: () => void;
// }

// export const ChatbotPanel = ({ isOpen, onToggle }: ChatbotPanelProps) => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       role: 'assistant',
//       content: 'Hello! I\'m your HVAC system assistant. I can help you analyze data, explain system behavior, and provide insights about your chiller unit. What would you like to know?',
//       timestamp: new Date(),
//       type: 'text'
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [sessionId] = useState(() => `session_${Date.now()}`);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const { toast } = useToast();

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const suggestedQueries = [
//     {
//       text: "Show last 1 hour LP/HP vs setpoints",
//       icon: TrendingUp,
//       category: "Analytics"
//     },
//     {
//       text: "Why is ΔT low right now?",
//       icon: Thermometer,
//       category: "Diagnostics"
//     },
//     {
//       text: "List active faults and probable causes",
//       icon: AlertTriangle,
//       category: "Alarms"
//     },
//     {
//       text: "Trend blower speed and supply temp for 24h",
//       icon: Database,
//       category: "Data Query"
//     }
//   ];

//   const sendMessage = async (messageText: string) => {
//     if (!messageText.trim() || isLoading) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: messageText.trim(),
//       timestamp: new Date(),
//       type: 'text'
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       // Call the webhook endpoints
//       const response = await fetch('https://pretty-definitely-gazelle.ngrok-free.app/webhook/lovable-webhook', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           message: messageText,
//           session_id: sessionId,
//           user_id: 'dashboard_user',
//           image_url: null,
//           image_base64: null
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
      
//       let assistantContent = 'I apologize, but I received an unexpected response format.';
//       let messageType: 'text' | 'data' | 'error' = 'text';

//       if (data.success && data.data?.message) {
//         assistantContent = data.data.message;
        
//         // Check if the response contains structured data (JSON)
//         try {
//           const parsedMessage = JSON.parse(data.data.message);
//           if (parsedMessage && typeof parsedMessage === 'object') {
//             messageType = 'data';
//             assistantContent = JSON.stringify(parsedMessage, null, 2);
//           }
//         } catch {
//           // Not JSON, treat as regular text
//           messageType = 'text';
//         }
//       } else if (data.message) {
//         assistantContent = data.message;
//       }

//       const assistantMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: assistantContent,
//         timestamp: new Date(),
//         type: messageType
//       };

//       setMessages(prev => [...prev, assistantMessage]);

//     } catch (error) {
//       console.error('Error sending message:', error);
      
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: 'I\'m experiencing connectivity issues. Please check that the n8n webhook is accessible and try again. For now, I can help explain the dashboard data you see.',
//         timestamp: new Date(),
//         type: 'error'
//       };

//       setMessages(prev => [...prev, errorMessage]);
      
//       toast({
//         title: "Connection Error",
//         description: "Unable to reach the AI assistant. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     sendMessage(input);
//   };

//   const handleSuggestedQuery = (query: string) => {
//     sendMessage(query);
//   };

//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit',
//       timeZone: 'Asia/Kolkata'
//     });
//   };

//   const renderMessage = (message: Message) => {
//     const isUser = message.role === 'user';
    
//     return (
//       <div key={message.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
//         {!isUser && (
//           <div className="flex-shrink-0">
//             <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
//               <Bot className="w-4 h-4 text-primary-foreground" />
//             </div>
//           </div>
//         )}
        
//         <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
//           <div className={`p-3 rounded-lg ${
//             isUser 
//               ? 'bg-primary text-primary-foreground ml-auto' 
//               : message.type === 'error'
//                 ? 'bg-destructive/10 border border-destructive/20'
//                 : message.type === 'data'
//                   ? 'bg-muted border border-border'
//                   : 'glass-panel'
//           }`}>
//             {message.type === 'data' ? (
//               <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono">
//                 {message.content}
//               </pre>
//             ) : (
//               <p className="text-sm">{message.content}</p>
//             )}
//           </div>
//           <div className="text-xs text-muted-foreground mt-1 px-2">
//             {formatTime(message.timestamp)}
//           </div>
//         </div>
        
//         {isUser && (
//           <div className="flex-shrink-0">
//             <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
//               <User className="w-4 h-4 text-secondary-foreground" />
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       {/* Chat Toggle Button */}
//       <div className="fixed bottom-4 right-4 z-50">
//         <Button
//           onClick={onToggle}
//           size="lg"
//           className="rounded-full w-14 h-14 glow-primary"
//         >
//           {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
//         </Button>
//       </div>

//       {/* Chat Panel */}
//       {isOpen && (
//         <div className="fixed right-4 bottom-20 w-96 h-[600px] z-40 glass-card border border-border/50 rounded-lg overflow-hidden">
//           <CardHeader className="pb-3">
//             <CardTitle className="flex items-center">
//               <Bot className="w-5 h-5 mr-2 text-primary" />
//               HVAC Assistant
//               <Badge variant="secondary" className="ml-auto">
//                 Online
//               </Badge>
//             </CardTitle>
//           </CardHeader>
          
//           <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
//             {/* Messages Area */}
//             <ScrollArea className="flex-1 p-4">
//               {messages.map(renderMessage)}
              
//               {/* Suggested Queries */}
//               {messages.length === 1 && (
//                 <div className="mt-6">
//                   <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
//                   <div className="space-y-2">
//                     {suggestedQueries.map((query, index) => {
//                       const IconComponent = query.icon;
//                       return (
//                         <button
//                           key={index}
//                           onClick={() => handleSuggestedQuery(query.text)}
//                           className="w-full text-left p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border/30"
//                         >
//                           <div className="flex items-center gap-2">
//                             <IconComponent className="w-4 h-4 text-primary" />
//                             <span className="text-sm">{query.text}</span>
//                           </div>
//                           <Badge variant="outline" className="text-xs mt-1">
//                             {query.category}
//                           </Badge>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
              
//               {isLoading && (
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
//                     <Bot className="w-4 h-4 text-primary-foreground" />
//                   </div>
//                   <div className="glass-panel p-3 rounded-lg">
//                     <div className="flex items-center gap-2">
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       <span className="text-sm">Analyzing...</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               <div ref={messagesEndRef} />
//             </ScrollArea>
            
//             {/* Input Area */}
//             <div className="p-4 border-t border-border/50">
//               <form onSubmit={handleSubmit} className="flex gap-2">
//                 <Input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   placeholder="Ask about system performance..."
//                   disabled={isLoading}
//                   className="flex-1"
//                 />
//                 <Button 
//                   type="submit" 
//                   size="icon"
//                   disabled={isLoading || !input.trim()}
//                 >
//                   <Send className="w-4 h-4" />
//                 </Button>
//               </form>
//               <p className="text-xs text-muted-foreground mt-2">
//                 Connected to n8n AI agent for real-time analysis
//               </p>
//             </div>
//           </CardContent>
//         </div>
//       )}
//     </>
//   );
// };

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
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
  Thermometer,
  Maximize2,
  Minimize2,
  History,
  Plus,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'data' | 'error';
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
}
interface ChatbotPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatbotPanel = ({ isOpen, onToggle }: ChatbotPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();


  // Initialize default welcome message
  const getWelcomeMessage = (): Message => ({
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m your HVAC system assistant. I can help you analyze data, explain system behavior, and provide insights about your chiller unit. What would you like to know?',
    timestamp: new Date(),
    type: 'text'
  });

  // Load chat histories from localStorage on mount
  useEffect(() => {
    const savedHistories = localStorage.getItem('chatbot-histories');
    if (savedHistories) {
      try {
        const parsed = JSON.parse(savedHistories).map((h: any) => ({
          ...h,
          createdAt: new Date(h.createdAt),
          lastUpdated: new Date(h.lastUpdated),
          messages: h.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
        setChatHistories(parsed);
        
        // Load the most recent chat or create new one
        if (parsed.length > 0) {
          const mostRecent = parsed[0];
          setCurrentChatId(mostRecent.id);
          setMessages(mostRecent.messages);
        } else {
          createNewChat();
        }
      } catch (error) {
        console.error('Error loading chat histories:', error);
        createNewChat();
      }
    } else {
      createNewChat();
    }
  }, []);

  // Save chat histories to localStorage
  useEffect(() => {
    if (chatHistories.length > 0) {
      localStorage.setItem('chatbot-histories', JSON.stringify(chatHistories));
    }
  }, [chatHistories]);

  // Update current chat when messages change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      setChatHistories(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? {
              ...chat,
              messages,
              lastUpdated: new Date(),
              title: generateChatTitle(messages)
            }
          : chat
      ));
    }
  }, [messages, currentChatId]);

  const generateChatTitle = (msgs: Message[]): string => {
    const firstUserMessage = msgs.find(m => m.role === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.length > 30 
        ? firstUserMessage.content.substring(0, 30) + '...'
        : firstUserMessage.content;
    }
    return `Chat ${new Date().toLocaleDateString()}`;
  };

  const createNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    const welcomeMessage = getWelcomeMessage();
    
    const newChat: ChatHistory = {
      id: newChatId,
      title: `New Chat`,
      messages: [welcomeMessage],
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    setChatHistories(prev => {
      const updated = [newChat, ...prev];
      // Keep only the 5 most recent chats
      return updated.slice(0, 5);
    });
    
    setCurrentChatId(newChatId);
    setMessages([welcomeMessage]);
  };

  const switchToChat = (chatId: string) => {
    const chat = chatHistories.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
    }
  };

  const deleteChat = (chatId: string) => {
    setChatHistories(prev => {
      const filtered = prev.filter(c => c.id !== chatId);
      
      // If we're deleting the current chat, switch to another or create new
      if (chatId === currentChatId) {
        if (filtered.length > 0) {
          const nextChat = filtered[0];
          setCurrentChatId(nextChat.id);
          setMessages(nextChat.messages);
        } else {
          createNewChat();
        }
      }
      
      return filtered;
    });
  };

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
      // Update: Pass x-session-id in headers for n8n to use
      const response = await fetch('https://4fae5e07d84a.ngrok-free.app/webhook/lovable-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId // Add session ID to headers
        },
        body: JSON.stringify({
          message: messageText,
          user_id: 'dashboard_user',
          image_url: null,
          image_base64: null
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      let assistantContent = 'I apologize, but I received an unexpected response format from the AI.';
      let messageType: 'text' | 'data' | 'error' = 'text';

      // Prefer explicit message from backend
      let raw = (data && (data.message ?? data.output ?? data.data?.message ?? data.data?.output)) as unknown;
      if (raw == null) {
        // fallback to whole payload
        raw = data;
      }
      // if raw is an object wrapping text, try common fields
      if (raw && typeof raw === 'object') {
        const obj = raw as Record<string, unknown>;
        const inner = (obj.message ?? obj.output ?? obj.text ?? obj.content) as unknown;
        if (typeof inner === 'string') {
          raw = inner;
        }
      }

      if (typeof raw === 'string') {
        assistantContent = raw;
        try {
          const parsedMessage = JSON.parse(raw);
          if (parsedMessage && typeof parsedMessage === 'object') {
            // Only treat as data if it's clearly structured (table/array/object with keys)
            const isTable = parsedMessage.type === 'table' && Array.isArray((parsedMessage as any).columns) && Array.isArray((parsedMessage as any).rows);
            const isArray = Array.isArray(parsedMessage);
            const hasKeys = !isArray && Object.keys(parsedMessage as any).length > 0;
            if (isTable || isArray || hasKeys) {
              messageType = 'data';
              assistantContent = JSON.stringify(parsedMessage, null, 2);
            } else {
              messageType = 'text';
              assistantContent = String(raw);
            }
          }
        } catch {
          messageType = 'text';
        }
      } else {
        try {
          const parsedObj = raw as Record<string, unknown>;
          if (parsedObj && typeof parsedObj === 'object') {
            const hasKeys = Object.keys(parsedObj).length > 0;
            if (hasKeys) {
              messageType = 'data';
              assistantContent = JSON.stringify(parsedObj, null, 2);
            } else {
              messageType = 'text';
              assistantContent = '';
            }
          }
        } catch {
          // stringify any other
          assistantContent = String(raw);
          messageType = 'text';
        }
      }

      // Ensure non-empty content for display
      if (typeof assistantContent === 'string' && assistantContent.trim().length === 0) {
        assistantContent = 'No response received.';
        messageType = 'error';
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
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
        
        <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
            <div className={`p-3 rounded-lg ${
            isUser 
              ? 'bg-blue-600 text-white ml-auto' 
              : message.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-800'
                : message.type === 'data'
                  ? 'bg-gray-50 border border-gray-200 text-gray-900'
                  : 'bg-gray-50 border border-gray-200 text-gray-900'
          }`}>
            {message.type === 'data' ? (
              (() => {
                try {
                  const parsed = JSON.parse(message.content || '{}');
                  const isTable = parsed && parsed.type === 'table' && Array.isArray(parsed.columns) && Array.isArray(parsed.rows);
                  if (!isTable) {
                    return (
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono">{message.content}</pre>
                    );
                  }
                  const columns: string[] = parsed.columns;
                  const rows: any[] = parsed.rows;
                  const title: string | undefined = typeof parsed.title === 'string' ? parsed.title : undefined;
                  return (
                    <div className="max-w-full overflow-x-auto">
                      <Table className="min-w-[480px]">
                        {title ? <TableCaption>{title}</TableCaption> : null}
                        <TableHeader>
                          <TableRow>
                            {columns.map((col: string, idx: number) => (
                              <TableHead key={idx}>{col}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rows.map((row: any, rIdx: number) => (
                            <TableRow key={rIdx}>
                              {columns.map((col: string, cIdx: number) => (
                                <TableCell key={cIdx}>{row && typeof row === 'object' ? String(row[col] ?? '') : ''}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  );
                } catch {
                  return (
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono">{message.content}</pre>
                  );
                }
              })()
            ) : (
              <p className="text-sm">{message.content}</p>
            )}
          </div>
                    <div className="text-xs text-gray-500 mt-1 px-2">
            {formatTime(message.timestamp)}
          </div>
        </div>
        
        {isUser && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
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

      {/* Chat Panel - Always Light Mode */}
      {isOpen && !isExpanded && (
        <div className="fixed right-4 bottom-20 w-96 h-[600px] z-40 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xl">
          <CardHeader className="pb-3 border-b border-gray-200">
            <CardTitle className="flex items-center text-gray-900">
              <Bot className="w-5 h-5 mr-2 text-blue-600" />
              HVAC Assistant
               <div className="ml-auto flex items-center gap-2">
                <Button
                  onClick={() => setIsExpanded(true)}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Online
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {messages.map(renderMessage)}
              
              {/* Suggested Queries */}
              {messages.length === 1 && (
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-3">Try asking:</p>
                  <div className="space-y-2">
                    {suggestedQueries.map((query, index) => {
                      const IconComponent = query.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuery(query.text)}
                          className="w-full text-left p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-900">{query.text}</span>
                          </div>
                          <Badge variant="outline" className="text-xs mt-1 border-gray-300 text-gray-600">
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
                   <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-900">Analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            {/* Input Area */}
             <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about system performance..."
                  disabled={isLoading}
                  className="flex-1 border-gray-300 bg-white text-gray-900 placeholder:text-gray-500"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-2">
                Connected to n8n AI agent for real-time analysis
              </p>
            </div>
          </CardContent>
        </div>
      )}

      {/* Expanded Full-Screen Mode */}
      {isOpen && isExpanded && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-full flex">
            {/* Chat History Sidebar */}
            <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <History className="w-4 h-4 mr-2" />
                    Chat History
                  </h3>
                  <Button
                    onClick={() => setIsExpanded(false)}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={createNewChat}
                  size="sm"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              </div>

              {/* Chat History List */}
              <ScrollArea className="flex-1 p-2">
                <div className="space-y-2">
                  {chatHistories.map((chat) => (
                    <div
                      key={chat.id}
                      className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                        chat.id === currentChatId
                          ? 'bg-blue-100 border border-blue-200'
                          : 'bg-white hover:bg-gray-100 border border-gray-200'
                      }`}
                      onClick={() => switchToChat(chat.id)}
                    >
                      <div className="pr-8">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {chat.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {chat.lastUpdated.toLocaleDateString()} • {chat.messages.length} messages
                        </p>
                      </div>
                      {chatHistories.length > 1 && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chat.id);
                          }}
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center">
                  <Bot className="w-6 h-6 mr-3 text-blue-600" />
                  <div>
                    <h2 className="font-semibold text-gray-900">HVAC Assistant</h2>
                    <p className="text-sm text-gray-500">AI-powered system analysis</p>
                  </div>
                  <Badge className="ml-auto bg-green-100 text-green-800 hover:bg-green-100">
                    Online
                  </Badge>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                  {messages.map(renderMessage)}
                  
                  {/* Suggested Queries */}
                  {messages.length === 1 && (
                    <div className="mt-8">
                      <p className="text-base text-gray-500 mb-4">Try asking:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {suggestedQueries.map((query, index) => {
                          const IconComponent = query.icon;
                          return (
                            <button
                              key={index}
                              onClick={() => handleSuggestedQuery(query.text)}
                              className="text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <IconComponent className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-gray-900">{query.text}</span>
                              </div>
                              <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                                {query.category}
                              </Badge>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          <span className="text-base text-gray-900">Analyzing your request...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Input Area */}
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="max-w-4xl mx-auto">
                  <form onSubmit={handleSubmit} className="flex gap-3">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about system performance, diagnostics, or data analysis..."
                      disabled={isLoading}
                      className="flex-1 border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 h-12 text-base"
                    />
                    <Button 
                      type="submit" 
                      size="lg"
                      disabled={isLoading || !input.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Connected to n8n AI agent for real-time HVAC system analysis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
