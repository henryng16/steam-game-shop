const BASE_URL = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/";
const displayBoard = document.querySelector
("#display-board");
const slider = document.querySelector("#slider-wrapper");
const genresDisplay = document.querySelector(".categorize-list");
const inputBox = document.querySelector(".input-box");
const inputButton = document.querySelector(".input-btn");
const loadMore = document.querySelector(".load-more");
const displayWrapper = document.querySelector(".display-wrapper");

let numberOfPage = 1;
let query = '';
let searchNameQuery = '';



const getAllGames = async (query, num) => {
    try {
        let queryString =  (query) ? `&${query}` : "";
        let numOfPage = `${num*16}`
        const url = `${BASE_URL}games?limit=${numOfPage}${queryString}`;
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
};

const getAllGenres = async () => {
    try {
        const url = `${BASE_URL}genres?limit=40`;
        const data = await fetch(url);
        const dataJson = await data.json();
        return dataJson.data
    } catch (e) {
        console.log("error: ", e)
    }
};

const getGameDetail = async (appId) => {
    try {
        const url = `${BASE_URL}single-game/${appId}`;
        const data = await fetch(url);
        const dataJson = await data.json();
        return dataJson.data;
    } catch (e) {
        console.log("error: ", e);
    }
}

const renderGameDetail = async (appId) => {
    loadMore.setAttribute("style", "display: none;");
    displayBoard.innerHTML = `<h1 style="font-size: 1rem; color: whitesmoke; padding: 1rem 0.5rem;">LOADING..........................</h1>`;
    const gameDetail = await getGameDetail(appId);
    const steamSpyTag = gameDetail["steamspy_tags"];
    displayBoard.innerHTML = "";
    const x = document.createElement('div');
    x.classList.add("game-detail-container");
    x.innerHTML = `<div class="section-name" style="margin: 0rem 0.5vh -1rem; color: whitesmoke;">
                    <h2>${gameDetail.name}</h2>
                </div><div class="game-detail-wrapper"><img src="${gameDetail["header_image"]}" class="game-img">
  <div class="game-description">
    
    <p class="release-date">Release date: ${gameDetail["release_date"].substring(0,10)}</p>
    <p class="description">${gameDetail.description}</p>
    <div class="game-tags">
    </div>
  </div></div`
    displayBoard.append(x);
    const gameTags = document.querySelector(".game-tags");

    steamSpyTag.forEach((tag) => {
        const gameTag = document.createElement("button");
        gameTag.classList.add("tag");
        gameTag.innerHTML = tag[0].toUpperCase() + tag.substring(1);
        gameTags.append(gameTag);
        
        // add event listener for each tag
        gameTag.addEventListener('click', (_) => {
            query = `steamspy_tags=${_.target.textContent.toLowerCase()}`;
            numberOfPage = 1;
            renderGamesBoard(query, numberOfPage);
        });
    })
    
};

const renderFeatureGames = async () => {
    try {
        const featureGames = await getFeatureGames();
        featureGames.forEach((game) => {
            const x = document.createElement("div");
            x.classList.add("trending-game");
            x.innerHTML = `<a href="#" class="game-display"><img src="${game["header_image"]}" class="game-img ${game.appid}">
            <div class="game-info">
                <div class="game-name ${game.appid}">${game.name}</div>
                <div class="game-price ${game.appid}">${game.price}</div>
            </div></a>`;
            slider.appendChild(x);

            // add event listener to each game
            x.addEventListener('click', (_) => {
                const appId = _.target.classList[1];
                renderGameDetail(appId);
            })
        });
    } catch (e) {
        console.log("error: ", e);
    }
};

const renderGamesBoard = async (query, num) => {
    try {
        loadMore.setAttribute("style", "display: initial;");
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
                x.innerHTML = `<a href="#" class="game-display"><img src="${game["header_image"]}" class="game-img ${game.appid}">
                <div class="game-info">
                    <div class="game-name ${game.appid}">${game.name}</div>
                    <div class="game-price ${game.appid}">$${game.price}</div>
                </div></a>`;
                displayBoard.appendChild(x);

                // add event listener for each game
                x.addEventListener('click', (_) => {
                    const appId = _.target.classList[1];
                    renderGameDetail(appId);
                })
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
};


// initialize 
renderFeatureGames();
renderGamesBoard("", numberOfPage);
renderGenreList();

// render game board by genres
genresDisplay.addEventListener("click", (e) => {
    inputBox.value = "";
    numberOfPage = 1;
    query = "genres=" + e.target.textContent.toLowerCase();
    displayBoard.innerHTML = ""
    renderGamesBoard(query, numberOfPage);
});

// search game by input text
inputButton.addEventListener("click", () => {
    // đổi approach search backend, q *Get all games
    query = '';
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
    if (query) {
        renderGamesBoard(query, numberOfPage);
    } else {
        renderGamesBoard(searchNameQuery, numberOfPage);
    }
})





