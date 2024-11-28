document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const errorMessage = document.getElementById("errorMessage");
            errorMessage.style.display = "none";

            if (!email || !password) {
                errorMessage.textContent = "Please fill in both fields.";
                errorMessage.style.display = "block";
                return;
            }

            try {
                const response = await fetch("https://v2.api.noroff.dev/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();

                    console.log("API Response Data:", data);

                    if (data.data && data.data.accessToken) {
                        localStorage.setItem("accessToken", data.data.accessToken);
                        localStorage.setItem("username", data.data.name); 
                        localStorage.setItem("userEmail", email);  

                        console.log("Redirecting to /post/edit.html...");
                        window.location.href = "../post/edit.html"; 
                    } else {
                        errorMessage.textContent = "Login failed. Missing access token.";
                        errorMessage.style.display = "block";
                    }
                } else {
                    const errorData = await response.json();
                    errorMessage.textContent = errorData.message || "Login failed. Please check your credentials.";
                    errorMessage.style.display = "block";
                }
            } catch (error) {
                console.error("Error:", error);
                errorMessage.textContent = "A network error occurred. Please try again later.";
                errorMessage.style.display = "block";
            }
        });
    } else {
        console.error("loginForm not found in the DOM.");
    }
});
