const fruitEmojis = {
    "Pumpkin": "🎃",
    "Cherry": "🍒",
    "Pomegranate": "❤️",
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
        resultsEl.innerHTML = `<p class="small">This fruit doesn't exist!!! (｡•̀ ⤙ •́ ｡ꐦ)</p>`;
        return;
    }

    items.forEach(item => {
        const emoji = fruitEmojis[item.name] || "🍏";
        const fav = isFavorite(item.id) ? '♥' : '♡';

        // make card focusable and provide an accessible label for screen readers
        const ariaLabel = `${item.name}, ${item.nutritions.calories} calories, ${item.nutritions.carbohydrates}g carbohydrates, ${item.nutritions.fat}g fat, ${item.nutritions.protein}g protein, ${item.nutritions.sugar}g sugar`;

        resultsEl.innerHTML += `
            <div class="card" data-id="${item.id}" role="article" tabindex="0" aria-label="${ariaLabel}">
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
    // enhance the sort select into a custom dropdown so the open list shows our custom cursor
    try {
        enhanceSortSelect();
    } catch (e) {
        // enhancement is optional; ignore if function missing or fails
        console.warn('enhanceSortSelect failed', e);
    }
});

// Replace the native #sortSelect with a small custom dropdown while keeping the native select hidden.
function enhanceSortSelect() {
    const sel = document.getElementById('sortSelect');
    if (!sel) return;

    // avoid double-enhancing
    if (sel.dataset.enhanced === '1') return;

    sel.dataset.enhanced = '1';
    // hide native select but keep it for form/backwards compatibility
    sel.style.display = 'none';

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'custom-select__button';
    btn.textContent = sel.options[sel.selectedIndex]?.text || 'Select';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');

    const list = document.createElement('div');
    list.className = 'custom-select__list';
    list.style.display = 'none';
    list.setAttribute('role', 'listbox');
    const listId = `custom-select-list-${Math.random().toString(36).slice(2, 8)}`;
    list.id = listId;
    btn.setAttribute('aria-controls', listId);

    Array.from(sel.options).forEach(opt => {
        // keep a placeholder/default option for the button preview but don't show it in the dropdown list
        if (opt.value === 'default' || opt.disabled) return;

        const optEl = document.createElement('div');
        optEl.className = 'custom-select__option';
        optEl.dataset.value = opt.value;
        optEl.textContent = opt.text;
        optEl.setAttribute('role', 'option');
        optEl.setAttribute('tabindex', '-1');
        optEl.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
        if (opt.selected) optEl.classList.add('selected');
        optEl.addEventListener('click', (e) => {
            sel.value = optEl.dataset.value;
            // update button label
            btn.textContent = optEl.textContent;
            // reflect selection visually
            list.querySelectorAll('.custom-select__option').forEach(o => { o.classList.remove('selected'); o.setAttribute('aria-selected', 'false'); });
            optEl.classList.add('selected');
            optEl.setAttribute('aria-selected', 'true');
            // close list
            list.style.display = 'none';
            btn.setAttribute('aria-expanded', 'false');
            // trigger native change so existing listeners react
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            // focus first card so screen reader can read
            const firstCard = document.querySelector('.card');
            if (firstCard) firstCard.focus();
        });
        list.appendChild(optEl);
    });

    // toggle list on click and support keyboard navigation
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = list.style.display !== 'none';
        list.style.display = open ? 'none' : 'block';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        if (!open) {
            // focus first option when opened
            const firstOpt = list.querySelector('.custom-select__option');
            if (firstOpt) firstOpt.focus();
        }
    });

    // keyboard support for options
    list.addEventListener('keydown', (e) => {
        const focused = document.activeElement;
        if (!focused || !focused.classList.contains('custom-select__option')) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = focused.nextElementSibling || list.querySelector('.custom-select__option');
            if (next) next.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = focused.previousElementSibling || list.querySelector('.custom-select__option:last-child');
            if (prev) prev.focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            focused.click();
        } else if (e.key === 'Escape') {
            list.style.display = 'none';
            btn.setAttribute('aria-expanded', 'false');
            btn.focus();
        }
    });

    // allow opening list with keyboard from button
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
    });

    // close when clicking outside
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) list.style.display = 'none';
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(list);
    sel.parentNode.insertBefore(wrapper, sel.nextSibling);
}







