
// function for fetching the data from data.json file
function FetchCartProduct() {
    const baseUrl = window.location.origin + window.location.pathname;
    const newUrl = new URL('../js/data.json', baseUrl).href;
    
    fetch(newUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        loadCart(data); // load the cart based on the data from the cart and data.json file
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function loadCart(data){
    // get current user
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    
    // get the whole cart
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    // get user cart of the current user
    let userCart = cart[currentUser.email];

    let cartItemsContainer = document.getElementById('cart-items');
    let cartTotal = document.getElementById('cart-total');
    let total = 0;
    cartItemsContainer.innerHTML = '';
    dataArray = [];
    let items = Object.values(data["categories"]);

    // code for one by one checking if the product from the data.json file... 
    // exist in the cart then load the data in the cart other wise proceed with the next iteration of the product from the data.json
    for (let i = 0; i < items.length; i++) {
        let subItems = Object.values(items[i]);
        let cartKeys = Object.keys(userCart);
        for (let j = 0; j < subItems.length; j++){
            if ( cartKeys.includes(subItems[j]['id'].toString()) ) {
                    let product = subItems[j];
                    let id = subItems[j]['id'];
                    let quantity = userCart[subItems[j]['id']];
                    let itemTotal = userCart[subItems[j]['id']] * subItems[j]['price'];
                    total += itemTotal;
                    // set a cart product value one by one because it is in the loop
                    let cartItemHtml = `
                        <div class="cart-item" data-id="${product.id}">
                            <img src="${product.img}" alt="${product.name}">
                            <div class="cart-item-details">
                                <h4 class="cart-item-title">${product.name}</h4>
                                <p class="cart-item-price">$${product.price}</p>
                            </div>
                            <div class="cart-item-quantity">
                                <button class="quantity-minus" data-id="${id}">-</button>
                                <span class="quantity-display" data-id="${id}">${quantity}</span>
                                <button class="quantity-plus" data-id="${id}">+</button>
                            </div>
                            <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                        </div>
                    `;
                    cartItemsContainer.innerHTML += cartItemHtml;
            } 
        }
    }
    cartTotal.innerText = total.toFixed(2);
}

$(document).ready(function(){
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

    // quantity plus function for a single product from the cart and updating the cart right away on clicking 
    $(document).on('click', '.quantity-plus', function(){
        let id = $(this).data('id');
        let cart = JSON.parse(localStorage.getItem('cart')) || {};
        if (cart[currentUser.email][id]) {
            cart[currentUser.email][id] += 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        FetchCartProduct();
    });
    
    // quantity minus function for a single product from the cart and updating the cart right away on clicking 
    $(document).on('click', '.quantity-minus', function(){
        let id = $(this).data('id');
        let cart = JSON.parse(localStorage.getItem('cart')) || {};
        if (cart[currentUser.email][id] && cart[currentUser.email][id] > 0) {
            cart[currentUser.email][id] -= 1;
            if (cart[currentUser.email][id] === 0) {
                delete cart[currentUser.email][id];
            }
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        FetchCartProduct();
    });

    // show popup on clicking the checkout button
    $(document).on('click', '.checkout-button', function(){
        // Plugin of Jquery
        Swal.fire({
            title: "You have finalized everything!",
            text: "Proceed to Checkout?",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Yes",
            confirmButtonColor: "#4CAF50",
            cancelButtonColor: "#d33"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Hurray! Checked Out!",
                    icon: "success",
                    confirmButtonColor: "#4CAF50"
                });
            }
        });
    });
});
