'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Raza } from '../types/raza';
import { ImageUpload } from '@/app/components/ui/image-upload';
import { toast } from "@/app/components/ui/use-toast";

interface RazaFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  onCancel: () => void;
}

const RazaForm = ({ onSubmit, initialData, onCancel }: RazaFormProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_animal: '',
    peso_promedio: '',
    tamano_promedio: '',
    edad_madureza: '',
    tiempo_crecimiento: '',
    descripcion: '',
    imagen_url: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        tipo_animal: initialData.tipo_animal || '',
        peso_promedio: initialData.peso_promedio?.toString() || '',
        tamano_promedio: initialData.tamano_promedio?.toString() || '',
        edad_madureza: initialData.edad_madureza?.toString() || '',
        tiempo_crecimiento: initialData.tiempo_crecimiento?.toString() || '',
        descripcion: initialData.descripcion || '',
        imagen_url: initialData.imagen_url || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando datos:', formData); // Para debug
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="tipo_animal">Tipo de Animal</Label>
        <Select
          value={formData.tipo_animal}
          onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_animal: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pollo">Pollo</SelectItem>
            <SelectItem value="chancho">Chancho</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="peso_promedio">Peso Promedio</Label>
        <Input
          id="peso_promedio"
          type="number"
          value={formData.peso_promedio}
          onChange={(e) => setFormData(prev => ({ ...prev, peso_promedio: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="tamano_promedio">Tamaño Promedio</Label>
        <Input
          id="tamano_promedio"
          type="number"
          value={formData.tamano_promedio}
          onChange={(e) => setFormData(prev => ({ ...prev, tamano_promedio: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="edad_madureza">Edad de Madurez</Label>
        <Input
          id="edad_madureza"
          type="number"
          value={formData.edad_madureza}
          onChange={(e) => setFormData(prev => ({ ...prev, edad_madureza: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="tiempo_crecimiento">Tiempo de Crecimiento</Label>
        <Input
          id="tiempo_crecimiento"
          type="number"
          value={formData.tiempo_crecimiento}
          onChange={(e) => setFormData(prev => ({ ...prev, tiempo_crecimiento: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Imagen</Label>
        <ImageUpload
          name="imagen"
          value={formData.imagen_url}
          onChange={(url) => setFormData(prev => ({ ...prev, imagen_url: url }))}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

export default RazaForm; 