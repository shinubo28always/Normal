// =================================================================
// ANI-REAL WEBSITE SCRIPT - FULLY UPDATED & OPTIMIZED VERSION
// =================================================================

// Step 1: Zaroori functions Firebase se import karein
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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
const db = getFirestore(app);


// =================================================================
// SECTION 1: TOP SLIDER FUNCTIONS (Slider initialization updated as requested)
// =================================================================

async function loadSlidesFromFirestore() {
    const swiperWrapper = document.querySelector('.main-slider .swiper-wrapper');
    if (!swiperWrapper) return;

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
            </div>`;
    });
    swiperWrapper.innerHTML = slidesHTML;

    // Initialize Swiper AFTER slides are loaded
    initializeSwiper();

    // Setup buttons for the newly loaded slides
    setupMyListButtons();
}

function initializeSwiper() {
    new Swiper('.main-slider', {
        effect: 'fade',
        fadeEffect: { crossFade: true },
        speed: 1000,
        slidesPerView: 1,
        loop: false, 
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
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
        },
    });
}


// =================================================================
// SECTION 2: ANIME CARD SECTIONS FUNCTIONS
// =================================================================

// Function to create HTML for a 'New Release' style card (KOI BADLAV NAHI)
function createNewReleaseCard(anime) {
    return `
        <div class="new-release-card">
            <div class="rating-tag">${anime.rating || 'N/A'}</div>
            <img src="${anime.imageUrl}" alt="${anime.title}">
            <div class="new-release-card-content">
                <h3 class="new-release-card-title">${anime.title}</h3>
                <div class="new-release-card-genres"><span>${anime.genre}</span></div>
            </div>
        </div>`;
}

// Function to create HTML for a standard anime card (FINAL AND CORRECT VERSION)
function createAnimeCard(anime) {
    // YEH LINE BADAL GAYI HAI
    // Yeh ab check karega ki episode hai ya nahi. Agar nahi hai, to "N/A" dikhayega.
    const episodeText = anime.episode ? `Ep: ${anime.episode}` : 'Ep: N/A';

    return `
        <a href="#" class="standard-anime-card">
            <img class="card-poster" src="${anime.imageUrl}" alt="${anime.title}">
            
            <div class="card-overlay">
                <h3 class="title">${anime.title}</h3>
                <p class="episodes">${episodeText}</p>
            </div>

            ${anime.rating ? `<div class="rating-badge">${anime.rating}</div>` : ''}
        </a>
    `;
}

async function loadCategory(tag, containerId, cardCreatorFunction) {
    const container = document.getElementById(containerId);
    const section = document.getElementById(containerId.replace('-container', '-section')); 
    if (!container || !section) return;

    // Show loading spinner
    container.innerHTML = `<div class="spinner-container"><div class="spinner"></div></div>`;
    section.style.display = 'block'; 

    try {
        const animesRef = collection(db, 'animes');
        const q = query(animesRef, where("tags", "array-contains", tag));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            section.style.display = 'none';
        } else {
            let cardsHTML = '';
            querySnapshot.forEach(doc => {
                cardsHTML += cardCreatorFunction(doc.data());
            });
            container.innerHTML = cardsHTML;
        }
    } catch (error) {
        console.error("Error loading category:", tag, error);
        container.innerHTML = `<p style="padding-left: 10px; color: #ff6b6b;">Could not load this section.</p>`;
    }
}


// =================================================================
// SECTION 3: GENERAL UI EVENT LISTENERS (KOI BADLAV NAHI)
// =================================================================

function setupGeneralEventListeners() {
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

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

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
    // Setup General UI (Header, Nav)
    setupGeneralEventListeners();
    
    // Load data from Firestore
    loadSlidesFromFirestore();
    
    // LOAD EACH ANIME CATEGORY EFFICIENTLY
    loadCategory('new', 'new-releases-container', createNewReleaseCard);
    loadCategory('tophit', 'top-hits-container', createAnimeCard);
    loadCategory('favourite', 'most-favourite-container', createAnimeCard);
    loadCategory('popular', 'most-popular-container', createAnimeCard);
});
