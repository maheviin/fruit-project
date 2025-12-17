const fruitEmojis = {
    "Pumpkin": "🎃",
    "Cherry": "🍒",
    "Pomegranate": "🔴",
    "Jackfruit": "🍈",
    "Dragonfruit": "🐲",
    "Kiwifruit": "🥝ྀིྀི",
    "Pomelo": "🍈",
    "Plum": "🟣",
    "Papaya": "🥭",
    "Morus": "🍇",
    "Grape": "🍇",
    "Horned Melon": "👹",
    "Mangosteen": "🥭",
    "Japanese Persimmon": "🇯🇵",
    "Feijoa": "🍈",
    "Cranberry": "🔴",
    "Ceylon Gooseberry": "🫐",
    "Avocado": "🥑",
    "Hazelnut": "🌰",
    "Apple": "🍎",
    "GreenApple": "🍏",
    "Banana": "🍌",
    "Orange": "🍊",
    "Strawberry": "🍓",
    "Pear": "🍐",
    "Durian": "🥭",
    "Blackberry": "🫐",
    "Lingonberry": "🫐",
    "Kiwi": "🥝",
    "Lychee": "🫐",
    "Pineapple": "🍍",
    "Fig": "🍈",
    "Gooseberry": "🫐",
    "Passionfruit": "🥭",
    "Peach": "🍑",
    "Raspberry": "🍓",
    "Watermelon": "🍉",
    "Lemon": "🍋",
    "Mango": "🥭",
    "Blueberry": "🫐",
    "Guava": "🥭",
    "Apricot": "🍑",
    "Melon": "🍈",
    "Tangerine": "🍊",
    "Pitahaya": "🐉",
    "Lime": "🍋‍🟩",
    "Pomegranate": "🧧",
    "Persimmon": "🟠",
    "Tomato": "🍅"
};

//DOM refs, need suhtlevad html-iga
const resultsEl = document.getElementById("results");



//varible mis hoiab fruite, et neid iga kord fetchima ei peaks
let allFruits = [];

function renderResults(items) {
    if (!resultsEl) return;
    resultsEl.innerHTML = "";

    if (!items || items.length === 0) {
        resultsEl.innerHTML = `<p class="small">No fruits found.</p>`;
        return;
    }

    items.forEach(item => {
        const emoji = fruitEmojis[item.name] || "🍏";
        const fav = isFavorite(item.id) ? '♥' : '♡';

        resultsEl.innerHTML += `
        <div class="card" data-id="${item.id}">
            <h3>${emoji} ${item.name} <button class="heart-btn" data-heart-id="${item.id}" aria-pressed="${isFavorite(item.id)}">${fav}</button></h3>
            <div class="row">
                <div class="small">calories: ${item.nutritions.calories}</div>
                <div class="small">carbohydrates: ${item.nutritions.carbohydrates}</div>
                <div class="small">fat: ${item.nutritions.fat}</div>
                <div class="small">protein: ${item.nutritions.protein}</div>
                <div class="small">sugar: ${item.nutritions.sugar}</div>
            </div>
        </div>
        `;
    });

    // ensure heart buttons have listeners via delegation (below)
}

// Favorites helpers (persist in localStorage)
function getFavoriteIds() {
    try {
        const raw = localStorage.getItem('favoriteIds');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveFavoriteIds(ids) {
    localStorage.setItem('favoriteIds', JSON.stringify(ids));
}

function isFavorite(id) {
    return getFavoriteIds().includes(Number(id));
}

function addFavorite(id) {
    const ids = getFavoriteIds();
    id = Number(id);
    if (!ids.includes(id)) {
        ids.push(id);
        saveFavoriteIds(ids);
        window.dispatchEvent(new CustomEvent('favoritesChanged'));
        updateHeartButton(id);
    }
}

function removeFavorite(id) {
    const ids = getFavoriteIds().filter(x => x !== Number(id));
    saveFavoriteIds(ids);
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
    updateHeartButton(id);
}

function toggleFavorite(id) {
    if (isFavorite(id)) removeFavorite(id);
    else addFavorite(id);
}

function updateHeartButton(id) {
    const btn = document.querySelector(`[data-heart-id="${id}"]`);
    if (!btn) return;
    const fav = isFavorite(id) ? '♥' : '♡';
    btn.textContent = fav;
    btn.setAttribute('aria-pressed', isFavorite(id));
}

function updateAllHearts() {
    document.querySelectorAll('.heart-btn').forEach(btn => {
        const id = btn.dataset.heartId;
        const fav = isFavorite(id) ? '♥' : '♡';
        btn.textContent = fav;
        btn.setAttribute('aria-pressed', isFavorite(id));
    });
}

// delegation for heart button clicks
if (resultsEl) {
    resultsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.heart-btn');
        if (!btn) return;
        const id = Number(btn.dataset.heartId);
        toggleFavorite(id);
        updateAllHearts();
    });
}

//saab API-st andmeid
//async tähendab, et see funktsioon võtab aega
async function fetchAllFruits() {

    try {
        const response = await fetch("https://www.fruityvice.com/api/fruit/all");
        const data = await response.json(); //teeb jsonist js-i
        allFruits = data; // save globally so other functions can use it
        const toRender = (typeof sortFruits === 'function') ? sortFruits(allFruits) : allFruits;
        renderResults(toRender); // sort (if available) and render fruits
        // notify other modules that fruits are loaded
        window.dispatchEvent(new CustomEvent('fruitsLoaded'));
    } catch (err) {
        console.error("Failed to fetch fruits:", err);
        if (resultsEl) resultsEl.innerHTML = `<p class="small">Failed to load fruits.</p>`;
    }
}

// kick off data loading after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    if (typeof fetchAllFruits === 'function') {
        fetchAllFruits();
    }
});







