// =================================================================
// ANI-REAL WEBSITE SCRIPT - UPDATED VERSION
// =================================================================

// Step 1: Zaroori functions Firebase se import karein
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Step 2: Aapka Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyADkvP-TKwlV4JfYfY6rlfyhcRKmfc_Cqw",
    authDomain: "anireal-web-68c69.firebaseapp.com",
    databaseURL: "https://anireal-web-68c69-default-rtdb.firebaseio.com",
    projectId: "anireal-web-68c69",
    storageBucket: "anireal-web-68c69.appspot.com",
    messagingSenderId: "1065490338135",
    appId: "1:1065490338135:web:eaf17782c03343f3a3ae12",
    measurementId: "G-ZJV5K1X7XF"
};

// Step 3: Firebase ko initialize karein
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore database ka reference


// =================================================================
// SECTION 1: TOP SLIDER FUNCTIONS
// =================================================================

// Function: Firestore se slider ka data laane ke liye
async function loadSlidesFromFirestore() {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    if (!swiperWrapper) return; // Agar slider page par na ho toh function rok dein

    const slidesCollection = collection(db, 'slides');
    const querySnapshot = await getDocs(slidesCollection);

    let slidesHTML = '';
    querySnapshot.forEach((doc) => {
        const slideData = doc.data();
        slidesHTML += `
            <div class="swiper-slide">
                <img src="${slideData.bannerImage}" alt="Banner">
                <div class="slide-content">
                    <h3 class="slide-title">${slideData.title}</h3>
                    <p class="slide-genres">${slideData.genres}</p>
                    <div class="slide-buttons">
                        <button class="play-button">► Play</button>
                        <button class="my-list-button">
                            <span class="icon">✔</span>
                            <span class="text">+ My List</span>
                        </button>
                    </div>
                </div>
                <div class="anime-card">
                    <img src="${slideData.cardImage}" alt="Anime Card">
                    <div class="anime-card-info">
                        <p class="anime-card-title">${slideData.title}</p>
                        <p class="anime-card-episode">${slideData.episode}</p>
                    </div>
                </div>
            </div>
        `;
    });

    swiperWrapper.innerHTML = slidesHTML;

    // Data load hone ke baad hi Swiper ko chalu karein
    initializeSwiper();
    // Aur "My List" button ke liye event listeners setup karein
    setupMyListButtons();
}

// Function: Swiper library ko initialize karne ke liye
function initializeSwiper() {
    new Swiper('.main-slider', {
        effect: 'fade',
        fadeEffect: { crossFade: true },
        speed: 1000,
        slidesPerView: 1,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        }
    });
}


// =================================================================
// SECTION 2: ANIME CARD SECTIONS FUNCTIONS
// =================================================================

// Function: 'New Release' style ka card banane ke liye
function createNewReleaseCard(anime) {
    return `
        <div class="new-release-card">
            <div class="rating-tag">${anime.rating}</div>
            <img src="${anime.imageUrl}" alt="${anime.title}">
            <div class="new-release-card-content">
                <h3 class="new-release-card-title">${anime.title}</h3>
                <div class="new-release-card-genres"><span>${anime.genre}</span></div>
            </div>
        </div>
    `;
}

// Function: Baaki sabhi sections ('Top Hits' etc.) ka card banane ke liye
function createAnimeCard(anime) {
    return `
        <div class="anime-card">
            <img src="${anime.imageUrl}" alt="${anime.title}">
            <div class="info-overlay">
                <h3 class="title">${anime.title}</h3>
                <p class="episodes">Episodes: ${anime.episodes}</p>
            </div>
        </div>
    `;
}

// Main Function: Firestore se saara anime data laakar sections mein daalne ke liye
async function loadAllAnimeSections() {
    const newReleasesContainer = document.getElementById('new-releases-container');
    const topHitsContainer = document.getElementById('top-hits-container');
    const mostFavouriteContainer = document.getElementById('most-favourite-container');
    const mostPopularContainer = document.getElementById('most-popular-container');

    const animesCollection = collection(db, 'animes');
    const querySnapshot = await getDocs(animesCollection);

    querySnapshot.forEach(doc => {
        const animeData = doc.data();

        // Tags ke basis par check karna ki anime kis category mein jayega
        if (animeData.tags && animeData.tags.includes('new')) {
            newReleasesContainer.innerHTML += createNewReleaseCard(animeData);
        }
        if (animeData.tags && animeData.tags.includes('tophit')) {
            topHitsContainer.innerHTML += createAnimeCard(animeData);
        }
        if (animeData.tags && animeData.tags.includes('favourite')) {
            mostFavouriteContainer.innerHTML += createAnimeCard(animeData);
        }
        if (animeData.tags && animeData.tags.includes('popular')) {
            mostPopularContainer.innerHTML += createAnimeCard(animeData);
        }
    });
}


// =================================================================
// SECTION 3: GENERAL UI EVENT LISTENERS
// =================================================================

// Function: Header, Search, Bottom Nav ke liye event listeners
function setupGeneralEventListeners() {
    // --- Header Search Script ---
    const searchIcon = document.getElementById('searchIcon');
    const title = document.getElementById('title');
    const searchBox = document.getElementById('searchBox');
    const searchInput = searchBox.querySelector('input');

    searchIcon.addEventListener('click', () => {
        const isNowActive = searchBox.classList.toggle('active');
        title.classList.toggle('hidden', isNowActive);
        if (isNowActive) {
            searchInput.focus();
        }
    });

    searchInput.addEventListener('blur', () => {
        if (searchInput.value === '') {
            searchBox.classList.remove('active');
            title.classList.remove('hidden');
        }
    });

    // --- Bottom Navigation Script ---
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

// Function: 'My List' button ke liye (yeh alag hai kyunki slider ke load hone ke baad chalta hai)
function setupMyListButtons() {
    const myListButtons = document.querySelectorAll('.my-list-button');
    myListButtons.forEach(button => {
        button.addEventListener('click', () => {
            const textSpan = button.querySelector('.text');
            if (button.classList.contains('added')) {
                button.classList.remove('added');
                textSpan.textContent = '+ My List';
            } else {
                button.classList.add('added');
                textSpan.textContent = 'Added';
            }
        });
    });
}


// =================================================================
// PAGE LOAD EVENT: Sab kuch yahin se shuru hota hai
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // General UI (Header, Nav) ko setup karo
    setupGeneralEventListeners();
    
    // Firestore se Slider ka data load karo
    loadSlidesFromFirestore();
    
    // Firestore se baaki saare Anime Sections ka data load karo
    loadAllAnimeSections();
});
