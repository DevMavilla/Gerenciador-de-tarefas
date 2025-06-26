//### 6. ui.js
//- **Responsabilidade**: Tudo relacionado à interface do usuário.
//- **Funcionalidades**:
//  - `initUI()`: Inicializa a interface (renderiza tarefas, configura event listeners, inicia verificadores).
//  - `renderAll()`: Renderiza todas as partes da interface (tarefas e estatísticas do usuário).
//  - `renderTasks()`: Renderiza as tarefas nos quadros Kamban.
//  - `createTaskCard()`: Cria o elemento HTML para uma tarefa.
//  - `renderUserStats()`: Atualiza a exibição das estatísticas do usuário (energia, XP, etc.).
//  - `setupEventListeners()`: Configura todos os event listeners (botões, modal, drag and drop).
//  - `openTaskModal()`, `closeTaskModal()`: Controla a exibição do modal de tarefas.
//  - `handleTaskFormSubmit()`: Lida com o envio do formulário de tarefas (cria ou atualiza).
//  - `setupDragAndDrop()`: Configura os eventos de drag and drop.




// ui.js
import { State } from './state.js';
import { createTask, moveTask, deleteTask, updateTask, startDeadlineChecker } from './tasks.js';
import { startEnergyRecharger } from './gamification.js';
import { formatDate, formatTime, getPriorityIcon, getRecurrenceLabel } from './utils.js';

// Referências globais
const DOM = {
  taskModal: document.getElementById('task-modal'),
  taskForm: document.getElementById('task-form'),
  kambanColumns: document.querySelectorAll('.kamban-column'),
  notificationArea: document.querySelector('.notification-area'),
  energyFill: document.querySelector('#energy-fill'),
  energyText: document.querySelector('#energy-text'),
  xpElement: document.querySelector('#xp-display'),
  coinsElement: document.querySelector('#coins-display'),
  levelElement: document.querySelector('#level-display'),
  currentDate: document.querySelector('#current-date'),
  // Adicionando referência direta aos botões de adicionar tarefa
  addTaskButtons: document.querySelectorAll('.add-task-btn')
};

let draggedTask = null;

export const initUI = () => {
  // Configurar data atual
  if (DOM.currentDate) {
    DOM.currentDate.textContent = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Inicializar renderização
  renderAll();
  
  // Configurar listeners - AGORA COM VERIFICAÇÃO DE EXISTÊNCIA
  setupEventListeners();
  
  // Iniciar sistemas em segundo plano
  startDeadlineChecker();
  startEnergyRecharger();
  
  console.log("UI inicializada com sucesso!");
};

const renderAll = () => {
  renderTasks();
  renderUserStats();
};

const renderTasks = () => {
  // Limpar todos os containers
  document.querySelectorAll('.tasks-container').forEach(container => {
    container.innerHTML = '';
  });
  
  // Renderizar tarefas em suas colunas
  State.tasks.forEach(task => {
    const container = document.querySelector(`#${task.column}-column .tasks-container`);
    if (container) {
      container.appendChild(createTaskCard(task));
    }
  });
};

const createTaskCard = (task) => {
  const card = document.createElement('div');
  card.className = `task-card ${task.priority}-priority ${task.overdue ? 'overdue' : ''}`;
  card.draggable = true;
  card.dataset.id = task.id;
  
  card.innerHTML = `
    <div class="task-header">
      <span class="priority-indicator">${getPriorityIcon(task.priority)}</span>
      <h3>${task.title}</h3>
      <div class="task-actions">
        <button class="btn-edit" aria-label="Editar tarefa '${task.title}'">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-delete" aria-label="Excluir tarefa '${task.title}'">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    ${task.description ? `<p>${task.description}</p>` : ''}
    <div class="task-details">
      ${task.date ? `<span><i class="far fa-calendar"></i> ${formatDate(task.date)}</span>` : ''}
      ${task.time ? `<span><i class="far fa-clock"></i> ${formatTime(task.time)}</span>` : ''}
      ${task.category ? `<span class="tag ${task.category}-tag">${task.category}</span>` : ''}
    </div>
    ${task.recurring ? `
      <div class="recurring">
        <i class="fas fa-repeat"></i> ${getRecurrenceLabel(task.recurring)}
      </div>
    ` : ''}
    ${task.overdue ? '<div class="overdue-label">ATRASADA!</div>' : ''}
  `;
  
  // Event listeners
  const editBtn = card.querySelector('.btn-edit');
  const deleteBtn = card.querySelector('.btn-delete');
  
  if (editBtn) {
    editBtn.addEventListener('click', () => openTaskModal(task));
  }
  
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      deleteTask(task.id);
      renderAll();
    });
  }
  
  return card;
};

const renderUserStats = () => {
  // Atualizar energia
  if (DOM.energyFill && DOM.energyText) {
    DOM.energyFill.style.width = `${State.user.energy}%`;
    DOM.energyText.textContent = `Energia: ${State.user.energy}%`;
  }
  
  // Atualizar outras estatísticas
  if (DOM.xpElement) DOM.xpElement.textContent = `XP: ${State.user.xp}`;
  if (DOM.coinsElement) DOM.coinsElement.textContent = `Moedas: ${State.user.coins}`;
  if (DOM.levelElement) DOM.levelElement.textContent = `Nível: ${State.user.level}`;
};

const setupEventListeners = () => {
  console.log("Configurando event listeners...");
  
  // Botão para adicionar tarefa - CORREÇÃO CRÍTICA AQUI
  if (DOM.addTaskButtons && DOM.addTaskButtons.length > 0) {
    DOM.addTaskButtons.forEach(btn => {
      btn.addEventListener('click', openTaskModal);
      console.log("Event listener adicionado ao botão:", btn);
    });
  } else {
    console.error("Nenhum botão 'Adicionar Tarefa' encontrado!");
  }
  
  // Modal
  const closeModal = document.querySelector('.close-modal');
  const cancelBtn = document.querySelector('.btn-cancel');
  
  if (closeModal) {
    closeModal.addEventListener('click', closeTaskModal);
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeTaskModal);
  }
  
  // Formulário
  if (DOM.taskForm) {
    DOM.taskForm.addEventListener('submit', handleTaskFormSubmit);
  } else {
    console.error("Formulário de tarefa não encontrado!");
  }
  
  // Prioridade
  const priorityOptions = document.querySelectorAll('.priority-option');
  if (priorityOptions.length > 0) {
    priorityOptions.forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.priority-option').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        e.currentTarget.classList.add('active');
        e.currentTarget.setAttribute('aria-pressed', 'true');
      });
    });
  }
  
  // Recorrência
  const recurringOptions = document.querySelectorAll('.recurring-option');
  if (recurringOptions.length > 0) {
    recurringOptions.forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.recurring-option').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        e.currentTarget.classList.add('active');
        e.currentTarget.setAttribute('aria-pressed', 'true');
      });
    });
  }
  
  // Drag and Drop
  setupDragAndDrop();
};

const openTaskModal = () => {
  console.log("Abrindo modal de tarefa...");
  
  if (DOM.taskModal) {
    DOM.taskModal.style.display = 'block';
    document.getElementById('modal-title').textContent = 'Adicionar Nova Tarefa';
    
    // Resetar form
    if (DOM.taskForm) DOM.taskForm.reset();
    
    // Resetar seleções
    document.querySelectorAll('.priority-option').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
      if (btn.dataset.priority === 'high') {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      }
    });
    
    document.querySelectorAll('.recurring-option').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
      if (btn.dataset.recurrence === 'none') {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      }
    });
    
    // Limpar ID de edição
    if (DOM.taskForm.dataset.taskId) {
      delete DOM.taskForm.dataset.taskId;
    }
  } else {
    console.error("Modal de tarefa não encontrado!");
  }
};

const closeTaskModal = () => {
  console.log("Fechando modal de tarefa...");
  
  if (DOM.taskModal) {
    DOM.taskModal.style.display = 'none';
    if (DOM.taskForm) DOM.taskForm.reset();
    
    // Resetar estados ARIA
    document.querySelectorAll('.priority-option, .recurring-option').forEach(btn => {
      btn.setAttribute('aria-pressed', 'false');
    });
    
    if (DOM.taskForm.dataset.taskId) {
      delete DOM.taskForm.dataset.taskId;
    }
  }
};

const handleTaskFormSubmit = (e) => {
  e.preventDefault();
  
  const taskData = {
    title: document.getElementById('task-title').value,
    description: document.getElementById('task-description').value,
    date: document.getElementById('task-date').value,
    time: document.getElementById('task-time').value,
    priority: document.querySelector('.priority-option[aria-pressed="true"]').dataset.priority,
    category: document.getElementById('task-category').value,
    recurring: document.querySelector('.recurring-option[aria-pressed="true"]').dataset.recurrence
  };
  
  const taskId = DOM.taskForm.dataset.taskId;
  
  if (taskId) {
    updateTask(taskId, taskData);
  } else {
    createTask(taskData);
  }
  
  renderAll();
  closeTaskModal();
};

const setupDragAndDrop = () => {
  // Eventos para tarefas
  document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('task-card')) {
      draggedTask = e.target;
      setTimeout(() => e.target.classList.add('dragging'), 0);
    }
  });
  
  document.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('task-card')) {
      e.target.classList.remove('dragging');
      draggedTask = null;
    }
  });
  
  // Eventos para colunas
  DOM.kambanColumns.forEach(column => {
    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!draggedTask) return;
      
      const container = column.querySelector('.tasks-container');
      const afterElement = getDragAfterElement(container, e.clientY);
      
      if (afterElement) {
        container.insertBefore(draggedTask, afterElement);
      } else {
        container.appendChild(draggedTask);
      }
    });
    
    column.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggedTask) {
        const columnId = column.id.replace('-column', '');
        moveTask(draggedTask.dataset.id, columnId);
        renderAll();
      }
    });
  });
};

const getDragAfterElement = (container, y) => {
  const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
};

// Função para mostrar notificações
export const showNotification = (message, type = 'info') => {
  if (!DOM.notificationArea) return;
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.setAttribute('role', 'alert');
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <p>${message}</p>
    <button class="close-notification" aria-label="Fechar notificação">&times;</button>
  `;
  
  DOM.notificationArea.appendChild(notification);
  
  // Fechar notificação
  notification.querySelector('.close-notification').addEventListener('click', () => {
    notification.remove();
  });
  
  // Remover automaticamente após 5 segundos
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
};

document.querySelectorAll('.add-task-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    console.log("CLIQUE NO BOTÃO DETECTADO VIA FALLBACK!");
    openTaskModal();
  });
});