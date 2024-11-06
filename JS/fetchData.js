const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYW5raWlpbiIsImVtYWlsIjoiYW5uaGFtNDkzNDRAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MzA4MDI2Nzl9.a0NCLC25IYwiNwdII0_kJNjmO7g4JNsZUukkgnMWC9E";

async function fetchPosts() {
    try {
        const response = await fetch('https://v2.api.noroff.dev/blog/posts/ankiiin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error("Failed to fetch posts:", response.status);
            return;
        }

        const data = await response.json();
        displayBlogPosts(data.data); 
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

function displayBlogPosts(posts) {
    const blogPostsContainer = document.getElementById("blogPosts");
    blogPostsContainer.innerHTML = ""; 

    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("thumbnail");

        postElement.innerHTML = `
            <img src="${post.media.url}" alt="${post.media.alt}">
            <div class="overlay">${post.title}</div>
        `;

        blogPostsContainer.appendChild(postElement);
    });
}

document.addEventListener("DOMContentLoaded", fetchPosts);
