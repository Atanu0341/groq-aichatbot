'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from 'lucide-react';
import { toast } from 'sonner';

export default function Chat() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onError: (err) => {
      console.error('Chat error:', err);
      setErrorMessage(err.message || 'An unknown error occurred');
      toast.error('An error occurred while sending your message');
    },
  });
  const [isTyping, setIsTyping] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      setIsTyping(true);
      setErrorMessage(null);
      try {
        await handleSubmit(e);
        console.log('Message sent successfully');
      } catch (err) {
        console.error('Error sending message:', err);
        setErrorMessage(err instanceof Error ? err.message : 'Failed to send message');
        toast.error('Failed to send message');
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Groq AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[60vh]">
            <div className="flex flex-col gap-4 p-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                      ${m.role === 'user' ? 'bg-blue-500' : 'bg-gray-200'}`}
                  >
                    {m.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-gray-700" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[85%] ${
                      m.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    Typing...
                  </div>
                </div>
              )}
              {errorMessage && (
                <div className="text-red-500 text-center p-2 bg-red-50 rounded-lg">
                  Error: {errorMessage}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={onSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-grow"
              disabled={isTyping}
            />
            <Button type="submit" disabled={isTyping}>
              <Send className="w-4 h-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
      <div className="fixed bottom-4 right-4">
        <div className="text-xs text-gray-500">Powered by Groq</div>
      </div>
    </div>
  );
}
