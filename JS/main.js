document.addEventListener("DOMContentLoaded", () => {

    const registerButton = document.querySelector("#registerButton"); 
    const usernameDisplay = document.getElementById("username-display");
    const logoutButton = document.getElementById("logout-button");
    const editButton = document.getElementById("edit-button");

    const loggedInUser = localStorage.getItem("username");

    if (loggedInUser) {
        usernameDisplay.style.display = "none";  
        registerButton.style.display = "none";  
        editButton.style.display = "inline-block"; 
        logoutButton.style.display = "inline-block";  
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("username");
            localStorage.removeItem("accessToken");
            usernameDisplay.textContent = "Register";  
            usernameDisplay.style.display = "inline-block"; 
            registerButton.style.display = "inline-block";  
            editButton.style.display = "none";
            logoutButton.style.display = "none"; 
            window.location.href = "/index.html";
        });
    }

    if (registerButton) {
        registerButton.addEventListener("click", (event) => {
            event.preventDefault(); 
            window.location.href = "../html/register.html"; 
        });
    }

    if (editButton) {
        editButton.addEventListener("click", () => {
            window.location.href = "../post/edit.html"; 
        });
    }

});

