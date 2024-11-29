import { fetchPostData } from './fetchData.js';

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id"); 

    console.log("Post ID:", postId); 

    if (postId) {
        const response = await fetchPostData(postId);

        console.log("Fetched Post Data:", response); 

        if (response && response.data) {
            const data = response.data;

            document.querySelector(".post-title").textContent = data.title || "Untitled";

            const postDate = data.created || data.updated;
            document.querySelector(".post-date").textContent = postDate 
                ? `Published on: ${new Date(postDate).toLocaleDateString()}`
                : "Published: Date unknown";

            document.querySelector(".post-image img").src = data.media?.url || "https://via.placeholder.com/150";
            document.querySelector(".post-image img").alt = data.media?.alt || "Blog post image";

            document.querySelector(".post-content").innerHTML = data.body || "<p>No content available for this post.</p>";

            if (data.author) {
                document.querySelector(".post-author").textContent = `Author: ${data.author.name || "Unknown"}`;
            } else {
                document.querySelector(".post-author").textContent = "Author: Unknown";
            }

        } else {
            document.querySelector(".post-content").innerHTML = "<p>Sorry, we couldn't load this post. Please try again later.</p>";
        }
    } else {
        console.error("No post ID found in URL");
    }
});

