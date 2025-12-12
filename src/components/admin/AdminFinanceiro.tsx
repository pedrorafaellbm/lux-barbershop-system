import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, DollarSign, TrendingUp, CreditCard } from 'lucide-react';

interface Pagamento {
  id: string;
  valor: number;
  metodo: string;
  data_pagamento: string;
  agendamentos: {
    data: string;
    profiles: { nome: string } | null;
    servicos: { nome: string } | null;
  } | null;
}

const AdminFinanceiro = () => {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes');
  const [totalReceita, setTotalReceita] = useState(0);

  const fetchPagamentos = async () => {
    setLoading(true);
    try {
      let startDate: Date;
      let endDate: Date;

      if (periodo === 'mes') {
        startDate = startOfMonth(new Date());
        endDate = endOfMonth(new Date());
      } else {
        startDate = startOfYear(new Date());
        endDate = endOfYear(new Date());
      }

      const { data, error } = await supabase
        .from('pagamentos')
        .select(`
          *,
          agendamentos:agendamento_id(
            data,
            profiles:cliente_id(nome),
            servicos:servico_id(nome)
          )
        `)
        .gte('data_pagamento', startDate.toISOString())
        .lte('data_pagamento', endDate.toISOString())
        .order('data_pagamento', { ascending: false });

      if (error) throw error;

      setPagamentos(data || []);
      const total = (data || []).reduce((acc, p) => acc + Number(p.valor), 0);
      setTotalReceita(total);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      toast.error('Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagamentos();
  }, [periodo]);

  const getMetodoLabel = (metodo: string) => {
    const metodos: Record<string, string> = {
      dinheiro: 'Dinheiro',
      pix: 'PIX',
      cartao_debito: 'Débito',
      cartao_credito: 'Crédito',
    };
    return metodos[metodo] || metodo;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Controle Financeiro</h2>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mes">Este Mês</SelectItem>
            <SelectItem value="ano">Este Ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gold">
              R$ {totalReceita.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {periodo === 'mes' ? 'Este mês' : 'Este ano'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <TrendingUp className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagamentos.length}</div>
            <p className="text-xs text-muted-foreground">
              Pagamentos recebidos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <CreditCard className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {pagamentos.length > 0 ? (totalReceita / pagamentos.length).toFixed(2) : '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">Por atendimento</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>Lista de todos os pagamentos recebidos</CardDescription>
        </CardHeader>
        <CardContent>
          {pagamentos.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhum pagamento encontrado no período
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagamentos.map((pagamento) => (
                    <TableRow key={pagamento.id}>
                      <TableCell>
                        {pagamento.data_pagamento 
                          ? format(new Date(pagamento.data_pagamento), "dd/MM/yyyy", { locale: ptBR })
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{pagamento.agendamentos?.profiles?.nome || 'N/A'}</TableCell>
                      <TableCell>{pagamento.agendamentos?.servicos?.nome || 'N/A'}</TableCell>
                      <TableCell>{getMetodoLabel(pagamento.metodo)}</TableCell>
                      <TableCell className="font-semibold text-gold">
                        R$ {Number(pagamento.valor).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFinanceiro;
