document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();
 
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessageElement = document.getElementById("errorMessage");
 
    errorMessageElement.style.display = "none";
 
    if (!email || !password) {
        errorMessageElement.style.display = "block";
        errorMessageElement.textContent = "Please fill in all fields.";
        return;
    }
 
    const name = email.split("@")[0];
    const requestBody = { name, email, password };
    console.log("Request Body:", requestBody);
 
    try {
        const response = await fetch("https://v2.api.noroff.dev/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });
 
        console.log("Response status:", response.status);
 
        if (response.ok) {
            window.location.href = "../html/login.html"; 
        } else {
            const errorData = await response.json();
            if (errorData.errors) {
                const errorMessages = errorData.errors.map(error => error.message).join(", ");
                errorMessageElement.style.display = "block";
                errorMessageElement.textContent = `Registration failed: ${errorMessages}`;
                console.error("Error Details:", errorData.errors);
            } else {
                errorMessageElement.style.display = "block";
                errorMessageElement.textContent = "Registration failed. Please try again.";
                console.error("Error Details:", errorData);
            }
        }
    } catch (error) {
        console.error("Network Error:", error);
        errorMessageElement.style.display = "block";
        errorMessageElement.textContent = "A network error occurred. Please check your connection and try again.";
    }
});
