// --- 1. VARIABLE DECLARATIONS ---
const searchIcon = document.getElementById('searchIcon');
const title = document.getElementById('title');
const searchBox = document.getElementById('searchBox');
const searchInput = searchBox.querySelector('input');
const searchResultsContainer = document.getElementById('searchResultsContainer');
const allContentSections = document.querySelectorAll('.content-section > h2, .content-section > div[id$="-container"], .content-section > .view-more-container');
const navItems = document.querySelectorAll('.nav-item');
const myListButtons = document.querySelectorAll('.my-list-button');
const allAnimes = [
    { id: 1, title: 'Jujutsu Kaisen', genre: 'Action', rating: 8.7, imageUrl: 'https://m.media-amazon.com/images/M/MV5BNGY4MTg3NzgtMmFkZi00NTg5LWExMmEtMWI3YzI1ODdmMWQ1XkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_FMjpg_UX1000_.jpg', episodes: 24, tags: ['new', 'tophit', 'popular'] },
    { id: 2, title: 'Demon Slayer', genre: 'Fantasy', rating: 9.2, imageUrl: 'https://m.media-amazon.com/images/M/MV5BZjZjNzI5MDctY2Y4YS00ZmM4LTg0YzgtYzdhNTA4YmM5OQxXkEyXkFqcGdeQXVyNTM4OTY4ODg@._V1_FMjpg_UX1000_.jpg', episodes: 26, tags: ['tophit', 'popular', 'favourite'] },
    { id: 3, title: 'Spy x Family', genre: 'Comedy', rating: 8.8, imageUrl: 'https://m.media-amazon.com/images/M/MV5BZWFTYjU1NGItMjA3My00YjFiLWFlODUtN2FhYWQ1NGI2OTRjXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_FMjpg_UX1000_.jpg', episodes: 12, tags: ['new', 'favourite'] },
    { id: 4, title: 'Attack on Titan', genre: 'Dark Fantasy', rating: 9.0, imageUrl: 'https://m.media-amazon.com/images/M/MV5BNDFjYTIxMjctYTQ2ZC00OGQwLThjcjMtMjc1NjRmZGMwOWU4XkEyXkFqcGdeQXVyNzI3NjY3NjQ@._V1_FMjpg_UX1000_.jpg', episodes: 75, tags: ['tophit', 'popular'] },
    { id: 5, title: 'One Punch Man', genre: 'Action, Comedy', rating: 8.7, imageUrl: 'https://m.media-amazon.com/images/M/MV5BMzE5MDM2NDY0OF5BMl5BanBnXkFtZTgwNjM3NDQxNzE@._V1_.jpg', episodes: 12, tags: ['favourite', 'popular'] },
    { id: 6, title: 'My Hero Academia', genre: 'Adventure', rating: 8.4, imageUrl: 'https://m.media-amazon.com/images/M/MV5BOGZmYjdjN2UtNjAwZi00YmEyLWFhNTEtNjA1NjgxMGEzY2I5XkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_FMjpg_UX1000_.jpg', episodes: 113, tags: ['popular', 'favourite'] }
];
const newReleasesContainer = document.getElementById('new-releases-container');
const topHitsContainer = document.getElementById('top-hits-container');
const mostFavouriteContainer = document.getElementById('most-favourite-container');
const mostPopularContainer = document.getElementById('most-popular-container');

// --- 2. FUNCTIONS ---
function showSuggestions(query) {
    searchResultsContainer.innerHTML = '';
    if (query.length === 0) { searchResultsContainer.style.display = 'none'; return; }
    const filteredAnimes = allAnimes.filter(anime => anime.title.toLowerCase().startsWith(query.toLowerCase()));
    if (filteredAnimes.length > 0) {
        filteredAnimes.forEach(anime => {
            const item = document.createElement('div');
            item.classList.add('suggestion-item'); item.textContent = anime.title;
            item.addEventListener('click', () => {
                searchInput.value = anime.title;
                searchResultsContainer.style.display = 'none';
                performSearch(anime.title);
            });
            searchResultsContainer.appendChild(item);
        });
        searchResultsContainer.style.display = 'block';
    } else { searchResultsContainer.style.display = 'none'; }
}

function performSearch(query) {
    const lowerCaseQuery = query.toLowerCase();
    let dynamicResultsContainer = document.querySelector('.search-dynamic-results');
    if (query.length === 0) {
        allContentSections.forEach(el => el.style.display = '');
        if (dynamicResultsContainer) dynamicResultsContainer.innerHTML = '';
        return;
    }
    allContentSections.forEach(el => el.style.display = 'none');
    let resultsHTML = `<h2>Search Results for "${query}"</h2><div class="anime-row">`;
    const searchResults = allAnimes.filter(anime => anime.title.toLowerCase().startsWith(lowerCaseQuery));
    if (searchResults.length > 0) {
        searchResults.forEach(anime => {
            resultsHTML += anime.tags.includes('new') ? createNewReleaseCard(anime) : createAnimeCard(anime);
        });
    } else { resultsHTML = `<h2>No results found for "${query}"</h2>`; }
    resultsHTML += `</div>`;
    if (!dynamicResultsContainer) {
        dynamicResultsContainer = document.createElement('div');
        dynamicResultsContainer.className = 'content-section search-dynamic-results';
        document.querySelector('.main-slider').after(dynamicResultsContainer);
    }
    dynamicResultsContainer.innerHTML = resultsHTML;
}

function createNewReleaseCard(anime) {
    return `<div class="new-release-card"><div class="rating-tag">${anime.rating}</div><img src="${anime.imageUrl}" alt="${anime.title}"><div class="new-release-card-content"><h3 class="new-release-card-title">${anime.title}</h3><div class="new-release-card-genres"><span>${anime.genre}</span></div></div></div>`;
}

function createAnimeCard(anime) {
    return `<div class="anime-card-small"><img src="${anime.imageUrl}" alt="${anime.title}"><div class="info-overlay"><h3 class="anime-card-title-small">${anime.title}</h3><p class="episodes">Episodes: ${anime.episodes}</p></div></div>`;
}

// --- 3. EVENT LISTENERS & INITIALIZATIONS ---
searchIcon.addEventListener('click', () => {
    const isNowActive = searchBox.classList.toggle('active');
    title.classList.toggle('hidden', isNowActive);
    if (isNowActive) { searchInput.focus(); }
});

searchInput.addEventListener('input', () => {
    const query = searchInput.value;
    showSuggestions(query);
    if (query.length === 0) { performSearch(''); }
});

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        performSearch(searchInput.value);
        searchResultsContainer.style.display = 'none';
    }
});

document.addEventListener('click', (e) => {
    if (!searchBox.contains(e.target) && !searchIcon.contains(e.target)) {
        searchResultsContainer.style.display = 'none';
        if (searchInput.value === '') {
            searchBox.classList.remove('active');
            title.classList.remove('hidden');
        }
    }
});

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

myListButtons.forEach(button => {
    button.addEventListener('click', () => {
        const textSpan = button.querySelector('.text');
        if (button.classList.contains('added')) {
            button.classList.remove('added'); textSpan.textContent = '+ My List';
        } else {
            button.classList.add('added'); textSpan.textContent = 'Added';
        }
    });
});

window.addEventListener('load', function() {
    allAnimes.forEach(anime => {
        if (anime.tags.includes('new')) { newReleasesContainer.innerHTML += createNewReleaseCard(anime); }
        if (anime.tags.includes('tophit')) { topHitsContainer.innerHTML += createAnimeCard(anime); }
        if (anime.tags.includes('favourite')) { mostFavouriteContainer.innerHTML += createAnimeCard(anime); }
        if (anime.tags.includes('popular')) { mostPopularContainer.innerHTML += createAnimeCard(anime); }
    });
});

var swiper = new Swiper('.main-slider', {
    effect: 'fade', 
    fadeEffect: { crossFade: true }, 
    speed: 1000,
    slidesPerView: 1, 
    loop: false, 
    autoplay: { 
        delay: 4000, 
        disableOnInteraction: false 
    },
    pagination: { 
        el: '.swiper-pagination', 
        clickable: true 
    },
    on: {
        reachEnd: function () {
          this.autoplay.stop(); 
          this.params.autoplay.reverseDirection = true; 
          this.autoplay.start();
        },
        reachBeginning: function () {
          this.autoplay.stop(); 
          this.params.autoplay.reverseDirection = false; 
          this.autoplay.start();
        },
    }
});
