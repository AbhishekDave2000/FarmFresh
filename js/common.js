function onScrollAnimations() {
    const element = document.getElementById('navbar-list');
    const navbar = document.getElementById('navigation-bar');
    const menu = document.getElementById('menu');
    // when window is scrolled more than 50 then it will show the navbar other wise it will be transparent only for the home page
    if (window.scrollY > 50) {
        navbar.setAttribute("style", "background-color: #4F7942 !important;");
        if ( window.getComputedStyle(element).display != 'none' && window.getComputedStyle(menu).display != 'none') {
            navbar.setAttribute("style", "min-height: 100% !important; background-color: #4F7942 !important;");   
        } else if (window.getComputedStyle(element).display != 'none' && window.getComputedStyle(menu).display == 'none') {
            navbar.setAttribute("style", "background-color: #4F7942 !important;");
        }
    } else {
        navbar.setAttribute("style", "background-color: '';");
    }

    // if window is scrolled more than 200 then this code will show up arrow button other wise it will be hidden
    // by default it is hidden
    if (window.scrollY > 200) {
        document.getElementById('top-scroll-button').setAttribute("style", "display: block;")
    } else {
        document.getElementById('top-scroll-button').setAttribute("style", "display: '';")
    }
}

// navbar toggle menu buttons
function toggleMenu() {
    const element = document.getElementById('navbar-list');

    if ( window.getComputedStyle(element).display === 'none') {
        document.getElementById("navigation-bar").setAttribute("style", "min-height: 100% !important; background-color: #4F7942; position: fixed; top: 0;");
        element.setAttribute('style', 'display: flex !important; flex-direction: column;');
        document.getElementById("humberger-second-div").style.display = 'none';
        document.getElementById("humberger-first-div").setAttribute('style', 'transform: rotate(45deg); position: relative; top: 6px; transition: transform 0.2s ease-in;');
        document.getElementById("humberger-third-div").setAttribute('style', 'transform: rotate(-45deg); position: relative; top: -4px; transition: transform 0.2s ease-in;');
    } else {
        element.setAttribute('style', 'display: "";');
        document.getElementById("humberger-second-div").style.display = '';
        document.getElementById("navigation-bar").setAttribute("style", 'min-height: 40px; background-color: #4F7942;');
        document.getElementById("humberger-first-div").setAttribute('style', 'transform: rotate(0deg); position: ""; top: "";  transition: transform 0.2s ease-out;');
        document.getElementById("humberger-third-div").setAttribute('style', 'transform: rotate(0deg); position: ""; bottom: "";  transition: transform 0.2s ease-out;');
    }
}

// for logging out the user just remove the currentUser from the local storage and reload the page
function logoutUser(){
    localStorage.removeItem('currentUser');
    location.reload();
}

// this function sets the navbar links some of them are shown only if the user is logged in and other wise hidden
$(document).ready(function(){
    let currentUser = localStorage.getItem('currentUser');

    // let registerButton = document.getElementById('registerButton');
    let cartButton = document.getElementById('cartButton');
    let logoutButton = document.getElementById('logoutButton');
    let productListingButton = document.getElementById('productListingButton');
    let userInfo = document.getElementById('userInfo');
    let userName = document.getElementById('loggedInUserInfo');
    if (currentUser == null) {
        // registerButton.setAttribute("style", "display: block;");
        cartButton.setAttribute("style", "display: none;");
        logoutButton.setAttribute("style", "display: none;");
        productListingButton.setAttribute("style", "display: none;");
        if ( userInfo && userName ) {
            userInfo.setAttribute("style", "display: none;");
        }  
    } else {
        logoutButton.setAttribute("style", "display: block;");
        cartButton.setAttribute("style", "display: block;");
        productListingButton.setAttribute("style", "display: block;");
        // registerButton.setAttribute("style", "display: none;");
        if ( userInfo && userName ) {
            userInfo.setAttribute("style", "display: flex;");
            userName.innerText = JSON.parse(currentUser).username;
        }
    }
});

// this is the animation code for the card on the home page on scroll and done with the observer
document.addEventListener("DOMContentLoaded", function() {
    const cards = document.querySelectorAll('.col');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        observer.observe(card);
    });
});