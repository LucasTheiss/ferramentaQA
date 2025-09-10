document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        const resolveButton = e.target.closest('.resolve-button');
        if (resolveButton) {
            const card = resolveButton.closest('.notification-card');
            const notificationId = card.dataset.notificationId;

            Swal.fire({
                title: 'Confirmar Resolução?',
                text: "Esta ação marcará a pendência como resolvida.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sim, resolver',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`/notificacoes/resolver/${notificationId}`, { method: 'POST' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.bool) {
                            // Atualiza a UI para refletir o novo status
                            card.classList.add('status-resolved');
                            const actionsFooter = card.querySelector('.notification-actions');
                            if (actionsFooter) {
                                actionsFooter.innerHTML = '<div class="card-footer status-resolved-footer">Resolvido</div>';
                                // Remove o footer antigo e adiciona um novo para manter a estrutura
                                const newFooter = document.createElement('div');
                                newFooter.className = 'card-footer status-resolved-footer';
                                newFooter.textContent = 'Resolvido';
                                actionsFooter.parentNode.replaceChild(newFooter, actionsFooter);
                            }
                            Swal.fire('Resolvido!', 'A notificação foi marcada como resolvida.', 'success');
                        } else {
                            Swal.fire('Erro', 'Não foi possível atualizar o status.', 'error');
                        }
                    });
                }
            });
        }
    });
});