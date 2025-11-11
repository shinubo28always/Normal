// Step 1: Import zaroori functions Firebase se
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Step 2: Aapka Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyADkvP-TKwlV4JfYfY6rlfyhcRKmfc_Cqw",
    authDomain: "anireal-web-68c69.firebaseapp.com",
    databaseURL: "https://anireal-web-68c69-default-rtdb.firebaseio.com",
    projectId: "anireal-web-68c69",
    storageBucket: "anireal-web-68c69.appspot.com", // Correction: .firebasestorage.app se .appspot.com
    messagingSenderId: "1065490338135",
    appId: "1:1065490338135:web:eaf17782c03343f3a3ae12",
    measurementId: "G-ZJV5K1X7XF"
};

// Step 3: Firebase ko initialize karein
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore database ka reference

// Function to fetch slides from Firestore and render them
async function loadSlidesFromFirestore() {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    const slidesCollection = collection(db, 'slides'); // 'slides' aapke collection ka naam hai
    const querySnapshot = await getDocs(slidesCollection);

    let slidesHTML = ''; // Empty string to hold all slide HTML
    querySnapshot.forEach((doc) => {
        const slideData = doc.data();
        // Har document ke data se ek slide ka HTML banayein
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

    swiperWrapper.innerHTML = slidesHTML; // Saare slides ko wrapper mein daal dein

    // Data load hone ke baad hi Swiper aur baki event listeners ko initialize karein
    initializeSwiper();
    setupEventListeners();
}

// Function to initialize Swiper
function initializeSwiper() {
    var swiper = new Swiper('.main-slider', {
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 1000,
        slidesPerView: 1,
        loop: true, // Loop ko true kar sakte hain ab
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

// Function to setup all other event listeners
function setupEventListeners() {
    // --- Header Script ---
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
    
    // --- 'My List' Button Animation Script ---
    // Yeh ab dynamically created buttons par bhi kaam karega
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


// Jab page load ho, toh Firestore se data fetch karo
document.addEventListener('DOMContentLoaded', loadSlidesFromFirestore);
