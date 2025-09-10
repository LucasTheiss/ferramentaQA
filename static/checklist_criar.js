document.addEventListener('DOMContentLoaded', () => {
    let items = []; // perguntas
    let severityLevels = []; //niveis 

    const addItemButton = document.getElementById('add-item-button');
    const itemsContainer = document.getElementById('items-container');
    const emptyState = document.getElementById('empty-state');

    const addSeverityButton = document.getElementById('add-severity-button');
    const severityNameInput = document.getElementById('severity-name-input');
    const severityTimeInput = document.getElementById('severity-time-input');
    const severityContainer = document.getElementById('severity-levels-container');

    const backButton = document.getElementById('back-button');
    const saveChecklistButton = document.getElementById('save-checklist-button');

    // event listeners
    addItemButton.addEventListener('click', addItem);
    itemsContainer.addEventListener('change', handleItemUpdate);
    itemsContainer.addEventListener('click', handleItemClick);

    addSeverityButton.addEventListener('click', addSeverityLevel);
    severityContainer.addEventListener('click', handleSeverityClick);

    backButton.addEventListener('click', handleBackButton);
    saveChecklistButton.addEventListener('click', submitChecklist);


    function addItem() {
        items.push({ id: Date.now().toString(), question: '' });
        renderItems();
    }
    
    function removeItem(id) {
        items = items.filter(item => item.id !== id);
        renderItems();
    }

    function updateItem(id, field, value) {
        const itemIndex = items.findIndex(item => item.id === id);
        if (itemIndex > -1) items[itemIndex][field] = value;
    }

    function handleItemUpdate(e) {
        const target = e.target.closest('.item-input');
        if (target) updateItem(target.closest('.item-card').dataset.id, target.dataset.field, target.value);
    }

    function handleItemClick(e) {
        const deleteButton = e.target.closest('.delete-item-button');
        if (deleteButton) removeItem(deleteButton.closest('.item-card').dataset.id);
    }

    function addSeverityLevel() {
        const name = severityNameInput.value.trim();
        const time = parseInt(severityTimeInput.value, 10);

        if (name && time > 0) {
            severityLevels.push({ id: Date.now().toString(), name, time });
            severityNameInput.value = '';
            severityTimeInput.value = '';
            severityNameInput.focus();
            renderSeverityLevels();
        }
    }

    function removeSeverityLevel(id) {
        severityLevels = severityLevels.filter(level => level.id !== id);
        renderSeverityLevels();
    }

    function handleSeverityClick(e) {
        const deleteButton = e.target.closest('.delete-severity-button');
        if (deleteButton) removeSeverityLevel(deleteButton.closest('.list-item').dataset.id);
    }
    
    function renderItems() {
        itemsContainer.innerHTML = '';
        if (items.length === 0) {
            itemsContainer.appendChild(emptyState);
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            items.forEach((item, index) => itemsContainer.appendChild(createItemElement(item, index)));
        }
        updateSummary();
    }

    function renderSeverityLevels() {
        severityContainer.innerHTML = '';
        severityLevels.forEach(level => severityContainer.appendChild(createSeverityElement(level)));
    }

    function createItemElement(item, index) {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.dataset.id = item.id;
        div.innerHTML = `
            <div class="item-card-header">
                <span class="item-title">Item ${index + 1}</span>
                <button class="button button-danger-ghost delete-item-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
            <div class="form-group item-question-group">
                <label>Pergunta/Critério</label>
                <textarea class="textarea-field item-input" data-field="question" placeholder="Ex: O sistema exibe mensagem de erro adequada..." rows="2">${item.question}</textarea>
            </div>`;
        div.querySelector('textarea').value = item.question;
        return div;
    }

    function createSeverityElement(level) {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.dataset.id = level.id;
        div.innerHTML = `
            <div>
                <span>${level.name}</span>
                <span class="time">(${level.time} ${level.time > 1 ? 'dias' : 'dia'})</span>
            </div>
            <button class="button button-danger-ghost delete-severity-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>`;
        return div;
    }
    
    function updateSummary() {
        document.getElementById('summary-total-items').textContent = items.length;
    }

    function handleBackButton() {
        Swal.fire({
            title: "Tem certeza?", text: "Seu progresso não salvo será perdido!", icon: "warning",
            showCancelButton: true, confirmButtonColor: "#3085d6", cancelButtonColor: "#d33",
            confirmButtonText: "Sim, sair", cancelButtonText: "Não, ficar"
        }).then(result => { if (result.isConfirmed) window.location.href = '/'; });
    }

    function submitChecklist() {
        const name = document.getElementById('checklist-name').value.trim();
        const description = document.getElementById('checklist-description').value.trim();
        const category = document.getElementById('checklist-category').value;
        
        if (!name) return Swal.fire('Erro', 'O nome do checklist é obrigatório.', 'error');
        if (items.length === 0) return Swal.fire('Erro', 'Adicione pelo menos um item ao checklist.', 'error');
        if (severityLevels.length === 0) return Swal.fire('Erro', 'Adicione pelo menos um nível de gravidade.', 'error');

        const checklistData = { name, description, category, items, severityLevels };
        
        console.log("Enviando dados do Checklist:", checklistData);

        fetch('/criar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(checklistData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.bool) {
                Swal.fire('Sucesso!', data.message, 'success').then(() => { window.location.href = '/'; });
            } else {
                Swal.fire('Erro', data.message || 'Ocorreu um erro ao salvar.', 'error');
            }
        })
        .catch(error => {
            console.error('Erro no Fetch:', error);
            Swal.fire('Erro de Conexão', 'Não foi possível comunicar com o servidor.', 'error');
        });
    }

    renderItems();
    renderSeverityLevels();
});