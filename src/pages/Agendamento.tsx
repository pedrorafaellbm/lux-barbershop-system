import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, X, Calendar as CalendarIcon, Clock, User, Scissors } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Agendamento = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [barbeiros, setBarbeiros] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [selectedBarbeiro, setSelectedBarbeiro] = useState('');
  const [selectedServico, setSelectedServico] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = useState('');
  const [loading, setLoading] = useState(false);
  const [meusAgendamentos, setMeusAgendamentos] = useState<any[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchBarbeiros();
    fetchServicos();
    if (user) {
      fetchMeusAgendamentos();
    }
  }, [user]);

  useEffect(() => {
    if (selectedDate && selectedBarbeiro) {
      fetchAvailableHours();
    }
  }, [selectedDate, selectedBarbeiro]);

  const fetchBarbeiros = async () => {
    try {
      const { data, error } = await supabase
        .from('barbeiros')
        .select('*')
        .eq('ativo', true);
      
      if (error) throw error;
      setBarbeiros(data || []);
    } catch (error) {
      console.error('Error fetching barbeiros:', error);
    }
  };

  const fetchServicos = async () => {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('ativo', true);
      
      if (error) throw error;
      setServicos(data || []);
    } catch (error) {
      console.error('Error fetching servicos:', error);
    }
  };

  const fetchAvailableHours = async () => {
    if (!selectedDate || !selectedBarbeiro) return;

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('agendamentos')
        .select('hora_inicio, hora_fim')
        .eq('barbeiro_id', selectedBarbeiro)
        .eq('data', dateStr)
        .neq('status', 'cancelado');

      if (error) throw error;

      const occupiedSlots = data || [];
      const allHours = generateTimeSlots();
      const available = allHours.filter(hour => {
        return !occupiedSlots.some(slot => {
          const slotStart = slot.hora_inicio.substring(0, 5);
          return slotStart === hour;
        });
      });

      setAvailableHours(available);
    } catch (error) {
      console.error('Error fetching available hours:', error);
    }
  };

  const generateTimeSlots = () => {
    const slots: string[] = [];
    const startHour = 10;
    const endHour = 18;
    const intervalMinutes = 40;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }

    return slots;
  };

  const fetchMeusAgendamentos = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile) return;

      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          barbeiros:barbeiro_id (nome),
          servicos:servico_id (nome, preco)
        `)
        .eq('cliente_id', profile.id)
        .neq('status', 'cancelado')
        .gte('data', new Date().toISOString().split('T')[0])
        .order('data', { ascending: true });

      if (error) throw error;
      setMeusAgendamentos(data || []);
    } catch (error) {
      console.error('Error fetching agendamentos:', error);
    }
  };

  const handleCancelAgendamento = async (agendamentoId: string) => {
    setCancellingId(agendamentoId);
    try {
      const { error } = await supabase
        .from('agendamentos')
        .update({ status: 'cancelado' })
        .eq('id', agendamentoId);

      if (error) throw error;

      toast.success('Agendamento cancelado com sucesso!');
      fetchMeusAgendamentos();
      fetchAvailableHours();
    } catch (error: any) {
      console.error('Error cancelling agendamento:', error);
      toast.error('Erro ao cancelar agendamento: ' + error.message);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pendente: { variant: 'secondary', label: 'Pendente' },
      confirmado: { variant: 'default', label: 'Confirmado' },
      concluido: { variant: 'outline', label: 'Concluído' },
      cancelado: { variant: 'destructive', label: 'Cancelado' },
    };
    const config = variants[status] || variants.pendente;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBarbeiro || !selectedServico || !selectedDate || !selectedHour) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;

      const selectedServicoData = servicos.find(s => s.id === selectedServico);
      const duracao = selectedServicoData?.duracao || 40;

      const [startHour, startMinute] = selectedHour.split(':');
      const endTime = new Date();
      endTime.setHours(parseInt(startHour), parseInt(startMinute) + duracao);
      const endHourStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

      const { error: agendamentoError } = await supabase
        .from('agendamentos')
        .insert({
          cliente_id: profile.id,
          barbeiro_id: selectedBarbeiro,
          servico_id: selectedServico,
          data: selectedDate.toISOString().split('T')[0],
          hora_inicio: selectedHour,
          hora_fim: endHourStr,
          status: 'pendente',
        });

      if (agendamentoError) throw agendamentoError;

      toast.success('Agendamento realizado com sucesso!');
      
      setSelectedBarbeiro('');
      setSelectedServico('');
      setSelectedDate(undefined);
      setSelectedHour('');
      setAvailableHours([]);
      fetchMeusAgendamentos();
    } catch (error: any) {
      console.error('Error creating agendamento:', error);
      toast.error('Erro ao criar agendamento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isDayDisabled = (date: Date) => {
    const day = date.getDay();
    return day === 0;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="font-serif text-5xl font-bold mb-4">
            <span className="text-gold">Agendar</span> Horário
          </h1>
          <p className="text-xl text-muted-foreground">
            Escolha o barbeiro, serviço, data e horário desejados
          </p>
        </div>

        <Card className="bg-card border-border shadow-elegant">
          <CardHeader>
            <CardTitle className="text-2xl">Novo Agendamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="barbeiro">Barbeiro</Label>
                <Select value={selectedBarbeiro} onValueChange={setSelectedBarbeiro}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um barbeiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {barbeiros.map((barbeiro) => (
                      <SelectItem key={barbeiro.id} value={barbeiro.id}>
                        {barbeiro.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="servico">Serviço</Label>
                <Select value={selectedServico} onValueChange={setSelectedServico}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicos.map((servico) => (
                      <SelectItem key={servico.id} value={servico.id}>
                        {servico.nome} - R$ {servico.preco.toFixed(2)} ({servico.duracao} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data</Label>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDayDisabled}
                    locale={ptBR}
                    className="rounded-md border border-border"
                    fromDate={new Date()}
                  />
                </div>
              </div>

              {availableHours.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="horario">Horário</Label>
                  <Select value={selectedHour} onValueChange={setSelectedHour}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableHours.map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gold text-background hover:bg-gold-dark"
                disabled={loading || !selectedBarbeiro || !selectedServico || !selectedDate || !selectedHour}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  'Confirmar Agendamento'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Meus Agendamentos Section */}
        {meusAgendamentos.length > 0 && (
          <Card className="bg-card border-border shadow-elegant mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Meus Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meusAgendamentos.map((agendamento) => (
                  <div
                    key={agendamento.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-background/50 gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CalendarIcon className="h-4 w-4 text-gold" />
                        <span className="font-medium">
                          {format(new Date(agendamento.data + 'T00:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                        <Clock className="h-4 w-4 text-gold ml-2" />
                        <span>{agendamento.hora_inicio.substring(0, 5)}</span>
                        {getStatusBadge(agendamento.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{agendamento.barbeiros?.nome}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Scissors className="h-3 w-3" />
                          <span>{agendamento.servicos?.nome}</span>
                        </div>
                        <span>R$ {agendamento.servicos?.preco?.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {agendamento.status !== 'concluido' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={cancellingId === agendamento.id}
                          >
                            {cancellingId === agendamento.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <X className="h-4 w-4 mr-1" />
                                Cancelar
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Voltar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancelAgendamento(agendamento.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Confirmar Cancelamento
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Agendamento;
