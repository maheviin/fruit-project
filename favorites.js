// Renders favorite fruits into #favoritesList and keeps UI in sync
const favContainer = document.getElementById('favoritesList');

function renderFavorites() {
    if (!favContainer) return;
    const ids = getFavoriteIds();

    if (!allFruits || allFruits.length === 0) {
        favContainer.innerHTML = '<p class="small">Loading...</p>';
        return;
    }

    const items = ids.map(id => allFruits.find(f => f.id === Number(id))).filter(Boolean);

    if (items.length === 0) {
        favContainer.innerHTML = '<p class="small">No favorites yet.</p>';
        return;
    }

    favContainer.innerHTML = items.map(item => {
        const emoji = fruitEmojis[item.name] || '🍏';
        const fav = isFavorite(item.id) ? '♥︎' : '♡';
        return `
        <div class="card" data-id="${item.id}">
            <h3>${emoji} ${item.name} <button class="heart-btn" data-heart-id="${item.id}" aria-pressed="${isFavorite(item.id)}">${fav}</button></h3>
            <div class="row">
                <div class="small">calories: ${item.nutritions.calories}</div>
                <div class="small">carbohydrates: ${item.nutritions.carbohydrates}</div>
                <div class="small">fat: ${item.nutritions.fat}</div>
                <div class="small">protein: ${item.nutritions.protein}</div>
                <div class="small">sugar: ${item.nutritions.sugar}</div>
            </div>
        </div>`;
    }).join('');

    updateAllHearts();
}

// Re-render when fruits load or favorites change
window.addEventListener('fruitsLoaded', renderFavorites);
window.addEventListener('favoritesChanged', renderFavorites);

// Try rendering on load in case data already fetched
window.addEventListener('DOMContentLoaded', () => {
    renderFavorites();
});

// Delegate clicks inside the favorites container so heart buttons work here too
if (favContainer) {
    favContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.heart-btn');
        if (!btn) return;
        const id = Number(btn.dataset.heartId);
        toggleFavorite(id);
        // favoritesChanged event will fire from toggle
    });
}
