document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '057fa9ac2c736d95a9a4f6c3496f80b1';

    let page = 1;
    let latestMovies = [];

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
    const modalBoxContainer = document.getElementById('modal-box-container');
    
    

    async function getMovies(url) {
        const res = await fetch(url);
        const data = await res.json();
        latestMovies = data.results;
        showMovies(data.results);
    }

    function updatePage() {
        getMovies(API_URL());
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
        moviesContainer.innerHTML = '';
        const notFound = document.getElementById('not-found');
        if(movies.length === 0) {
            notFound.classList.remove('hidden');
            notFound.classList.add('flex');
        } else {
            notFound.classList.add('hidden');
            notFound.classList.remove('flex');
        }

        movies.forEach(movie => {
            const {title, poster_path, overview,} = movie;
            const movieCard = document.createElement('div');
            movieCard.className = 'bg-neutral-800 w-full p-4 md:rounded-sm xl:rounded-lg relative';
            movieCard.innerHTML = ` <img src="${API_IMAGE_URL}${poster_path}" alt="Gambar ${title}" class="max-w-52 md:max-w-60 h-auto mx-auto">
                                    <h3 class="text-white mt-2 text-center mb-1">${title}</h3>
                                    <p class="text-gray-400 text-justify mb-8">${overview.substring(0,200)}...</p>
                                    <button id="btn-show-detail" class="absolute bottom-2 right-2 text-white bg-indigo-600 py-1.5 px-3 cursor-pointer hover:bg-indigo-700 active:bg-indigo-800 rounded-sm mt-2 md:py-2 md:px-4">Show Detail</button>`;
            moviesContainer.appendChild(movieCard);
        });
    };

    
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
    
    function showDetail({title, poster_path, overview, release_date, popularity}) {
        modalBoxContainer.innerHTML = ` <div id="modal-content" class="w-[90vw] min-h-[50vh] max-h-[75vh] md:w-xl md:min-h-96 md:max-h-96 xl:w-3xl xl:max-h-[420px]  overflow-y-auto bg-neutral-800 mx-auto rounded-sm relative p-4 transform -translate-y-full opacity-0 transition-all duration-500 ease-out md:flex">
                                            <button id="btn-close-modal-box" class="bg-red-600 hover:bg-red-700 active:bg-red-800 absolute top-2 right-2 text-white p-2 rounded-full cursor-pointer">
                                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#ffffff"/></svg>
                                            </button>
                                            <img src="${API_IMAGE_URL}${poster_path}" alt="Gambar" class="mx-auto md:mr-4 max-w-48 xl:max-w-3xs max-h-[100%] object-contain self-start">
                                            <div class="info-detail">
                                                <h3 class="text-white text-center mt-2">${title}</h3>
                                                <p class="text-gray-400"><strong>Release :</strong> ${release_date}</p>
                                                <p class="text-gray-400"><strong>Overview :</strong> ${overview}</p>
                                                <p class="text-gray-400"><strong>Popularity :</strong> ${popularity}</p>
                                            </div>
                                        </div>`
        modalBoxContainer.classList.remove('hidden');
        modalBoxContainer.classList.add('flex');
        setTimeout(() => {
            const modalContent = document.getElementById('modal-content');
            modalContent.classList.remove('-translate-y-full', 'opacity-0');
            modalContent.classList.add('translate-y-0', 'opacity-100');
        }, 10);

        const btnCloseModalBox = document.getElementById('btn-close-modal-box');
        btnCloseModalBox.addEventListener('click', () => {
            modalBoxContainer.classList.add('hidden');
            modalBoxContainer.classList.remove('flex');
            modalBoxContainer.innerHTML = '';
        })
    }



    updatePage();

    moviesContainer.addEventListener('click', (e) => {
        if(e.target && e.target.id === 'btn-show-detail') {
            const card = e.target.closest('div');
            const title = card.querySelector('h3').textContent;
            const movieDetail = latestMovies.find(movie => movie.title === title);
            const overview = movieDetail?.overview || 'Tidak ada deskripsi';
            const imgSrc = card.querySelector('img').getAttribute('src');
            const poster_path = imgSrc.replace(`${API_IMAGE_URL}`, '');
            const release_date = movieDetail?.release_date ? formatTanggalIndonesia(movieDetail.release_date) : 'unknown';
            const popularity = movieDetail?.popularity || 'unknown';
            showDetail({title, poster_path, overview, release_date, popularity});
        }
    })

    title.addEventListener('click', () => {
        location.reload();
    });


    function formatTanggalIndonesia(tanggalString) {
        const tanggal = new Date(tanggalString);
        return tanggal.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };


    document.querySelectorAll('.faq-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            const icon = button.querySelector('svg');

            answer.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        });
    });
    
    
});

