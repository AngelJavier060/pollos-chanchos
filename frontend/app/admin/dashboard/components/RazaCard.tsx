import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Image from 'next/image';
import { Raza } from './types/raza';

interface RazaCardProps {
  raza: Raza;
  onEdit: () => void;
  onDelete: () => void;
}

const RazaCard = ({ raza, onEdit, onDelete }: RazaCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{raza.nombre}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {raza.imagen_url && (
          <div className="relative w-full h-40 mb-4">
            <Image
              src={raza.imagen_url}
              alt={raza.nombre}
              fill
              className="object-cover rounded-md"
            />
          </div>
        )}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Tipo:</span>
            <span className="text-sm">{raza.tipo_animal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Peso Promedio:</span>
            <span className="text-sm">{raza.peso_promedio} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Tamaño:</span>
            <span className="text-sm">{raza.tamanio_promedio} cm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Madurez:</span>
            <span className="text-sm">{raza.edad_madurez} meses</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Crecimiento:</span>
            <span className="text-sm">{raza.tiempo_crecimiento} meses</span>
          </div>
          {raza.caracteristicas && (
            <div className="mt-2">
              <span className="text-sm font-medium">Características:</span>
              <p className="text-sm mt-1">{raza.caracteristicas}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RazaCard; 