//### 4. tasks.js
//- **Responsabilidade**: Lógica de negócios relacionada a tarefas.
//- **Funcionalidades**:
//  - `createTask()`: Cria uma nova tarefa e adiciona ao estado.
//  - `moveTask()`: Move uma tarefa entre colunas (e marca como concluída se for para a coluna "done"). 
//  - `deleteTask()`: Remove uma tarefa.
//  - `updateTask()`: Atualiza os dados de uma tarefa.
//  - `startDeadlineChecker()`: Inicia um timer para verificar tarefas atrasadas a cada minuto.



// tasks.js
import { State } from './state.js';
import { saveState } from './storage.js';
import { updateUserStats, applyOverduePenalty } from './gamification.js';
import { generateId, isOverdue, showNotification } from './utils.js';

export const createTask = (taskData) => {
  const newTask = {
    id: generateId(),
    ...taskData,
    createdAt: new Date().toISOString(),
    completed: false,
    overdue: false,
    column: 'todo'
  };
  
  // Verificar se já está atrasada
  if (taskData.date) {
    newTask.overdue = isOverdue(taskData.date, taskData.time);
  }
  
  State.tasks.push(newTask);
  saveState();
  
  showNotification(`Tarefa "${taskData.title}" criada!`, 'success');
  return newTask;
};

export const moveTask = (taskId, newColumn) => {
  const task = State.tasks.find(t => t.id === taskId);
  if (!task) return false;
  
  task.column = newColumn;
  
  // Marcar como concluída se movida para "done"
  if (newColumn === 'done') {
    task.completed = true;
    task.completedAt = new Date().toISOString();
    updateUserStats(task);
  }
  
  saveState();
  return true;
};

export const deleteTask = (taskId) => {
  State.tasks = State.tasks.filter(task => task.id !== taskId);
  saveState();
  showNotification('Tarefa removida!', 'success');
};

export const updateTask = (taskId, updates) => {
  const task = State.tasks.find(t => t.id === taskId);
  if (!task) return false;
  
  Object.assign(task, updates);
  
  // Atualizar status de atraso
  if (task.date) {
    task.overdue = isOverdue(task.date, task.time);
  }
  
  saveState();
  showNotification(`Tarefa "${task.title}" atualizada!`, 'success');
  return true;
};

// Verificador de prazos
export const startDeadlineChecker = () => {
  setInterval(() => {
    State.tasks.forEach(task => {
      if (!task.completed && !task.overdue && task.date) {
        if (isOverdue(task.date, task.time)) {
          task.overdue = true;
          applyOverduePenalty(task);
          showNotification(`Tarefa "${task.title}" está atrasada!`, 'error');
          saveState();
        }
      }
    });
  }, 60000); // Verifica a cada minuto
};