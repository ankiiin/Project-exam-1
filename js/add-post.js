import { getUsername } from "./utils/storage.js";

document.getElementById("post-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-text").value;
  const image = document.getElementById("post-image").value;

  const errorMessage = document.getElementById("errorMessage");
  errorMessage.style.display = "none";

  if (!title || !content) {
    errorMessage.textContent = "Title and content are required!";
    errorMessage.style.display = "block";
    return;
  }

  const postData = {
    title: title,
    content: content,
    media: {
      url: image || "",
      alt: "Blog post image",
    },
  };

  console.log("Post data being sent:", postData);

  try {
    const username = getUsername();
    if (!username) {
      throw new Error("No logged in user");
    }

    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${username}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(postData),
      }
    );

    if (response.ok) {
      console.log("Blog post added successfully.");
      window.location.href = "../post/edit.html";
    } else {
      const errorData = await response.json();
      console.error("Error adding post:", errorData);
      errorMessage.textContent = errorData.errors
        ? errorData.errors[0].message
        : "Failed to add post.";
      errorMessage.style.display = "block";
    }
  } catch (error) {
    console.error("Error adding post:", error);
    errorMessage.textContent =
      "An error occurred while adding the post. Please try again. " +
      error.message;
    errorMessage.style.display = "block";
  }
});
