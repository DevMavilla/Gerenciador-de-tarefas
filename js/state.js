//### 2. state.js
//- **Responsabilidade**: Armazenar o estado global da aplicação.
//- **Conteúdo**:
//  - `State.tasks`: Array de tarefas.
//  - `State.user`: Objeto com dados do usuário (nível, XP, moedas, energia, conquistas).

// state.js
export const State = {
  tasks: [],
  user: {
    level: 1,
    xp: 0,
    coins: 0,
    energy: 100,
    achievements: []
  }
};