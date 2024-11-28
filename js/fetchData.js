const token = localStorage.getItem('accessToken');

export async function fetchPosts() {
    if (!token) {
        console.error("No access token found.");
        return [];
    }

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
            return [];
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function fetchPostData(postId) {
    if (!token) {
        console.error("No access token found.");
        return null;
    }

    try {
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/ankiiin/${postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching blog post:", error);
        return null;
    }
}

export function displayBlogPosts(posts) {
    const blogPostsContainer = document.getElementById("blogPosts");
    blogPostsContainer.innerHTML = "";

    if (!Array.isArray(posts)) {
        console.warn("Posts is not an array. Trying data.posts or data.data.");
        posts = posts.posts || posts.data || [];
    }

    if (posts.length === 0) {
        blogPostsContainer.innerHTML = "<p>No posts available.</p>";
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("thumbnail");

        postElement.innerHTML = `
            <a href="blogpost.html?id=${post.id}">
                <img src="${post.media?.url || 'default.jpg'}" alt="${post.media?.alt || 'Blog post image'}">
                <div class="overlay">${post.title || 'Untitled'}</div>
            </a>
        `;

        blogPostsContainer.appendChild(postElement);
    });
}
