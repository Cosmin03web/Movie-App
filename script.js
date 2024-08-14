const loadText = document.querySelector('.loading-text');
const bg = document.querySelector('.bg');
const form = document.querySelector('#form');
const search =  document.querySelector('#search');
const main = document.querySelector('#main')
const buttons = document.querySelectorAll('.button');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let currentPage = 0;

//Blur

let load = 0;

let int = setInterval(blurring, 5)

function blurring() {
    load++

    if(load > 99){
        clearInterval(int)
    }

    loadText.innerText = `${load}%`
    loadText.style.opacity = scale(load, 0, 100, 1, 0)
    bg.style.filter = `blur(${scale(load, 0, 100, 30, 0)}px)`
}

const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

//API

const API_URL_ORIGINAL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=673a72f28efe06d5b86d1266fc85652b&page=1'
const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=673a72f28efe06d5b86d1266fc85652b&page='
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=673a72f28efe06d5b86d1266fc85652b&query="'

//Get initial movies

const getMovies = async (url) => {
    try{
        const res = await axios.get(url)
        showMovies(res.data.results)
    } catch(e) {
        console.log(e)
    }    
}

getMovies(API_URL_ORIGINAL)

//Bbuttons

buttons.forEach((button, idx) => {
    button.addEventListener('click', () => pageBtn(idx))
});

prevButton.addEventListener('click', () => {
    if (currentPage >= 1) {
        currentPage--;
        getMovies(API_URL + currentPage);
        updateActivePage();
    }
});

nextButton.addEventListener('click', () => {
    currentPage++;
    getMovies(API_URL + currentPage);
    updateActivePage();
});

function pageBtn(num) {
    const page = ((num) + 1)
    if(page >= 0){
        currentPage = page;
        getMovies(API_URL + page)
    } else {
        window.location.reload()
    }
    updateActivePage();
}

function updateActivePage() {
    buttons.forEach(button => {
        if (parseInt(button.textContent) === currentPage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    checkButtons()
};

function checkButtons(){
    if(currentPage === 1){
        prevButton.disabled = true;
    } else{
        prevButton.disabled = false
    }

    if(currentPage === 5){
        nextButton.disabled = true;
    } else{
        nextButton.disabled = false
    }
}

function showMovies(movies) {
    main.innerHTML = ''
    
    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview } = movie

        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')
        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
        `
        main.appendChild(movieEl)
    })
}

function getClassByRate(vote) {
    if(vote >= 8){
        return 'green'
    } else if(vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchTerm = search.value

    if(searchTerm && searchTerm !== ''){
        getMovies(SEARCH_API + searchTerm)

        search.value = ''
    } else{
        window.location.reload()
    }
    blurring
})

