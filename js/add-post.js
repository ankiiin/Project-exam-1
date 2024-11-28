document.addEventListener("DOMContentLoaded", () => {
    const addPostButton = document.querySelector(".add-post-button");
    const popupOverlay = document.getElementById("popup-overlay");
    const closePopupButton = document.getElementById("close-popup");
    const postForm = document.getElementById("post-form");
    const errorMessageElement = document.getElementById("errorMessage");

    if (addPostButton) {
        addPostButton.addEventListener("click", () => {
            popupOverlay.style.display = "flex";  
        });
    }

    if (closePopupButton) {
        closePopupButton.addEventListener("click", () => {
            popupOverlay.style.display = "none";  
        });
    }

    popupOverlay.addEventListener("click", (event) => {
        if (event.target === popupOverlay) {
            popupOverlay.style.display = "none"; 
        }
    });

    postForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const title = document.getElementById("post-title").value;
        const body = document.getElementById("post-text").value;
        const imageUrl = document.getElementById("post-image").value;
        const tags = []; 
        errorMessageElement.style.display = "none";  
        if (!title || !body) {
            errorMessageElement.style.display = "block";
            errorMessageElement.textContent = "Please fill in all fields.";
            return;
        }

        const newPost = {
            title: title,
            body: body,
            tags: tags, 
            media: { url: imageUrl || 'https://via.placeholder.com/150', alt: 'Post image' }
        };

        try {
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                errorMessageElement.style.display = "block";
                errorMessageElement.textContent = "You must be logged in to create a post.";
                return;
            }

            const userName = localStorage.getItem("username"); 

            const response = await fetch(`https://v2.api.noroff.dev/blog/posts/${userName}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(newPost)
            });

            if (response.ok) {
                console.log("Post created successfully");
                const posts = await fetchPosts(userName); 
                displayBlogPosts(posts); 

                popupOverlay.style.display = "none";
            } else {
                const errorData = await response.json();
                errorMessageElement.style.display = "block";
                errorMessageElement.textContent = `Post creation failed: ${errorData.message || 'Please try again.'}`;
            }
        } catch (error) {
            console.error("Network Error:", error);
            errorMessageElement.style.display = "block";
            errorMessageElement.textContent = "A network error occurred. Please check your connection and try again.";
        }
    });
});

async function fetchPosts(userName) {
    try {
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/${userName}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (response.ok) {
            const posts = await response.json();
            return posts.data || [];
        } else {
            console.error("Failed to fetch posts:", response.status);
            return [];
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

function displayBlogPosts(posts) {
    const postList = document.querySelector(".post-list");
    if (posts.length === 0) {
        postList.innerHTML = "<p>No posts available.</p>";
        return;
    }

    posts.forEach(post => {
        const postItem = document.createElement("div");
        postItem.classList.add("post-item");

        postItem.innerHTML = `
            <div class="post-content">
                <img src="${post.media?.url || 'https://via.placeholder.com/150'}" alt="${post.media?.alt || 'Post Image'}" class="post-image">
                <h3>${post.title}</h3>
            </div>
            <div class="post-actions">
                <button class="delete-button" data-id="${post.id}">Delete</button>
            </div>
        `;
        
        postList.appendChild(postItem);
    });

    addEventListenersToButtons();
}

function addEventListenersToButtons() {
    const deleteButtons = document.querySelectorAll('.delete-button');

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
            const posts = await fetchPosts(); 
            displayBlogPosts(posts);  
        } else {
            console.error('Failed to delete post:', response.status);
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}
