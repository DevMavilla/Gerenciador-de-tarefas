
//  ### 1. main.js
//- **Responsabilidade**: Ponto de entrada da aplicação. Inicializa o sistema.
//- **Funcionalidades**:
// - Atualiza a data no cabeçalho.
// - Carrega o estado salvo do localStorage.
// - Inicializa a interface do usuário (chamando `initUI` do `ui.js`).




// main.js
import { State } from './state.js'; // Importe o State aqui
import { loadState } from './storage.js';
import { initUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  // Carregar estado salvo
  loadState();
  
  // Inicializar UI
  initUI();
  
  // Configurar data atual
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateElement = document.querySelector('#current-date');
  
  if (dateElement) {
    dateElement.textContent = now.toLocaleDateString('pt-BR', options);
  }

  // Debug (opcional)
  console.log("Aplicação iniciada com sucesso!");
  console.log("Estado inicial:", State);
});