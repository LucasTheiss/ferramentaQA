document.addEventListener('DOMContentLoaded', () => {
    const questionsContainer = document.getElementById('questions-container');
    const finishButton = document.getElementById('finish-verification-button');
    const checklistId = document.getElementById('checklist-id').value;

    // Adiciona um listener no container das perguntas para performance
    questionsContainer.addEventListener('change', (e) => {
        // Verifica se o evento veio de um select de resposta
        if (e.target.classList.contains('answer-select')) {
            const questionCard = e.target.closest('.question-card');
            const severitySelect = questionCard.querySelector('.severity-select');

            // Mostra ou esconde o select de gravidade
            if (e.target.value === 'Não') {
                severitySelect.style.display = 'block';
            } else {
                severitySelect.style.display = 'none';
                severitySelect.value = ''; // Reseta o valor
            }
            
            // Recalcula a porcentagem a cada mudança
            updateApprovalPercentage();
        }
    });

    // Listener para o botão de finalizar
    finishButton.addEventListener('click', submitVerification);

    function updateApprovalPercentage() {
        const allAnswers = document.querySelectorAll('.answer-select');
        let simCount = 0;
        let naoCount = 0;

        allAnswers.forEach(select => {
            if (select.value === 'Sim') {
                simCount++;
            } else if (select.value === 'Não') {
                naoCount++;
            }
        });
        
        const totalConsidered = simCount + naoCount;
        let percentage = 100.0;

        if (totalConsidered > 0) {
            percentage = (simCount / totalConsidered) * 100;
        }

        document.getElementById('approval-percentage').textContent = `${percentage.toFixed(1)}%`;
    }

    function submitVerification() {
        const allQuestionCards = document.querySelectorAll('.question-card');
        const responses = [];
        let allAnswered = true;

        allQuestionCards.forEach(card => {
            const itemId = card.dataset.itemId;
            const answerSelect = card.querySelector('.answer-select');
            const severitySelect = card.querySelector('.severity-select');
            const answer = answerSelect.value;
            const severityId = severitySelect.value;
            
            if (!answer) {
                allAnswered = false;
            }

            if (answer === 'Não' && !severityId) {
                allAnswered = false;
            }
            
            responses.push({
                itemId: parseInt(itemId),
                answer: answer,
                severityId: severityId ? parseInt(severityId) : null
            });
        });

        if (!allAnswered) {
            Swal.fire('Atenção', 'Por favor, responda a todas as perguntas. Se a resposta for "Não", selecione uma gravidade.', 'warning');
            return;
        }

        console.log('Enviando respostas:', responses);

        fetch(`/verificar/${checklistId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(responses)
        })
        .then(response => response.json())
        .then(data => {
            if (data.bool) {
                Swal.fire('Sucesso!', data.message, 'success').then(() => {
                    window.location.href = '/'; 
                });
            } else {
                Swal.fire('Erro', data.message || 'Não foi possível salvar as respostas.', 'error');
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            Swal.fire('Erro de Conexão', 'Não foi possível comunicar com o servidor.', 'error');
        });
    }

    updateApprovalPercentage();
});