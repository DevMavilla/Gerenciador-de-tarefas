//### 7. utils.js
//- **Responsabilidade**: Funções utilitárias reutilizáveis.
//- **Funcionalidades**:
//  - `formatDate()`: Formata uma string de data para o formato DD/MM/AAAA.
//  - `formatTime()`: Formata uma string de tempo para HH:MM.
//  - `getPriorityIcon()`: Retorna um emoji baseado na prioridade.
//  - `generateId()`: Gera um ID único para tarefas.
//  - `isOverdue()`: Verifica se uma tarefa está atrasada.
//  - `getFormattedHeaderDate()`: Retorna a data formatada para o cabeçalho.











// utils.js
// Formatar data para DD/MM/AAAA
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch {
    return dateString;
  }
};

// Formatar hora para HH:MM
export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString.substring(0, 5);
};

// Obter ícone de prioridade
export const getPriorityIcon = (priority) => {
  const icons = {
    high: '🔥',
    medium: '⚠️',
    low: '💧'
  };
  return icons[priority] || '⬤';
};

// Gerar ID único
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Verificar se tarefa está atrasada
export const isOverdue = (date, time) => {
  if (!date) return false;
  
  const now = new Date();
  const taskDate = new Date(`${date}T${time || '23:59'}`);
  
  return now > taskDate;
};

// Obter rótulo de recorrência
export const getRecurrenceLabel = (recurrence) => {
  const labels = {
    daily: 'diariamente',
    weekly: 'semanalmente',
    monthly: 'mensalmente',
    yearly: 'anualmente'
  };
  return labels[recurrence] || recurrence;
};

// Mostrar notificação (fallback se UI não estiver carregada)
export const showNotification = (message, type = 'info') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  alert(message); // Fallback básico
};