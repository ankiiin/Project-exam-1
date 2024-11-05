function toggleJoinPopup() {
    const joinPopup = document.getElementById('joinPopup');
    joinPopup.style.display = joinPopup.style.display === 'flex' ? 'none' : 'flex';

    const hamburgerPopup = document.getElementById('hamburgerPopup');
    if (joinPopup.style.display === 'flex') {
        hamburgerPopup.style.display = 'none';
    }
}

function toggleHamburgerMenu() {
    const hamburgerPopup = document.getElementById('hamburgerPopup');
    hamburgerPopup.style.display = hamburgerPopup.style.display === 'flex' ? 'none' : 'flex';
}

function closeOnClickOutside(event, popupId) {
    const popup = document.getElementById(popupId);
    if (event.target === popup) {
        popup.style.display = 'none';
    }
}

function navigateToPosts() {
    window.location.href = '../HTML/posts.html';
}

function navigateToAccount() {
    window.location.href = '../HTML/account.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const joinButtonInHamburger = document.querySelector('.hamburger-join-button');
    const blogButtonInHamburger = document.querySelector('.blog-button');

    // Sjekk om knappene finnes før vi legger til event listeners
    if (joinButtonInHamburger) {
        joinButtonInHamburger.addEventListener('click', toggleJoinPopup);
    }
    if (blogButtonInHamburger) {
        blogButtonInHamburger.addEventListener('click', navigateToPosts);
    }
});