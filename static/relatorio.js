document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('notification-modal');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalCancelButton = document.getElementById('modal-cancel-button');
    const modalSendButton = document.getElementById('modal-send-button');
    let activeRespostaId = null;

    document.body.addEventListener('click', (e) => {
        const notifyButton = e.target.closest('.notify-button');
        if (notifyButton) {
            e.preventDefault();
            activeRespostaId = notifyButton.dataset.respostaId;
            const reportItem = notifyButton.closest('.report-item');
            
            // Preenche o modal com dados
            const checklistName = reportItem.dataset.checklistName;
            const question = reportItem.dataset.question;
            const severity = reportItem.dataset.severityName;
            const time = reportItem.dataset.severityTime;

            document.getElementById('email-subject').value = `Ação Necessária: Não Conformidade em "${checklistName}"`;
            document.getElementById('email-body').value = 
`Olá,

Uma não conformidade foi identificada e requer sua atenção:

Checklist: ${checklistName}
Item: ${question}
Gravidade: ${severity}
Prazo para Resolução: ${time} dia(s)

Por favor, verifique e tome as ações necessárias.

Atenciosamente,
Sistema de QA`;
            
            modal.style.display = 'flex';
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        activeRespostaId = null;
        document.getElementById('recipient-email').value = '';
    }

    modalCloseButton.addEventListener('click', closeModal);
    modalCancelButton.addEventListener('click', closeModal);
    
    modalSendButton.addEventListener('click', () => {
        const data = {
            resposta_id: activeRespostaId,
            destinatario: document.getElementById('recipient-email').value,
            assunto: document.getElementById('email-subject').value,
            corpo: document.getElementById('email-body').value,
        };

        if (!data.destinatario) {
            Swal.fire('Erro', 'O e-mail do destinatário é obrigatório.', 'error');
            return;
        }

        fetch('/notificar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            if (result.bool) {
                Swal.fire('Sucesso!', result.message, 'success');
                closeModal();
            } else {
                Swal.fire('Erro', result.message, 'error');
            }
        });
    });
});