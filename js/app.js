// Selecionar elementos DOM
const addTaskBtn = document.querySelector('.add-task-btn');
const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('.btn-close');
const taskForm = document.getElementById('task-form');

// Funções de controle do modal
function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.add('closing');
    
    setTimeout(() => {
        modal.classList.remove('active', 'closing');
        document.body.style.overflow = '';
        taskForm.reset();
    }, 300);
}

// Manipular envio do formulário
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simular salvamento da tarefa
    setTimeout(() => {
        closeModal();
    }, 800);
});

// Event listeners
addTaskBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

// Fechar modal ao clicar fora do conteúdo
modal.addEventListener('click', (e) => {
    if(e.target === modal) {
        closeModal();
    }
});

// Fechar com tecla Esc
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Simular edição de tarefa
document.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.modal-title').textContent = 'Editar Tarefa';
        openModal();
    });
});

// Log de inicialização
console.log('Aplicação TaskFlow iniciada com sucesso!');

