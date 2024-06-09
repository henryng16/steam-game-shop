const BASE_URL = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/";

const getAllGames = async (query) => {
    try {
        const q = `&genres=${query}`;
        let url = "";
        if (query) {
            url = `${BASE_URL}games?limit=40${q}`;
        } else {
            url = `${BASE_URL}games?limit=40`;
        };
        const data = await fetch(url);
        const dataJson = await data.json();
        return dataJson.data
        // dataJson.data[index].appid
    } catch (e) {
        console.log("error: ", e);
    }
}

const getFeatureGames = async () => {
    try {
        const url = `${BASE_URL}features`
        const data = await fetch(url);
        const dataJson = await data.json();
        return dataJson.data
        // dataJson.data[index].appid
    } catch (e) {
        console.log("error: ", e);
    }
}

const getAllGenres = async () => {
    try {
        const url = `${BASE_URL}genres?limit=40`;
        const data = await fetch(url);
        const dataJson = await data.json();
        return dataJson.data
    } catch (e) {
        console.log("error: ", e)
    }
}

const displayBoard = document.querySelector
("#display-board");
const slider = document.querySelector("#slider-wrapper");
const genresDisplay = document.querySelector(".categorize-list");
const inputBox = document.querySelector(".input-box");
const inputButton = document.querySelector(".input-btn");

const renderFeatureGames = async () => {
    try {
        const featureGames = await getFeatureGames();
        featureGames.forEach((game) => {
            const x = document.createElement("div");
            x.classList.add("trending-game");
            x.innerHTML = `<a href="" class="game-display"><img src="${game["header_image"]}" class="game-img"></a>
            <div class="game-info">
                <div class="game-name">${game.name}</div>
                <div class="game-price">${game.price}</div>
            </div>`;
            slider.appendChild(x);
        });
    } catch (e) {
        console.log("error: ", e);
    }
}

const renderGamesBoard = async (query) => {
    try {
        const allGames = await getAllGames(query);
        allGames.forEach((game) => {
            const x = document.createElement("div");
            x.classList.add("game-wrapper");
            x.innerHTML = `<a href="" class="game-display"><img src="${game["header_image"]}" class="game-img"></a>
            <div class="game-info">
                <div class="game-name">${game.name}</div>
                <div class="game-price">$${game.price}</div>
            </div>`;
            displayBoard.appendChild(x);
        });
    } catch (e) {
        console.log("error: ", e);
    }
}

const renderGenreList = async () => {
    try {
       const allGenres = await getAllGenres();
       
       allGenres.forEach((genre) => {
            genre.name = genre.name[0].toUpperCase() + genre.name.substring(1);

            const x = document.createElement("li");
            // x.setAttribute("href", "#");
            x.classList.add("categorize-item");
            x.innerHTML = `${genre.name}`;
            genresDisplay.append(x);
        })
    } catch (e) {
        console.log("err", e)
    }
}

renderFeatureGames();
renderGamesBoard();
renderGenreList();

genresDisplay.addEventListener("click", (e) => {
    const genre = e.target.textContent.toLowerCase();
    displayBoard.innerHTML = ""
    console.log(genre);
    renderGamesBoard(query=genre);
});

inputButton.addEventListener("click", async () => {
    // đổi approach search backend, q *Get all games
    console.log(inputBox.value);    
    const allGames = await getAllGames("action");
    const result = allGames.find((game) => game.name === inputBox.value);
    displayBoard.innerHTML="";
    const x = document.createElement("div");
            x.classList.add("game-wrapper");
            x.innerHTML = `<a href="" class="game-display"><img src="${result["header_image"]}" class="game-img"></a>
            <div class="game-info">
                <div class="game-name">${result.name}</div>
                <div class="game-price">$${result.price}</div>
            </div>`;
            displayBoard.appendChild(x);
});