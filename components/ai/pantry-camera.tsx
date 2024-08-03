'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';
import { useSession } from 'next-auth/react';
import { usePantry } from '@/hooks/usePantry';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { client } from '@/lib/supabase';
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput
} from '@/components/ui/dropzone';

export function PantryCamera() {
  const { data: session } = useSession();
  const [clickable, setClickable] = useState(false);
  const [detectedItems, setDetectedItems] = useState<
    { label: string; score: number }[]
  >([]);
  const { toast } = useToast();

  const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setClickable(false);
    const file = (document.getElementById('picture') as HTMLInputElement)
      .files?.[0];
    if (file) {
      toast({
        title: 'Uploading image',
        description: 'Please wait while we upload the image'
      });

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('/api/classify', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (result.error == 'Model nateraw/food is currently loading') {
          toast({
            title: 'Error',
            description: `The AI model is currently loading, please try again in ${result.estimated_time} seconds.`,
            variant: 'destructive'
          });
        } else {
          setDetectedItems(result);
        }
        console.log(result);
        setDetectedItems(result);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: 'Error',
          description: 'Failed to upload image',
          variant: 'destructive'
        });
      }
    }
  };

  const handleAdd = async (item: { label: string; score: number }) => {
    const { error } = await client.supabase.from('pantry_items').insert({
      name: item.label
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      quantity: 1,
      owner: btoa(session?.user?.email as string)
    });

    if (error) {
      return toast({
        title: 'Error',
        description: 'There was an error adding the item',
        variant: 'destructive'
      });
    } else {
      return toast({
        title: 'Success',
        description: `Added 1 "${item.label
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}" to your pantry.`,
        variant: 'default'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fill your pantry from an image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid items-center gap-1.5 space-y-2">
          <Label htmlFor="picture">Upload your image here</Label>
          <div className="grid w-full grid-cols-2 grid-rows-1 gap-4">
            <Input
              id="picture"
              type="file"
              className="cursor-pointer"
              accept="image/*"
              onChange={() => setClickable(true)}
            />
            <Button
              id="upload-button"
              disabled={!clickable}
              onClick={handleUpload}
            >
              Upload
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detectedItems.map((item) => (
              <TableRow key={item.score}>
                <TableCell>
                  {item.label
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </TableCell>
                <TableCell>
                  {Math.round(item.score * 100).toFixed(0)}%
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleAdd(item)}>Add</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
