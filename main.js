const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");

if (searchForm) {
    console.log("Search form found");
    searchForm.addEventListener("submit", (e) => { //runs kui search vajutan
        e.preventDefault();
        const query = searchInput.value.toLowerCase(); //reads input
        const filtered = allFruits.filter(f =>
            f.name.toLowerCase().includes(query)//võtab aint fruit mida ta findib
        );
        if (typeof sortFruits === 'function') {
            renderResults(sortFruits(filtered));
        } else {
            renderResults(filtered);
        }
    });
}
