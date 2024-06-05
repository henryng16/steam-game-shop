const getAllGames = async () => {
    try {
        const url = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/games"
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
        const url = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/features"
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
        const url = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/genres"
        const data = await fetch(url);
        const dataJson = await data.json();
        console.log(dataJson);
        return dataJson
    } catch (e) {
        console.log("error: ", e)
    }
    
}
let displayBoard = document.querySelector
("#display-board");
let slider = document.querySelector("#slider-wrapper");

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

const renderGamesBoard = async () => {
    try {
        const allGames = await getAllGames();
        allGames.forEach((game) => {
            const x = document.createElement("div");
            x.classList.add("game-wrapper");
            x.innerHTML = `<a href="" class="game-display"><img src="${game["header_image"]}" class="game-img"></a>
            <div class="game-info">
                <div class="game-name">${game.name}</div>
                <div class="game-price">${game.price}</div>
            </div>`;
            displayBoard.appendChild(x);
        });
    } catch (e) {
        console.log("error: ", e);
    }
}

renderFeatureGames();
renderGamesBoard();
