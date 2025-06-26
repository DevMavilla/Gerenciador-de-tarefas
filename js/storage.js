//### 3. storage.js
//- **Responsabilidade**: Persistência de dados.
//- **Funcionalidades**:
// - `saveState()`: Salva o objeto `State` no localStorage.
// - `loadState()`: Carrega o estado do localStorage para o objeto `State`.
  
  
  
// storage.js
import { State } from './state.js';

export const saveState = () => {
  localStorage.setItem('taskflow_state', JSON.stringify(State));
};

export const loadState = () => {
  const saved = localStorage.getItem('taskflow_state');
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(State, parsed);
    return true;
  }
  return false;
};