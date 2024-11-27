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

    console.log('Displaying posts:', posts);  

    if (posts.length === 0) {
        console.log('No posts available');  
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
            console.log(`Editing post with ID: ${postId}`);
            window.location.href = `../post/edit.html?id=${postId}`; 
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

document.addEventListener('DOMContentLoaded', () => {
    const addPostButton = document.querySelector('.add-post-button');
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopupButton = document.getElementById('close-popup');
    const postForm = document.getElementById('post-form');

    addPostButton.addEventListener('click', () => {
        popupOverlay.style.display = 'flex';  
    });

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

        // Create new post object
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

document.addEventListener('DOMContentLoaded', async () => {
    const posts = await fetchPosts(); 
    console.log('Fetched posts:', posts);  
    displayBlogPosts(posts); 
});
