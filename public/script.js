const API_KEY = '057fa9ac2c736d95a9a4f6c3496f80b1';

let page = 1;
const API_URL = () => `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}`;
const API_IMAGE_URL = 'https://image.tmdb.org/t/p/w1280';
const API_SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`

async function getMovies(url) {
    const res = await fetch(url)
    const data = await res.json()
    showMovies(data.results)
}

function updatePage() {
    getMovies(API_URL())
    currentPage.innerHTML = page;
}

function prevPage() {
    if(page > 1) {
        page -= 1;
        updatePage();
    }
}

function nextPage() {
    if(page >= 1) {
        page += 1;
        updatePage();
    }
}

prev.addEventListener('click', () => {
    prevPage();
})

next.addEventListener('click', () => {
    nextPage();
})

function showMovies(movies) {
    moviesContainer.innerHTML = ''
    movies.forEach(movie => {
        const {title, poster_path, overview} = movie;
        const movieCard = document.createElement("div");
        movieCard.classList.add('movie-item')
        movieCard.classList.add('bg-slate-800')
        movieCard.classList.add('p-4')
        movieCard.innerHTML = ` <img src="${API_IMAGE_URL}${poster_path}" alt="${title}">
                                <h3 class="text-lg text-white">${title}</h3>
                                <p class="text-sm text-slate-300">${overview.substring(0, 200)}...</p>`;
        moviesContainer.appendChild(movieCard);
    })
}


searchKeyword.addEventListener('click', (e) => {
    e.preventDefault();
    const queryValue = inputKeyword.value;

    if(searchKeyword !== '') {
        getMovies(API_SEARCH_URL + queryValue);
        inputKeyword.value = '';
    }
})



updatePage();

title.addEventListener('click', () => {
    location.reload();
});