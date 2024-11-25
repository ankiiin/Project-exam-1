document.addEventListener("DOMContentLoaded", () => {

    const joinButton = document.querySelector(".join-button"); 
    const joinPopup = document.getElementById("joinPopup"); 
    const closeJoinPopup = document.querySelector("#joinPopup .close-button"); 
    const usernameDisplay = document.getElementById("username-display");
    const logoutButton = document.getElementById("logout-button");
    const editButton = document.getElementById("edit-button");

    const loggedInUser = localStorage.getItem("username");

    if (loggedInUser) {
        usernameDisplay.style.display = "none";  
        editButton.style.display = "inline-block"; 
        logoutButton.style.display = "inline-block";  
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("username");
            localStorage.removeItem("accessToken");
            usernameDisplay.textContent = "Join us!";
            usernameDisplay.style.display = "inline-block"; 
            editButton.style.display = "none";
            logoutButton.style.display = "none"; 
        });
    }

    if (joinButton && joinPopup && closeJoinPopup) {
        joinButton.addEventListener("click", (event) => {
            event.preventDefault(); 
            joinPopup.style.display = "flex"; 
        });

        closeJoinPopup.addEventListener("click", () => {
            joinPopup.style.display = "none"; 
        });

        document.addEventListener("click", (event) => {
            if (event.target === joinPopup) {
                joinPopup.style.display = "none"; 
            }
        });
    }

    if (editButton) {
        editButton.addEventListener("click", () => {
            if (loggedInUser) {
                window.location.href = "post/edit.html"; 
            }
        });
    }

});
