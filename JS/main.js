document.addEventListener("DOMContentLoaded", () => {

    const joinButton = document.querySelector(".join-button");
    const joinPopup = document.getElementById("joinPopup");
    const closeJoinPopup = document.querySelector("#joinPopup .close-button");

    if (joinButton && joinPopup && closeJoinPopup) {
        joinButton.addEventListener("click", () => {
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

    window.navigateToPosts = function() {
        window.location.href = "../HTML/posts.html";
    };
});
