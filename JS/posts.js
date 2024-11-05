async function fetchBlogPosts() {
    try {
        const response = await fetch('https://v2.api.noroff.dev/blog/posts/ankiiin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYW5raWlpbiIsImVtYWlsIjoiYW5uaGFtNDkzNDRAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MzA4MDI2Nzl9.a0NCLC25IYwiNwdII0_kJNjmO7g4JNsZUukkgnMWC9E'
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
            window.location.href = `blogpost.html?id=${post.id}`;
        });

        postGrid.appendChild(postElement);
    });
}

document.addEventListener('DOMContentLoaded', displayBlogPosts);