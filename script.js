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
    resultsEl.innerHTML = "";

    if (items.length === 0) {
        resultsEl.innerHTML = `<p class="small">No fruits found.</p>`;
        return;
    }

    items.forEach(item => {
        const emoji = fruitEmojis[item.name] || "🍏";

        resultsEl.innerHTML += `
        <div class="card" data-id="${item.id}">
            <h3>${emoji} ${item.name}</h3>
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
}

//saab API-st andmeid
//async tähendab, et see funktsioon võtab aega
async function fetchAllFruits() {

    try {
        const response = await fetch("https://www.fruityvice.com/api/fruit/all");
        const data = await response.json(); //teeb jsonist js-i
        allFruits = data; // save globally so other functions can use it
        renderResults(sortFruits(allFruits)); //sort and render fruits
    } catch (err) {
        console.error("Failed to fetch fruits:", err);
        resultsEl.innerHTML = `<p class="small">Failed to load fruits.</p>`;
    }
}

// kick off data loading after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    if (typeof fetchAllFruits === 'function') {
        fetchAllFruits();
    }
});







