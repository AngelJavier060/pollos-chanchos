'use client';

import { ChangeEvent, useRef } from 'react';
import { Button } from './button';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  name: string;
  value?: string | null;
  onChange: (url: string | null) => void;
}

export const ImageUpload = ({ name, value, onChange }: ImageUploadProps) => {
  const fileRef = useRef<HTMLInputElement>(null);

  // Función para obtener la URL completa
  const getFullImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('data:')) return url;
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={getFullImageUrl(value) || ''}
            alt="Preview"
            fill
            className="object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2"
            onClick={() => onChange(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Subir Imagen
        </Button>
      )}
    </div>
  );
}; 