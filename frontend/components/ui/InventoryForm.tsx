'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './button';
import { Input } from './input';
import { Select } from './select';

interface InventoryFormProps {
  type: 'pollos' | 'chanchos';
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({
  type,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      peso: '',
      lote: '',
      estado: 'vivo',
      notas: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Peso (kg)
        </label>
        <Input
          type="number"
          step="0.01"
          {...register('peso', { required: 'El peso es requerido' })}
          className="mt-1"
        />
        {errors.peso && (
          <span className="text-red-500 text-sm">{errors.peso.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Lote
        </label>
        <Input
          type="text"
          {...register('lote', { required: 'El lote es requerido' })}
          className="mt-1"
        />
        {errors.lote && (
          <span className="text-red-500 text-sm">{errors.lote.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Estado
        </label>
        <Select
          {...register('estado')}
          className="mt-1"
        >
          <option value="vivo">Vivo</option>
          <option value="procesado">Procesado</option>
          <option value="vendido">Vendido</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notas
        </label>
        <textarea
          {...register('notas')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
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
