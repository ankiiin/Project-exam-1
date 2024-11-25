async function fetchBlogPosts() {
    try {
        const response = await fetch('https://v2.api.noroff.dev/blog/posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Fetched Blog Posts:', data);
            displayBlogPosts(data); 
        } else {
            console.error('Failed to fetch blog posts:', response.status);
        }
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
}

function displayBlogPosts(posts) {
    const postList = document.querySelector('.post-list'); 

    postList.innerHTML = '';

    posts.forEach(post => {
        const postItem = document.createElement('div');
        postItem.classList.add('post-item');
        postItem.innerHTML = `
            <img src="${post.media?.url || 'default.jpg'}" alt="${post.media?.alt || 'Post Image'}">
            <div class="post-info">
                <h4>${post.title}</h4>
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
            console.log('Post deleted:', postId);
            fetchBlogPosts();
        } else {
            console.error('Failed to delete post:', response.status);
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchBlogPosts(); 
});
