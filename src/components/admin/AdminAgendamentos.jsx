import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, X } from 'lucide-react';
import { agendamentosApi } from '@/lib/api';

const AdminAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchAgendamentos = async () => {
    try {
      const data = await agendamentosApi.getAll();
      const sorted = (data || []).sort((a, b) => {
        if (a.data !== b.data) return b.data.localeCompare(a.data);
        return a.hora_inicio.localeCompare(b.hora_inicio);
      });
      setAgendamentos(sorted);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const handleCancelAgendamento = async (id) => {
    setCancellingId(id);
    try {
      await agendamentosApi.update(id, { status: 'cancelado' });
      toast.success('Agendamento cancelado com sucesso');
      fetchAgendamentos();
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      toast.error('Erro ao cancelar agendamento');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pendente: { label: 'Pendente', variant: 'secondary' },
      confirmado: { label: 'Confirmado', variant: 'default' },
      cancelado: { label: 'Cancelado', variant: 'destructive' },
      concluido: { label: 'Concluído', variant: 'outline' },
    };
    const { label, variant } = statusMap[status] || { label: status, variant: 'secondary' };
    return <Badge variant={variant}>{label}</Badge>;
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
      <CardHeader>
        <CardTitle>Gerenciar Agendamentos</CardTitle>
        <CardDescription>Visualize e cancele agendamentos de todos os clientes</CardDescription>
      </CardHeader>
      <CardContent>
        {agendamentos.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Nenhum agendamento encontrado</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Barbeiro</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agendamentos.map((agendamento) => (
                  <TableRow key={agendamento.id}>
                    <TableCell>
                      {format(new Date(agendamento.data + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{agendamento.hora_inicio?.slice(0, 5)}</TableCell>
                    <TableCell>{agendamento.cliente?.nome || agendamento.cliente_id || 'N/A'}</TableCell>
                    <TableCell>{agendamento.barbeiro?.nome || agendamento.barbeiro_id || 'N/A'}</TableCell>
                    <TableCell>{agendamento.servico?.nome || agendamento.servico_id || 'N/A'}</TableCell>
                    <TableCell>R$ {agendamento.servico?.preco?.toFixed(2) || '0,00'}</TableCell>
                    <TableCell>{getStatusBadge(agendamento.status || 'pendente')}</TableCell>
                    <TableCell>
                      {agendamento.status !== 'cancelado' && agendamento.status !== 'concluido' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              disabled={cancellingId === agendamento.id}
                            >
                              {cancellingId === agendamento.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja cancelar este agendamento?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Voltar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleCancelAgendamento(agendamento.id)}>
                                Cancelar Agendamento
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAgendamentos;
