# Gerenciador-de-tarefas

Detalhamento das Funções-Chave:
Arquivo	Funções Principais
main.js	- Inicialização geral
- Carregamento do estado
- Atualização da data atual
state.js	- Armazenamento centralizado de tarefas e dados do usuário
storage.js	- saveState(): Salva no localStorage
- loadState(): Carrega do localStorage
tasks.js	- createTask(): Cria nova tarefa
- moveTask(): Move entre colunas
- updateTask(): Edita tarefa
- startDeadlineChecker(): Verifica prazos
gamification.js	- updateUserStats(): Atualiza XP/moedas
- applyOverduePenalty(): Aplica penalidades
- startEnergyRecharger(): Recarrega energia
ui.js	- initUI(): Inicializa interface
- renderTasks(): Exibe tarefas
- setupDragAndDrop(): Implementa arrastar/soltar
- openTaskModal(): Gerencia formulário
utils.js	- formatDate()/formatTime(): Formata datas
- isOverdue(): Verifica atrasos
- generateId(): Cria IDs únicos
- getPriorityIcon(): Ícones visuais


# TaskFlow - Sistema de Tarefas Gamificado

![TaskFlow Screenshot](screenshot.png) <!-- Adicione uma imagem de demonstração aqui -->

## Visão Geral
TaskFlow é uma aplicação web avançada de gerenciamento de tarefas que combina produtividade com gamificação. Com uma interface intuitiva baseada no sistema Kamban, recursos de gamificação e foco em bem-estar digital, o TaskFlow transforma sua lista de afazeres em uma experiência engajante e recompensadora.

## Recursos Principais

### 🎮 Sistema de Gamificação
- **XP (Pontos de Experiência):** Ganhe XP ao completar tarefas
- **Níveis:** Avance de nível conforme acumula XP
- **Moedas Virtuais:** Colecione moedas como recompensa
- **Barra de Energia:** Gerencie seu foco com o sistema de energia
- **Penalidades:** Perda de XP por tarefas atrasadas

### ✅ Gerenciamento de Tarefas
- **Quadro Kamban:** 4 colunas (Para Fazer, Em Progresso, Revisão, Concluído)
- **Prioridades:** 🔥 Alta, ⚠️ Média, 💧 Baixa
- **Datas e Horários:** Defina prazos específicos
- **Recorrência:** Tarefas diárias, semanais ou mensais
- **Arrastar e Soltar:** Interface intuitiva para organização

### 📊 Estatísticas e Progresso
- Acompanhamento visual de produtividade
- Histórico de tarefas concluídas
- Progresso em direção aos objetivos
- Sistema de conquistas (em desenvolvimento)

## Tecnologias Utilizadas
- **Frontend:**
  - HTML5 (Semântico)
  - CSS3 (Flexbox, Grid, Variáveis, Animações)
  - JavaScript ES6+
- **Armazenamento:**
  - LocalStorage (Persistência de dados)
- **Bibliotecas:**
  - Font Awesome (Ícones)
  - Google Fonts (Tipografia)

## Estrutura de Arquivos
```
taskflow/
├── index.html          # Arquivo principal HTML
├── styles.css          # Estilos principais
└── js/                 # Lógica da aplicação
    ├── main.js         # Ponto de entrada
    ├── state.js        # Estado global da aplicação
    ├── storage.js      # Gerenciamento do localStorage
    ├── tasks.js        # Operações com tarefas
    ├── gamification.js # Sistema de recompensas e penalidades
    ├── ui.js           # Renderização e interface
    └── utils.js        # Funções utilitárias
```

## Como Usar

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/taskflow.git
   ```
2. Abra o arquivo `index.html` em qualquer navegador moderno.

### Funcionalidades Básicas
1. **Adicionar Tarefa:**
   - Clique em "Adicionar Tarefa" em qualquer coluna
   - Preencha os detalhes (título, data, prioridade, etc.)
   - Clique em "Salvar Tarefa"

2. **Mover Tarefas:**
   - Arraste e solte tarefas entre colunas
   - Tarefas movidas para "Concluído" geram recompensas

3. **Editar/Excluir:**
   - Clique no ícone de lápis (✏️) para editar
   - Clique no ícone de lixeira (🗑️) para excluir

4. **Monitorar Progresso:**
   - Acompanhe seu XP, nível e moedas no cabeçalho
   - Observe a barra de energia durante o trabalho

### Gamificação
- **Recompensas:**
  - +XP por tarefas concluídas (mais para prioridades altas)
  - +Moedas por conclusões antecipadas
  - Bônus ao subir de nível

- **Penalidades:**
  - -XP por tarefas atrasadas
  - -Energia por uso prolongado

- **Energia:**
  - Recarrega automaticamente (1% a cada 5 minutos)
  - Tarefas consomem energia proporcional à prioridade

## Personalização
Para personalizar o TaskFlow, você pode modificar:

1. **Categorias:** Edite o seletor no modal de tarefas
   ```html
   <select id="task-category">
     <option value="work">Trabalho</option>
     <option value="personal">Pessoal</option>
     <!-- Adicione novas categorias -->
   </select>
   ```

2. **Recompensas:** Ajuste valores em `gamification.js`
   ```javascript
   // js/gamification.js
   const xpRewards = { 
     high: 50, 
     medium: 30, 
     low: 15 
   };
   ```

3. **Estilos:** Modifique cores e temas em `styles.css`
   ```css
   /* styles.css */
   :root {
     --high-priority: #ff6b6b;
     --medium-priority: #ffd166;
     --low-priority: #06d6a0;
   }
   ```

## Sistema de Energia
O TaskFlow inclui um sistema único de energia que promove pausas saudáveis:

- Cada tarefa consome energia conforme sua prioridade
- Energia recarrega automaticamente ao longo do tempo
- Quando a energia atinge níveis críticos (<20%):
  - O sistema bloqueia por 5 minutos
  - Exibe mensagem de descanso forçado
  - Recarrega energia para 50% após o descanso

## Roadmap (Próximos Recursos)
- [ ] Sistema de conquistas com badges
- [ ] Desafios semanais e diários
- [ ] Avatar personalizável
- [ ] Estatísticas detalhadas (gráficos)
- [ ] Modo escuro/claro
- [ ] Sincronização entre dispositivos

## Contribuição
Contribuições são bem-vindas! Siga estes passos:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença
Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato
Para dúvidas ou sugestões:
- Email: seu-email@exemplo.com
- GitHub: [@seu-usuario](https://github.com/seu-usuario)

---

**Transforme sua produtividade em uma jornada recompensadora com TaskFlow!** 🚀
