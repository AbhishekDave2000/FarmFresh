
// this function shows the product container based on the category clicked
function showProducts(productId,classArray){
    items = classArray.split(',');
    for(let i = 0; i < items.length; i++) {
        if (items[i] == productId){
            let element = document.getElementById(`${productId}-container`);
            element.setAttribute("style", "display: flex; flex-direction: row; flex-wrap: wrap;");
        } else {
            document.getElementById(`${items[i]}-container`).setAttribute("style", "display: none !important;");
        }
    }
}

// function called on load of the product listing page
function fetchProductDataAndCategories() {
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
        // get the data from the data.json file and send it to the show categories function to display the categories dynamic 
        showCategoriesList(data);

        let items = Object.keys(data['categories']);
        for (let i = 0; i < items.length; i++){
            // populate the cards one bye one for each categories and fist display the first category's products and hide all the other
            // this will loop category wise
            populateCards(data["categories"][items[i]], document.getElementById(items[i]+"-container"));
            if ( i == 0){
                document.getElementById(items[i]+'-container').setAttribute("style", "display: flex;");
            } else {
                document.getElementById(items[i]+'-container').setAttribute("style", "display: none;");
            }
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

// This shows the category list and product listing for all the data and categories dynamically from the data.json
function showCategoriesList(data){
    categoryListHtml = ``;
    productListingContainerHtml = ``;
    listItems = Object.keys(data['categories']);
    for(let i = 0 ; i < listItems.length; i++ ) {
        categoryName = listItems[i].charAt(0).toUpperCase() + listItems[i].slice(1).toLowerCase();
        categoryListHtml += `<li onclick="showProducts('${listItems[i]}','${listItems}')">${categoryName}</li>`;
        productListingContainerHtml += `<div id="${listItems[i]}-container" class="products-container"></div>`;
    }
    document.getElementById('categories-list').innerHTML = categoryListHtml;
    document.getElementById('products-listing-section').innerHTML = productListingContainerHtml;
}

// populating the card with the data of all the products from data.json and it will set single category's products
function populateCards(items, container){
    html = ``; // initial html set it to empty string
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    let userCart = cart[currentUser.email];
    
    for (let i = 0; i < items.length; i++) {
        let qty = 0;
        if (userCart && userCart[items[i]["id"]]) {
            qty = userCart[items[i]["id"]];
        }
        // card html for a single one is set in the loop and append it too the previous one's 
        html += `<div class="card">
                    <div class="card-image">
                        <img src="${items[i]['img']}" alt="Product Image">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${items[i]["name"]}</h3>
                        <p class="card-price">$${items[i]["price"]}</p>
                        <p><span id="product-qty">${items[i]["qty"]}</span>&nbsp;<span id="product-qty-measurement">${items[i]["packaging"]}</span></p>
                        <div class="card-quantity">
                            <button class="quantity-minus qty-btn" data-id="${items[i]["id"]}">-</button>
                            <span class="quantity-display" data-id="${items[i]["id"]}">${qty}</span>
                            <button class="quantity-plus qty-btn" data-id="${items[i]["id"]}">+</button>
                            <button class="cart-button card-button" data-id="${items[i]["id"]}" data-name="${items[i]["name"]}">Add to Cart</button>
                        </div>
                        <div class="view-details-div">
                            <button class="card-button view-details" data-id="${items[i]["id"]}" onClick="getProductDetails(${items[i]["id"]})">View Details</button>
                        </div>
                    </div>
                </div>`;
    }
    // <p class="card-description">${items[i]["desc"]}</p>

    // set the whole html string to the container
    container.innerHTML = html;
}

// get product details will redirect it to the product details page with the product id of the product clicked for view details
function getProductDetails(productId){
    window.location.href = `/html/productDetails.html?id=${productId}`;
}


$(document).ready(function(){

    // get current user and cart from local storage
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    // Ensure the cart has an entry for the current user
    if (!cart[currentUser.email]) {
        cart[currentUser.email] = {};
    }

    // function for quantity plus
    $(document).on('click', '.quantity-plus', function(){
        let id = $(this).data('id');
        let quantityDisplay = $(`.quantity-display[data-id='${id}']`);
        let quantity = parseInt(quantityDisplay.text()) + 1;
        quantityDisplay.text(quantity);
    });

    // function for quantity minus
    $(document).on('click', '.quantity-minus', function(){
        let id = $(this).data('id');
        let quantityDisplay = $(`.quantity-display[data-id='${id}']`);
        let quantity = parseInt(quantityDisplay.text());
        if (quantity > 0) {
            quantity -= 1;
            quantityDisplay.text(quantity);
        }
    });

    // function for adding it in the cart based on the quantity selected
    $(document).on('click', '.cart-button', function(){
        let id = $(this).data('id');
        let name = $(this).data('name');
        let quantity = parseInt($(`.quantity-display[data-id='${id}']`).text());
        if (quantity > 0) {
            cart[currentUser.email][id] = quantity;
            let message = 'You have added '+ quantity +' '+ name +'!';

            // Plugin of Jquery
            Swal.fire({
                title: "Great!",
                text: message,
                icon: "success",
                confirmButtonColor: "#4CAF50"
            });
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    });

    // Search functionality code
    $('#searchInput').on('keyup', function() {
        let value = $(this).val().toLowerCase();
        $('.card').filter(function() {
            $(this).toggle($(this).find('.card-title').text().toLowerCase().indexOf(value) > -1);
        });
    });
});
