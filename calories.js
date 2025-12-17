const sortSelect = document.getElementById("sortSelect");

function sortFruits(items) { //sorts fruit list by calories
    if (!sortSelect) return items; //crash prevent

    if (sortSelect.value === "asc") { //Lowest → Highest
        return items.slice().sort((a, b) =>
            a.nutritions.calories - b.nutritions.calories
        );
    }

    if (sortSelect.value === "desc") { //Highest → Lowest
        return items.slice().sort((a, b) =>
            b.nutritions.calories - a.nutritions.calories
        );
    }

    return items; //no sorting
}

if (sortSelect) {
    sortSelect.addEventListener("change", () => { //resort and rerender when dropdown changes
        renderResults(sortFruits(allFruits));
        // notify other modules (favorites) that sort order changed
        window.dispatchEvent(new CustomEvent('sortChanged'));
    });
}