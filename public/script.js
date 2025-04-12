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
    const btnScrollToTop = document.getElementById('btn-scroll-to-top');
    const alertSearch = document.getElementById('alert-search');

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
            scrollToTop();
        }
    }

    function nextPage() {
        if(page >= 1) {
            page += 1;
            updatePage();
            scrollToTop();
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
            movieCard.className = 'bg-neutral-800 w-full p-4 md:rounded-sm xl:rounded-lg';
            movieCard.innerHTML = ` <img src="${API_IMAGE_URL}${poster_path}" alt="Gambar ${title}" class="max-w-52 md:max-w-60 h-auto mx-auto">
                                    <h3 class="text-white mt-2 text-center mb-1">${title}</h3>
                                    <p class="text-gray-400 text-justify">${overview.substring(0,200)}...</p>
                                    <div class="wrap-btn flex justify-end">
                                        <button class="text-white bg-indigo-600 py-1.5 px-3 cursor-pointer hover:bg-indigo-700 active:bg-indigo-800 rounded-sm mt-2 md:py-2 md:px-4">Show Detail</button>
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
            alertSearch.classList.remove('hidden');
            alertSearch.classList.add('opacity-100');
            setTimeout(() => {
                alertSearch.classList.remove('opacity-100');
                alertSearch.classList.add('opacity-0');
                setTimeout(() => {
                    alertSearch.classList.add('hidden');
                }, 500)
            }, 3000)
            
        }
    });


    window.addEventListener('scroll', () => {
        if(window.scrollY > 300) {
            btnScrollToTop.classList.remove('hidden');
        } else {
            btnScrollToTop.classList.add('hidden');
        }
    });

    btnScrollToTop.addEventListener('click', () => {
        scrollToTop();
    })

    function scrollToTop() {
        window.scrollTo({
            top: 0
        });
    };
    



    updatePage();

    title.addEventListener('click', () => {
        location.reload();
    });
});

