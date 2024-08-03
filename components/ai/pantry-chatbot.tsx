'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

export function PantryChatbot({ items }: { items: { name: string }[] }) {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestRecipe = async () => {
    setIsLoading(true);
    setResponse('');
    
    try {
      const itemNames = items.map(item => item.name);
      
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: itemNames }),
      });

      if (!res.ok) throw new Error('Failed to fetch recipe suggestion');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        lines.forEach((line) => {
          if (line.startsWith('data: ')) {
            const jsonData = line.slice(6);
            try {
              const text = JSON.parse(jsonData);
              setResponse((prev) => prev + text);
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error generating recipe suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to generate recipe suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearRecipe = async () => {
    setResponse('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Recipe Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Your pantry contains: {items.map(item => item.name).join(', ')}</p>
        <p>Click the button below to get an AI-generated recipe suggestion based on your available ingredients!</p>
        <div className="grid grid-rows-1 grid-cols-2 gap-4">
          <Button onClick={handleSuggestRecipe} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Suggest Recipe'}
          </Button>
          <Button onClick={handleClearRecipe} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Clear Recipe'}
          </Button>
        </div>

        {response && (
          <div className="mt-4">
            <h3 className="font-bold">Suggestion:</h3>
            <p className="whitespace-pre-wrap"><ReactMarkdown>{response}</ReactMarkdown></p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}