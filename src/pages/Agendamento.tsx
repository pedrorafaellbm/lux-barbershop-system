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
import { Loader2 } from 'lucide-react';
import { ptBR } from 'date-fns/locale';

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

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchBarbeiros();
    fetchServicos();
  }, []);

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
      </div>
    </div>
  );
};

export default Agendamento;
