# Project-exam-1

**Lavara Wellness Blog - README**

**Project Title:**

Lavara Wellness Blog

**Description:**

Lavara Wellness is a blogging platform built with HTML, CSS, and JavaScript. The webiste allows users to read and create blog posts, while giving admin users the ability to edit and delete posts. It fetches and updates blog content via an API, and includes user authentication features for admin access. The design is responsive, ensuring a good user experience on both mobile and desktop devices.

**Features:**

- **View Blog Posts:** Any user can view the blog posts on the homepage.
- **Create Blog Posts:** Any logged-in user can create new blog posts using a simple form.
- **Edit and Delete Posts:** Only admin users have the ability to edit or delete existing posts.
- **Responsive Design:** The website is designed to work on various screen sizes, making it mobile-friendly.

**Table of Contents:**

- Technologies Used
- Usage Instructions
- Issues and Fixes
- Acknowledgments

**Technologies Used:**

- **HTML:** The structure and content of the web pages.
- **CSS:** For styling, creating a responsive design with media queries.
- **JavaScript:** Used for DOM manipulation, handling form submissions, and interacting with the API.
- **API:** The website communicates with an external API to fetch and update blog data.
- **Local Storage:** For storing the user’s authentication token temporarily.

**Requirements:**

- **Web Browser:** Any modern browser (Chrome, Firefox, Safari, Edge, etc.)
- **Text Editor:** VS Code.
- **API Access:** The website interacts with an external API (https://v2.api.noroff.dev/blog/posts/ankiiin). You’ll need an internet connection to use it.

**Usage Instructions:**

1. **Viewing Posts:**
Once the website is open in the browser, anyone (whether logged in or not) can view the posts displayed on the homepage.

2. **Adding a New Post:**
If you're logged in, you can create new blog posts.
Fill out the form with a title, text content, and an optional image URL.
Submit the form, and the post will be added to the list of blog posts.

3. **Editing a Post (Admin Only):**
Only admin users can edit existing posts.
After logging in as an admin, you can visit the "Edit Post" page where you can modify any post.
Changes will be reflected in the API, and the updated post will appear on the homepage.

4. **Deleting a Post (Admin Only):**
Admin users can also delete posts from the admin interface.
Deleting a post will remove it both from the interface and the API.

**Issues and Fixes:**

Here are some of the issues encountered and how they were fixed:

1. **Issue with Fetching Post ID:**
- Initially, there was a problem fetching the post ID from the URL. This was caused by incorrect URL parameters and query string parsing.
- Fixed by using new URLSearchParams(window.location.search) to properly extract the post ID.

2. **Authorization Header Missing:**
- The website would fail to update or delete posts because the authorization token was not included in the headers.
- Fixed by adding the Authorization header in the fetch() request for all admin actions.

3. **No Content Available for Blog Posts:**
- After creating a blog post, the content would show as "No content available" when viewed.
- This was caused by incorrect data being passed to the API on post creation. The issue was resolved by ensuring that the body of the post was properly formatted and sent in the API request.

4. **Error 401 (Unauthorized):**
- Users would see a 401 Unauthorized error when attempting to update or delete posts without proper authentication.
- This was fixed by ensuring the admin login correctly stores and uses an access token for API requests.

**Acknowledgments:**

- Noroff API: This project uses the Noroff blog API for fetching and updating blog data.
- Font Awesome: Used for the icons in the app.
- Google Fonts: Used for typography.