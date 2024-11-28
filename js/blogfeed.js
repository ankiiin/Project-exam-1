import { getUsername } from "../js/utils/storage.js";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYW5raWlpbiIsImVtYWlsIjoiYW5uaGFtNDkzNDRAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MzA4MDI2Nzl9.a0NCLC25IYwiNwdII0_kJNjmO7g4JNsZUukkgnMWC9E";

let currentIndex = 1; // Global current index for carousel
let isTransitioning = false; // Flag to prevent multiple clicks during transition

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
    carouselContainer.innerHTML = '';  // Clear previous content

    posts.forEach(post => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';

        const link = document.createElement('a');
        link.href = `../HTML/blogpost.html?id=${post.id}`;
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

    // Clone the first and last items to allow infinite looping
    const firstClone = carouselContainer.firstElementChild.cloneNode(true);
    const lastClone = carouselContainer.lastElementChild.cloneNode(true);
    carouselContainer.appendChild(firstClone);
    carouselContainer.insertBefore(lastClone, carouselContainer.firstElementChild);

    // Reset to second item
    currentIndex = 1;
    showSlide(currentIndex);
}

function showSlide(index) {
    const carouselContainer = document.querySelector('.carousel-images');
    const slides = document.querySelectorAll('.carousel-item');
    const offset = -index * slides[0].offsetWidth;

    // Prevent transition interruptions
    if (isTransitioning) return;

    isTransitioning = true; // Lock transition

    carouselContainer.style.transition = "transform 0.5s ease";
    carouselContainer.style.transform = `translateX(${offset}px)`;

    // Once transition is done, allow the next click
    carouselContainer.addEventListener("transitionend", () => {
        isTransitioning = false; // Unlock transition

        if (index === slides.length - 1) {
            // Reset position after the last item
            carouselContainer.style.transition = "none";
            currentIndex = 1;
            carouselContainer.style.transform = `translateX(${-currentIndex * slides[0].offsetWidth}px)`;
        }
    });
}

// Handle next and previous slide events
function nextSlide() {
    const slides = document.querySelectorAll('.carousel-item');
    const maxIndex = slides.length - 2; // Ignore cloned item

    if (currentIndex < maxIndex) {
        currentIndex++;
    } else {
        currentIndex = 0; // Loop back to the start
    }

    showSlide(currentIndex);
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-item');
    const maxIndex = slides.length - 2;

    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = maxIndex - 1; // Loop back to the end
    }

    showSlide(currentIndex);
}

// Initialize carousel after fetching posts
fetchCarouselPosts();

// Event listeners for carousel controls
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
            window.location.href = `HTML/blogpost.html?id=${post.id}`; 
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
            text: text,
            media: { url: imageUrl || 'https://via.placeholder.com/150' }
        };

        await createPost(newPost);

        const posts = await fetchBlogPosts();
        displayBlogPosts(posts);  
    });
}

async function createPost(postData) {
    try {
        const response = await fetch('https://v2.api.noroff.dev/blog/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            console.log('Post created successfully');
        } else {
            console.error('Failed to create post:', response.status);
        }
    } catch (error) {
        console.error('Error creating post:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayBlogPosts();  
    fetchCarouselPosts();  
    handleNewPost();  
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