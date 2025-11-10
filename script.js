// STEP 1: FIREBASE SETUP
// Import functions from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADkvP-TKwlV4JfYfY6rlfyhcRKmfc_Cqw",
  authDomain: "anireal-web-68c69.firebaseapp.com",
  databaseURL: "https://anireal-web-68c69-default-rtdb.firebaseio.com",
  projectId: "anireal-web-68c69",
  storageBucket: "anireal-web-68c69.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "1065490338135",
  appId: "1:1065490338135:web:eaf17782c03343f3a3ae12",
  measurementId: "G-ZJV5K1X7XF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Get Firestore instance

// Wait until the DOM is fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selectors ---
    const newReleasesContainer = document.getElementById('new-releases-container');
    const topHitsContainer = document.getElementById('top-hits-container');
    const mostFavouriteContainer = document.getElementById('most-favourite-container');
    const mostPopularContainer = document.getElementById('most-popular-container');

    // --- Functions to create HTML cards ---
    function createNewReleaseCard(anime) {
        // FIXED SYNTAX: Used template literal (backticks)
        return `
            <div class="new-release-card" data-id="${anime.id}">
                <div class="rating-tag">${anime.rating}</div>
                <img src="${anime.imageUrl}" alt="${anime.title}">
                <div class="new-release-card-content">
                    <h3 class="new-release-card-title">${anime.title}</h3>
                    <div class="new-release-card-genres"><span>${anime.genre}</span></div>
                </div>
            </div>
        `;
    }

    function createAnimeCard(anime) {
        // FIXED SYNTAX and RENAMED CLASS
        return `
            <div class="row-anime-card" data-id="${anime.id}">
                <img src="${anime.imageUrl}" alt="${anime.title}">
                <div class="info-overlay">
                    <h3 class="title">${anime.title}</h3>
                    <p class="episodes">Episodes: ${anime.episodes}</p>
                </div>
            </div>
        `;
    }

    // --- Function to display animes in their respective containers ---
    function displayAnimes(animes) {
        // Clear existing content
        newReleasesContainer.innerHTML = '';
        topHitsContainer.innerHTML = '';
        mostFavouriteContainer.innerHTML = '';
        mostPopularContainer.innerHTML = '';
        
        animes.forEach(anime => {
            // Check which category the anime belongs to
            if (anime.tags.includes('new')) {
                newReleasesContainer.innerHTML += createNewReleaseCard(anime);
            }
            if (anime.tags.includes('tophit')) {
                topHitsContainer.innerHTML += createAnimeCard(anime);
            }
            if (anime.tags.includes('favourite')) {
                mostFavouriteContainer.innerHTML += createAnimeCard(anime);
            }
            if (anime.tags.includes('popular')) {
                mostPopularContainer.innerHTML += createAnimeCard(anime);
            }
        });
    }

    // STEP 2: FETCH DATA FROM FIRESTORE
    async function fetchAnimesFromFirestore() {
        try {
            console.log("Fetching animes from Firestore...");
            const animesCollection = collection(db, "animes"); // Assumes your collection is named "animes"
            const animeSnapshot = await getDocs(animesCollection);
            const animeList = animeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            console.log("Fetched Animes:", animeList);
            displayAnimes(animeList); // Display the fetched data
            
        } catch (error) {
            console.error("Error fetching animes from Firestore: ", error);
            // Optional: Display an error message to the user on the page
        }
    }
    
    // Initial data load
    fetchAnimesFromFirestore();


    // --- Header, Slider, and Nav Scripts ---
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

    var swiper = new Swiper('.main-slider', {
        effect: 'fade',
        fadeEffect: { crossFade: true },
        speed: 1000,
        loop: true,
        autoplay: { delay: 4000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
    });

    const myListButtons = document.querySelectorAll('.my-list-button');
    myListButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('added');
        });
    });
});
