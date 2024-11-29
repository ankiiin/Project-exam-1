import { fetchPosts } from './fetchData.js';

export function displayBlogPosts(posts) {
    const postList = document.querySelector('.post-list');
    postList.innerHTML = '';

    if (posts && posts.data && Array.isArray(posts.data)) {
        posts = posts.data;
    } else {
        console.warn("Posts is not an array. Posts data is either missing or not formatted correctly.");
        posts = [];
    }

    if (posts.length === 0) {
        postList.innerHTML = "<p>No posts available.</p>";
        return;
    }

    posts.forEach(post => {
        const postItem = document.createElement('div');
        postItem.classList.add('post-item');
        
        postItem.innerHTML = `
            <div class="post-content">
                <img src="${post.media?.url || 'https://via.placeholder.com/150'}" alt="${post.media?.alt || 'Post Image'}" class="post-image">
                <h3>${post.title}</h3>
            </div>
            <div class="post-actions">
                <!-- Edit button -->
                <button class="edit-button" data-id="${post.id}">Edit</button>
                <!-- Delete button -->
                <button class="delete-button" data-id="${post.id}">Delete</button>
            </div>
        `;
        postList.appendChild(postItem);
    });

    addEventListenersToButtons();
}

function addEventListenersToButtons() {
    const editButtons = document.querySelectorAll('.edit-button');
    const deleteButtons = document.querySelectorAll('.delete-button');

    editButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const postId = event.target.dataset.id;
            console.log(`Edit post with ID: ${postId}`);
            window.location.href = `../post/edit-post.html?id=${postId}`;  
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const postId = event.target.dataset.id;
            if (confirm('Are you sure you want to delete this post?')) {
                await deletePost(postId);
            }
        });
    });
}

async function deletePost(postId) {
    try {
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/ankiiin/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.ok) {
            console.log(`Post with ID ${postId} deleted.`);
            fetchPosts(); // Reload posts after deletion
        } else {
            console.error('Failed to delete post:', response.status);
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const posts = await fetchPosts();
    console.log('Fetched posts:', posts);  
    displayBlogPosts(posts);
});
