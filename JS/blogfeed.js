const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYW5raWlpbiIsImVtYWlsIjoiYW5uaGFtNDkzNDRAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MzA4MDI2Nzl9.a0NCLC25IYwiNwdII0_kJNjmO7g4JNsZUukkgnMWC9E";

async function fetchCarouselPosts() {
    try {
        const response = await fetch("https://v2.api.noroff.dev/blog/posts/ankiiin?limit=3", {
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
    carouselContainer.innerHTML = ''; // Tøm karusellen

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

    const firstClone = carouselContainer.firstElementChild.cloneNode(true);
    const lastClone = carouselContainer.lastElementChild.cloneNode(true);
    carouselContainer.appendChild(firstClone);
    carouselContainer.insertBefore(lastClone, carouselContainer.firstElementChild);

    currentIndex = 1;
    showSlide(currentIndex);
}

let currentIndex = 1;
let isTransitioning = false;

function showSlide(index) {
    const carouselContainer = document.querySelector('.carousel-images');
    const slides = document.querySelectorAll('.carousel-item');
    const offset = -index * slides[0].offsetWidth;

    carouselContainer.style.transition = isTransitioning ? "transform 0.5s ease" : "none";
    carouselContainer.style.transform = `translateX(${offset}px)`;

    carouselContainer.addEventListener("transitionend", () => {
        if (index === slides.length - 1) {
            carouselContainer.style.transition = "none";
            currentIndex = 1;
            carouselContainer.style.transform = `translateX(${-currentIndex * slides[0].offsetWidth}px)`;
        } else if (index === 0) {
            carouselContainer.style.transition = "none";
            currentIndex = slides.length - 2;
            carouselContainer.style.transform = `translateX(${-currentIndex * slides[0].offsetWidth}px)`;
        }
        isTransitioning = false;
    }, { once: true });
}

function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    showSlide(currentIndex);
}

function prevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    showSlide(currentIndex);
}

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

