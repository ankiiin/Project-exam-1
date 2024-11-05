import { fetchPostById } from './fetchData.js';

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');
async function displaySinglePost() {
    if (!postId) {
        console.error("No post ID provided in URL.");
        return;
    }

    const post = await fetchPostById(postId);
    if (!post) {
        document.getElementById("blogPostContainer").innerHTML = "<p>Post not found.</p>";
        return;
    }

    const postElement = `
        <div class="blog-post">
            <img src="${post.media.url}" alt="${post.media.alt}">
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <div class="tags">Tags: ${post.tags ? post.tags.join(", ") : "No tags"}</div>
            <div class="metadata">
                <span>Published: ${post.created ? new Date(post.created).toLocaleDateString() : "Unknown date"}</span>
                <span>Popularity: ${post.popularity}</span>
                <span>Continent: ${post.continent}</span>
            </div>
        </div>
    `;

    document.getElementById("blogPostContainer").innerHTML = postElement;
}

document.addEventListener("DOMContentLoaded", displaySinglePost);