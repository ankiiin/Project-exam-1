import { fetchPostData, updatePost } from './fetchData.js';


document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('edit-post-form');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    console.log("Fetched post ID:", postId);

    if (postId) {
        const postData = await fetchPostData(postId); 

        if (postData && postData.data) {
            const data = postData.data;

            document.getElementById('post-title').value = data.title || ''; 
            document.getElementById('post-text').value = data.body || '';   
            document.getElementById('post-image').value = data.media?.url || ''; 

        } else {
            console.error("Failed to fetch post data.");
        }
    } else {
        console.error("No post ID found in URL");
    }

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const title = document.getElementById('post-title').value;
            const text = document.getElementById('post-text').value;
            const imageUrl = document.getElementById('post-image').value;

            const updatedPost = {
                title: title,
                body: text,
                media: { url: imageUrl || 'https://via.placeholder.com/150' }
            };

            const updatedData = await updatePost(postId, updatedPost); 

            if (updatedData) {
                window.location.href = "../post/edit.html";  
            } else {
                console.error("Failed to update post.");
            }
        });
    } else {
        console.error("Form element not found.");
    }
});
