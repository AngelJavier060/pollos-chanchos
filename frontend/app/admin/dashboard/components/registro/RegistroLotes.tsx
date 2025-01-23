'use client';

import { FC, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import { Calendar } from "../ui/calendar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Lote {
  id: number;
  codigo: string;
  fechaIngreso: string;
  raza: string;
  cantidad: number;
  costoUnitario: number;
  costoTotal: number;
  estado: 'activo' | 'finalizado';
}

const RegistroLotes: FC = () => {
  const { showToast } = useToast();
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLote, setEditingLote] = useState<Lote | null>(null);
  
  // Datos de ejemplo para las razas (esto vendría de tu configuración)
  const razasDisponibles = [
    { value: 'broiler', label: 'Pollo Broiler' },
    { value: 'criollo', label: 'Pollo Criollo' },
    { value: 'ross308', label: 'Ross 308' }
  ];

  const [formData, setFormData] = useState({
    codigo: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    raza: '',
    cantidad: 0,
    costoUnitario: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLote: Lote = {
      id: editingLote?.id || Date.now(),
      ...formData,
      costoTotal: formData.cantidad * formData.costoUnitario,
      estado: 'activo'
    };

    if (editingLote) {
      setLotes(lotes.map(lote => lote.id === editingLote.id ? newLote : lote));
      showToast("Lote actualizado exitosamente", "success");
    } else {
      setLotes([...lotes, newLote]);
      showToast("Nuevo lote registrado", "success");
    }

    setIsDialogOpen(false);
    setEditingLote(null);
    setFormData({
      codigo: '',
      fechaIngreso: new Date().toISOString().split('T')[0],
      raza: '',
      cantidad: 0,
      costoUnitario: 0
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este lote?')) {
      setLotes(lotes.filter(lote => lote.id !== id));
      showToast("Lote eliminado", "success");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registro de Lotes</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Lote
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingLote ? 'Editar Lote' : 'Registrar Nuevo Lote'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label>Código del Lote</label>
                    <Input
                      required
                      value={formData.codigo}
                      onChange={e => setFormData({...formData, codigo: e.target.value})}
                      placeholder="Ej: L001"
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Fecha de Ingreso</label>
                    <Input
                      type="date"
                      required
                      value={formData.fechaIngreso}
                      onChange={e => setFormData({...formData, fechaIngreso: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Raza</label>
                    <Select
                      required
                      value={formData.raza}
                      onChange={e => setFormData({...formData, raza: e.target.value})}
                    >
                      <option value="">Seleccionar Raza</option>
                      {razasDisponibles.map(raza => (
                        <option key={raza.value} value={raza.value}>
                          {raza.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label>Cantidad</label>
                    <Input
                      type="number"
                      required
                      min="1"
                      value={formData.cantidad}
                      onChange={e => setFormData({...formData, cantidad: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Costo Unitario (USD)</label>
                    <Input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={formData.costoUnitario}
                      onChange={e => setFormData({...formData, costoUnitario: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingLote ? 'Actualizar' : 'Registrar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {lotes.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No hay lotes registrados
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Fecha Ingreso</TableHead>
                  <TableHead>Raza</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Costo Unit.</TableHead>
                  <TableHead>Costo Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lotes.map(lote => (
                  <TableRow key={lote.id}>
                    <TableCell>{lote.codigo}</TableCell>
                    <TableCell>{new Date(lote.fechaIngreso).toLocaleDateString()}</TableCell>
                    <TableCell>{lote.raza}</TableCell>
                    <TableCell>{lote.cantidad}</TableCell>
                    <TableCell>${lote.costoUnitario.toFixed(2)}</TableCell>
                    <TableCell>${lote.costoTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        lote.estado === 'activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {lote.estado}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingLote(lote);
                            setFormData({
                              codigo: lote.codigo,
                              fechaIngreso: lote.fechaIngreso,
                              raza: lote.raza,
                              cantidad: lote.cantidad,
                              costoUnitario: lote.costoUnitario
                            });
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(lote.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistroLotes; 