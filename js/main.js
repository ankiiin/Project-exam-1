document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.querySelector("#registerButton");
    const usernameDisplay = document.getElementById("username-display");
    const logoutButton = document.getElementById("logout-button");
    const editButton = document.getElementById("edit-button");
    const loginButton = document.getElementById("loginButton");
    
    const loggedInUser = localStorage.getItem("username");
    const token = localStorage.getItem("accessToken"); 

    if (loggedInUser && token) {
        usernameDisplay.style.display = "none";
        registerButton.style.display = "none";
        editButton.style.display = "inline-block";
        logoutButton.style.display = "inline-block";
        loginButton.style.display = "none"; 
    } else {
        usernameDisplay.style.display = "inline-block";
        registerButton.style.display = "inline-block";
        editButton.style.display = "none";
        logoutButton.style.display = "none";
        loginButton.style.display = "inline-block"; 
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("username");
            localStorage.removeItem("accessToken");
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

    if (loginButton) {
        loginButton.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = "../html/login.html";
        });
    }
});
