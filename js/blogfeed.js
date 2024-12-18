import { getUsername } from "../utils/storage.js";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYW5raWlpbiIsImVtYWlsIjoiYW5uaGFtNDkzNDRAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MzA4MDI2Nzl9.a0NCLC25IYwiNwdII0_kJNjmO7g4JNsZUukkgnMWC9E";

let currentIndex = 1;
let isTransitioning = false; 

async function fetchCarouselPosts() {
    const username = getUsername();
    
    try {
        const response = await fetch(
            `https://v2.api.noroff.dev/blog/posts/${username}?limit=3`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error("Failed to fetch carousel posts:", response.status);
            return;
        }

        const posts = await response.json();
        displayCarouselPosts(posts.data);
    } catch (error) {
        console.error("Error fetching carousel posts:", error);
    }
}

function displayCarouselPosts(posts) {
    const carouselContainer = document.querySelector('.carousel-images');
    carouselContainer.innerHTML = '';  

    posts.forEach(post => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';

        const link = document.createElement('a');
        link.href = `../html/blogpost.html?id=${post.id}`;
        link.className = 'carousel-link';

        const image = document.createElement('img');
        image.src = post.media.url;
        image.alt = post.title;
        image.classList.add('rounded-image');

        const titleOverlay = document.createElement('div');
        titleOverlay.className = 'carousel-title-overlay';
        titleOverlay.innerText = post.title;

        link.appendChild(image);
        link.appendChild(titleOverlay);
        carouselItem.appendChild(link);
        carouselContainer.appendChild(carouselItem);
    });

    const firstClone = carouselContainer.firstElementChild.cloneNode(true);
    const lastClone = carouselContainer.lastElementChild.cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');
    carouselContainer.appendChild(firstClone);
    carouselContainer.insertBefore(lastClone, carouselContainer.firstElementChild);

    currentIndex = 1; 
    updateCarousel(); 
}

function updateCarousel() {
    const carouselContainer = document.querySelector('.carousel-images');
    const slides = document.querySelectorAll('.carousel-item');
    const offset = -currentIndex * slides[0].offsetWidth;
    carouselContainer.style.transition = "none";
    carouselContainer.style.transform = `translateX(${offset}px)`;
}

function showSlide(index) {
    const carouselContainer = document.querySelector('.carousel-images');
    const slides = document.querySelectorAll('.carousel-item');

    if (isTransitioning) return;

    isTransitioning = true;
    const offset = -index * slides[0].offsetWidth;

    carouselContainer.style.transition = "transform 0.5s ease";
    carouselContainer.style.transform = `translateX(${offset}px)`;

    carouselContainer.addEventListener("transitionend", () => {
        isTransitioning = false;

        if (index === 0) {
            currentIndex = slides.length - 2;
            updateCarousel();
        } else if (index === slides.length - 1) {
            currentIndex = 1;
            updateCarousel();
        }
    }, { once: true });
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-item');
    currentIndex++;
    showSlide(currentIndex);
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-item');
    currentIndex--;
    showSlide(currentIndex);
}

document.querySelector('.carousel-control.next').addEventListener('click', nextSlide);
document.querySelector('.carousel-control.prev').addEventListener('click', prevSlide);

fetchCarouselPosts();

fetchCarouselPosts();
document.querySelector('.carousel-control.next').addEventListener('click', nextSlide);
document.querySelector('.carousel-control.prev').addEventListener('click', prevSlide);

async function fetchBlogPosts() {
    try {
        const response = await fetch('https://v2.api.noroff.dev/blog/posts/ankiiin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        return data.data; 
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

async function displayBlogPosts() {
    const posts = await fetchBlogPosts();
    const postGrid = document.getElementById('postGrid');
    postGrid.innerHTML = '';  

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('thumbnail');
        postElement.innerHTML = `
            <img src="${post.media.url}" alt="${post.media.alt || 'Blog image'}">
            <div class="overlay">${post.title}</div>
        `;
        postElement.addEventListener('click', () => {
            window.location.href = `html/blogpost.html?id=${post.id}`; 
        });

        postGrid.appendChild(postElement);
    });
}

async function handleNewPost() {
    document.getElementById('post-form').addEventListener('submit', async (event) => {
        event.preventDefault();  
        const title = document.getElementById('post-title').value;
        const text = document.getElementById('post-text').value;
        const imageUrl = document.getElementById('post-image').value;

        const newPost = {
            title: title,
            body: text,
            media: { url: imageUrl || 'https://via.placeholder.com/150' }
        };

        await createPost(newPost);

        const posts = await fetchBlogPosts();
        displayBlogPosts(posts);  
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayBlogPosts();  
    fetchCarouselPosts();   
});

window.addEventListener("resize", () => {
    const carouselContainer = document.querySelector('.carousel-images');
    const offset = -currentIndex * document.querySelector('.carousel-item').offsetWidth;
    carouselContainer.style.transition = "none";
    carouselContainer.style.transform = `translateX(${offset}px)`;
});

function logOut() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    window.location.href = "/index.html";
}