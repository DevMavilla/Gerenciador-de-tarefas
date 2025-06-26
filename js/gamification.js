//### 5. gamification.js
//- **Responsabilidade**: Lógica de gamificação.
//- **Funcionalidades**:
//  - `updateUserStats()`: Atualiza XP, moedas e energia ao completar uma tarefa (com bônus por antecipação).
//  - `applyOverduePenalty()`: Aplica penalidades (perda de XP e energia) por tarefas atrasadas.
//  - `checkLevelUp()`: Verifica se o usuário subiu de nível.
//  - `startEnergyRecharger()`: Inicia um timer para recarregar energia gradualmente.

// gamification.js
import { State } from './state.js';
import { saveState } from './storage.js';
import { showNotification } from './utils.js';

export const updateUserStats = (task) => {
  // Cálculo de XP baseado na prioridade
  const xpRewards = { high: 50, medium: 30, low: 15 };
  const xp = xpRewards[task.priority] || 20;
  
  State.user.xp += xp;
  State.user.coins += 10;
  
  // Verificação de nível
  checkLevelUp();
  saveState();
  
  showNotification(`+${xp} XP e 10 moedas por completar tarefa!`, 'success');
};

export const applyOverduePenalty = (task) => {
  const xpLoss = Math.floor(State.user.level * 1.5);
  State.user.xp = Math.max(0, State.user.xp - xpLoss);
  State.user.energy = Math.max(0, State.user.energy - 10);
  
  saveState();
  showNotification(`Tarefa atrasada! -${xpLoss} XP e -10% energia`, 'error');
};

const checkLevelUp = () => {
  const xpRequired = State.user.level * 100;
  if (State.user.xp >= xpRequired) {
    State.user.level++;
    State.user.xp = State.user.xp - xpRequired;
    State.user.coins += 25;
    saveState();
    showNotification(`Parabéns! Subiu para nível ${State.user.level}`, 'success');
  }
};

// Recarrega energia gradualmente
export const startEnergyRecharger = () => {
  setInterval(() => {
    if (State.user.energy < 100) {
      State.user.energy = Math.min(100, State.user.energy + 1);
      saveState();
      
      // Atualizar interface se necessário
      const energyFill = document.querySelector('#energy-fill');
      const energyText = document.querySelector('#energy-text');
      if (energyFill && energyText) {
        energyFill.style.width = `${State.user.energy}%`;
        energyText.innerHTML = `<i class="fas fa-bolt"></i> Energia: ${State.user.energy}%`;
      }
    }
  }, 300000); // Recarrega 1% a cada 5 minutos
};