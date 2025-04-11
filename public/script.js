document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '057fa9ac2c736d95a9a4f6c3496f80b1';

    let page = 1;
    const API_URL = () => `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}`;
    const API_IMAGE_URL = 'https://image.tmdb.org/t/p/w1280';
    const API_SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`

    const moviesContainer = document.getElementById('movies-container');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    const currentPage = document.getElementById('currentPage');
    const searchKeyword = document.getElementById('searchKeyword');
    const inputKeyword = document.getElementById('inputKeyword');
    const title = document.getElementById('title');

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
        if (!moviesContainer) {
            console.error('⛔ ID #movies-container tidak ditemukan. Pastikan id-nya benar dan elemen ada di HTML!');
        } else {
            console.log('✅ #movies-container ditemukan.');
        }
        moviesContainer.innerHTML = '';
        movies.forEach(movie => {
            const {title, poster_path, overview} = movie;
            const movieCard = document.createElement('div');
            movieCard.className = 'bg-slate-800 w-full p-4';
            movieCard.innerHTML = ` <img src="${API_IMAGE_URL}${poster_path}" alt="Gambar ${title}" class="max-w-52 h-auto mx-auto">
                                    <h3 class="text-white text-center mb-1">${title}</h3>
                                    <p class="text-slate-400 text-justify">${overview.substring(0,200)}...</p>
                                    <div class="wrap-btn flex justify-end">
                                        <button class="text-white bg-slate-950 py-1.5 px-3 hover:bg-slate-900 rounded-sm mt-2">Show Detail</button>
                                    </div>`;
            moviesContainer.appendChild(movieCard);
        })
    }

    
    searchKeyword.addEventListener('click', (e) => {
        e.preventDefault();
        
        // const queryValue = inputKeyword.value;

        if(inputKeyword.value !== '') {
            getMovies(API_SEARCH_URL + inputKeyword.value);
            inputKeyword.value = '';
        } else {
            alert('kolom pencarian tidak boleh kosong!')
        }
    })



    updatePage();

    title.addEventListener('click', () => {
        location.reload();
    });
});

