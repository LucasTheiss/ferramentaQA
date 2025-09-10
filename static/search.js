document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const filterableContainer = document.getElementById('filterable-container');
    const noResultsMessage = document.getElementById('no-results-message');

    if (!searchInput || !filterableContainer || !noResultsMessage) {
        return;
    }

    const filterableCards = filterableContainer.querySelectorAll('.filterable-card');

    const filterContent = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        filterableCards.forEach(card => {
            const cardSearchData = card.dataset.searchTerm.toLowerCase();

            if (cardSearchData.includes(searchTerm)) {
                card.style.display = ''; 
                visibleCount++;
            } else {
                card.style.display = 'none'; 
            }
        });


        if (visibleCount === 0) {
            noResultsMessage.style.display = '';
        } else {
            noResultsMessage.style.display = 'none';
        }
    };

    searchInput.addEventListener('input', filterContent);
});