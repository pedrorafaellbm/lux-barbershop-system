import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Edit } from 'lucide-react';

interface Barbeiro {
  id: string;
  nome: string;
  foto: string | null;
  ativo: boolean;
}

const AdminBarbeiros = () => {
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBarbeiro, setEditingBarbeiro] = useState<Barbeiro | null>(null);
  const [formData, setFormData] = useState({ nome: '', foto: '', ativo: true });
  const [saving, setSaving] = useState(false);

  const fetchBarbeiros = async () => {
    try {
      const { data, error } = await supabase
        .from('barbeiros')
        .select('*')
        .order('nome');

      if (error) throw error;
      setBarbeiros(data || []);
    } catch (error) {
      console.error('Erro ao buscar barbeiros:', error);
      toast.error('Erro ao carregar barbeiros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbeiros();
  }, []);

  const handleOpenDialog = (barbeiro?: Barbeiro) => {
    if (barbeiro) {
      setEditingBarbeiro(barbeiro);
      setFormData({ nome: barbeiro.nome, foto: barbeiro.foto || '', ativo: barbeiro.ativo });
    } else {
      setEditingBarbeiro(null);
      setFormData({ nome: '', foto: '', ativo: true });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    setSaving(true);
    try {
      if (editingBarbeiro) {
        const { error } = await supabase
          .from('barbeiros')
          .update({ nome: formData.nome, foto: formData.foto || null, ativo: formData.ativo })
          .eq('id', editingBarbeiro.id);

        if (error) throw error;
        toast.success('Barbeiro atualizado com sucesso');
      } else {
        const { error } = await supabase
          .from('barbeiros')
          .insert({ nome: formData.nome, foto: formData.foto || null, ativo: formData.ativo });

        if (error) throw error;
        toast.success('Barbeiro adicionado com sucesso');
      }

      setDialogOpen(false);
      fetchBarbeiros();
    } catch (error) {
      console.error('Erro ao salvar barbeiro:', error);
      toast.error('Erro ao salvar barbeiro');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('barbeiros').delete().eq('id', id);
      if (error) throw error;
      toast.success('Barbeiro removido com sucesso');
      fetchBarbeiros();
    } catch (error) {
      console.error('Erro ao remover barbeiro:', error);
      toast.error('Erro ao remover barbeiro');
    }
  };

  const handleToggleAtivo = async (barbeiro: Barbeiro) => {
    try {
      const { error } = await supabase
        .from('barbeiros')
        .update({ ativo: !barbeiro.ativo })
        .eq('id', barbeiro.id);

      if (error) throw error;
      toast.success(barbeiro.ativo ? 'Barbeiro desativado' : 'Barbeiro ativado');
      fetchBarbeiros();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gerenciar Barbeiros</CardTitle>
          <CardDescription>Adicione, edite ou remova barbeiros</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-gold hover:bg-gold/90 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBarbeiro ? 'Editar Barbeiro' : 'Novo Barbeiro'}</DialogTitle>
              <DialogDescription>
                {editingBarbeiro ? 'Atualize os dados do barbeiro' : 'Preencha os dados do novo barbeiro'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome do barbeiro"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="foto">URL da Foto</Label>
                <Input
                  id="foto"
                  value={formData.foto}
                  onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
                <Label htmlFor="ativo">Ativo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={saving} className="bg-gold hover:bg-gold/90 text-black">
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {barbeiros.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Nenhum barbeiro cadastrado</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {barbeiros.map((barbeiro) => (
                <TableRow key={barbeiro.id}>
                  <TableCell className="font-medium">{barbeiro.nome}</TableCell>
                  <TableCell>
                    <Switch
                      checked={barbeiro.ativo}
                      onCheckedChange={() => handleToggleAtivo(barbeiro)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(barbeiro)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover Barbeiro</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover {barbeiro.nome}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(barbeiro.id)}>
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminBarbeiros;
