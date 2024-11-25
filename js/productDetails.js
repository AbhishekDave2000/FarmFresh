// Function to update product details on the page
function updateProductDetails(productData, qty) {
    // html for the single product
    productDetailsHtml = `<div class="product-image">
                            <img id="product-image" src="${productData.img}" alt="Product Image">
                        </div>
                        <div class="product-info">
                            <h1 id="product-name">${productData.name}</h1>
                            <p id="product-price">$${productData.price.toFixed(2)}</p>
                            <p><span id="product-qty">${productData.qty}</span>&nbsp;<span id="product-qty-measurement">${productData.packaging}</span></p>
                            <hr>
                            <h3>Product Description</h3>
                            <p id="product-description">${productData.desc}</p>
                            <div class="quantity-selector">
                                <button id="quantity-minus" class="qty-btn quantity-minus" data-id="${productData.id}">-</button>
                                <span id="quantity-display" class="quantity-display" data-id="${productData.id}">${qty}</span>
                                <button id="quantity-plus" class="qty-btn quantity-plus" data-id="${productData.id}">+</button>
                            </div>
                            <button id="add-to-cart" class="cart-button" data-id="${productData.id}" data-name="${productData.name}">Add to Cart</button>
                        </div>`;
                        
    // set the html to the main card of the product 
    document.getElementById('product-details-container').innerHTML = productDetailsHtml;
}

document.addEventListener('DOMContentLoaded', () => {

    // function for fetching the product data from data.json
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

        // sending the data with quantity of the product in the card to the updateProductDetails() function
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let cart = JSON.parse(localStorage.getItem('cart')) || {};
        let userCart = cart[currentUser.email];
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        let items = Object.values(data["categories"]);
        for (let i = 0; i < items.length; i++) {
            let subItems = Object.values(items[i]);
            for (let j = 0 ; j < subItems.length; j++) {
                if (subItems[j]["id"] == productId){
                    let qty = 0;
                    if (userCart && userCart[productId]){
                        qty = userCart[productId];
                    } 
                    updateProductDetails(subItems[j], qty);
                }
            }
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
});

$(document).ready(function(){
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    // Ensure the cart has an entry for the current user
    if (!cart[currentUser.email]) {
        cart[currentUser.email] = {};
    }

    // increasing the quantity on clicking the plus button 
    $(document).on('click', '.quantity-plus', function(){
        let id = $(this).data('id');
        let quantityDisplay = $(`.quantity-display[data-id='${id}']`); // getting the element of the quantity value
        let quantity = parseInt(quantityDisplay.text()) + 1;

        // setting the quantity value to the text
        quantityDisplay.text(quantity);
    });

    // decreasing the quantity on clicking the minus button
    $(document).on('click', '.quantity-minus', function(){
        let id = $(this).data('id');
        let quantityDisplay = $(`.quantity-display[data-id='${id}']`); // getting the element of the quantity value
        let quantity = parseInt(quantityDisplay.text());
        if (quantity > 0) {
            quantity -= 1;
            // setting the quantity value to the text
            quantityDisplay.text(quantity);
        }
    });

    $(document).on('click', '.cart-button', function(){
        let id = $(this).data('id');
        let name = $(this).data('name');
        let quantity = parseInt($(`.quantity-display[data-id='${id}']`).text());
        if (quantity > 0) {
            cart[currentUser.email][id] = quantity; // set the quantity of the cart of the current user's product
            let message = 'You have added '+ quantity +' '+ name +'!';

            // Plugin of Jquery fire on operation
            Swal.fire({
                title: "Great!",
                text: message,
                icon: "success",
                confirmButtonColor: "#4CAF50"
            });
            localStorage.setItem('cart', JSON.stringify(cart));  // update the cart after the changes
        }
    });
});
