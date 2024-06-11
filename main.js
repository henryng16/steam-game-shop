const BASE_URL = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/";
const displayBoard = document.querySelector
("#display-board");
const slider = document.querySelector("#slider-wrapper");
const genresDisplay = document.querySelector(".categorize-list");
const inputBox = document.querySelector(".input-box");
const inputButton = document.querySelector(".input-btn");
const loadMore = document.querySelector(".load-more");
let numberOfPage = 1;
let genre = '';
let searchNameQuery = '';



const getAllGames = async (query, num) => {
    try {
        // let queryString = `&${query}`;
        let queryString =  (query) ? `&${query}` : "";
        let numOfPage = `${num*16}`
        const url = `${BASE_URL}games?limit=${numOfPage}${queryString}`;
        console.log(url);
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


const renderFeatureGames = async () => {
    try {
        const featureGames = await getFeatureGames();
        featureGames.forEach((game) => {
            const x = document.createElement("div");
            x.classList.add("trending-game");
            x.innerHTML = `<a href="" class="game-display"><img src="${game["header_image"]}" class="game-img">
            <div class="game-info">
                <div class="game-name">${game.name}</div>
                <div class="game-price">${game.price}</div>
            </div></a>`;
            slider.appendChild(x);
        });
    } catch (e) {
        console.log("error: ", e);
    }
}

const renderGamesBoard = async (query, num) => {
    try {
        displayBoard.innerHTML = `<h1 style="font-size: 1rem; color: whitesmoke; padding: 1rem 0.5rem;">LOADING..........................</h1>`;
        const allGames = await getAllGames(query, num);
        displayBoard.innerHTML = "";
        if (allGames.length === 0) {
            const cannotFind = document.createElement("div");
            cannotFind.setAttribute("style", "font-size: 1rem; color: whitesmoke; padding: 1rem 0.5rem;");
            cannotFind.innerHTML = "Cannot find that game, please try with other name."
            displayBoard.append(cannotFind); 
        } else {
            allGames.forEach((game) => {
                const x = document.createElement("div");
                x.classList.add("game-wrapper");
                x.innerHTML = `<a href="" class="game-display"><img src="${game["header_image"]}" class="game-img">
                <div class="game-info">
                    <div class="game-name">${game.name}</div>
                    <div class="game-price">$${game.price}</div>
                </div></a>`;
                displayBoard.appendChild(x);
            })
        };
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
            x.classList.add("categorize-item");
            x.innerHTML = `${genre.name}`;
            genresDisplay.append(x);
        })
    } catch (e) {
        console.log("err", e)
    }
}

renderFeatureGames();
renderGamesBoard(searchNameQuery, numberOfPage);
renderGenreList();

// render game board by genres
genresDisplay.addEventListener("click", (e) => {
    inputBox.value = "";
    numberOfPage = 1;
    genre = "genres=" + e.target.textContent.toLowerCase();
    displayBoard.innerHTML = ""
    renderGamesBoard(genre, numberOfPage);
});

// search game by input text
inputButton.addEventListener("click", () => {
    // đổi approach search backend, q *Get all games
    console.log(inputBox.value);
    genre = '';
    if (inputBox.value) {
        numberOfPage = 1;
        searchNameQuery = "q=" + inputBox.value;
        displayBoard.innerHTML = "";
        renderGamesBoard(searchNameQuery, numberOfPage);
    }
});


// load more button
loadMore.addEventListener("click", () => {
    numberOfPage += 1;
    if (genre) {
        renderGamesBoard(genre, numberOfPage);
    } else {
        renderGamesBoard(searchNameQuery, numberOfPage);
    }
})
