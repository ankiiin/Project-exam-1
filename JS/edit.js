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
                <button class="edit-button" data-id="${post.id}">Edit</button>
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
            console.log('Edit button clicked for post ID:', postId); // Log postId for debugging
            openEditModal(postId);
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
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.ok) {
            console.log(`Post with ID ${postId} deleted.`);
            fetchPosts();
        } else {
            console.error('Failed to delete post:', response.status);
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

async function openEditModal(postId) {
    console.log('Opening edit modal for post ID:', postId); // Log for debugging
    try {
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/${postId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        const responseData = await response.json();
        console.log('API response:', responseData); // Log entire response to check its structure

        if (!response.ok || !responseData.data || responseData.data.length === 0) {
            console.error(`No data found for post with ID ${postId}. Response data is empty or missing.`);
            alert('Sorry, this post is not available or does not exist.');
            return;
        }

        const post = responseData.data[0]; // Get the first post from the data array
        console.log('Fetched post:', post); // Log the fetched post to check its structure

        if (!post.title || !post.content) {
            console.error('Post data is incomplete:', post);
            return;
        }

        const editTitle = document.getElementById('edit-title');
        const editContent = document.getElementById('edit-content');
        
        // Populate the modal inputs with the post data
        editTitle.value = post.title;
        editContent.value = post.content;

        const modal = document.getElementById('editModal');
        modal.style.display = 'flex';

        const closePopupButton = document.getElementById('close-popup');
        closePopupButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById('edit-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const updatedPost = {
                title: editTitle.value,
                content: editContent.value,
            };

            await updatePost(postId, updatedPost);
            modal.style.display = 'none';
        });

    } catch (error) {
        console.error('Error fetching post data:', error);
        alert('An error occurred while fetching the post data.');
    }
}

async function updatePost(postId, updatedPost) {
    try {
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPost),
        });

        if (response.ok) {
            console.log('Post updated successfully');
            fetchPosts();
        } else {
            console.error('Failed to update post:', response.status);
        }
    } catch (error) {
        console.error('Error updating post:', error);
    }
}

// Add New Post functionality
document.addEventListener('DOMContentLoaded', () => {
    const addPostButton = document.querySelector('.add-post-button');
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopupButton = document.getElementById('close-popup');
    const postForm = document.getElementById('post-form');

    // Check if the button is found and add event listener
    if (addPostButton) {
        console.log('Add Post Button Found');
        addPostButton.addEventListener('click', () => {
            console.log('Add Post button clicked');
            popupOverlay.style.display = 'flex';  
        });
    } else {
        console.error('Add Post Button not found');
    }

    closePopupButton.addEventListener('click', () => {
        popupOverlay.style.display = 'none';  
    });

    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            popupOverlay.style.display = 'none'; 
        }
    });

    postForm.addEventListener('submit', async (event) => {
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
        popupOverlay.style.display = 'none';
        fetchPosts();
    });
});

// Create New Post
async function createPost(post) {
    try {
        const response = await fetch('https://v2.api.noroff.dev/blog/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(post)
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

// Fetch Posts and Display
document.addEventListener('DOMContentLoaded', async () => {
    const posts = await fetchPosts();
    console.log('Fetched posts:', posts);  
    displayBlogPosts(posts);
});
