const categoryButtons = document.querySelectorAll('.category-btn');
const carouselWrapper = document.getElementById('carousel-wrapper');
const cartList = document.getElementById('cart-list');
const totalPriceSpan = document.getElementById('total-price');
const checkoutButton = document.getElementById('checkout-btn');

let cart = [];
let totalPrice = 0;

// Function to populate menu based on category
function populateMenu(category) {
    const items = document.querySelectorAll('.menu-item');
    
    items.forEach(item => {
        if (item.getAttribute('data-category') === category || category === 'all') {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Function to add item to cart
function addToCart(itemID) {
    const item = document.querySelector(`.menu-item img[data-id="${itemID}"]`).closest('.menu-item');
    if (!item) {
        console.error('Item not found for ID:', itemID);
        return;
    }

    const productName = item.querySelector('h3').textContent;
    const priceText = item.querySelector('p:nth-of-type(2)').textContent;
    const quantityText = item.querySelector('p:nth-of-type(4)').textContent;

    // Extract price and quantity
    const price = parseFloat(priceText.replace('Price: $', '').trim());
    const quantity = parseInt(quantityText.replace('Quantity: ', '').trim());

    if (isNaN(price) || isNaN(quantity)) {
        console.error('Invalid price or quantity:', priceText, quantityText);
        return;
    }

    // Check if item already exists in the cart
    const existingItem = cart.find(cartItem => cartItem.ProductName === productName);
    if (existingItem) {
        // Update quantity if item already in cart
        existingItem.Quantity += quantity;
    } else {
        // Add new item to the cart
        const cartItem = {
            ProductName: productName,
            Price: price,
            Quantity: quantity
        };
        cart.push(cartItem);
    }

    updateCart();
}

// Function to update cart
function updateCart() {
    cartList.innerHTML = '';
    totalPrice = 0;

    cart.forEach(item => {
        const itemLi = document.createElement('li');
        itemLi.textContent = `${item.ProductName} - $${item.Price.toFixed(2)} x ${item.Quantity}`;
        cartList.appendChild(itemLi);
        totalPrice += item.Price * item.Quantity;
    });

    totalPriceSpan.textContent = totalPrice.toFixed(2);
}

// Function to handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        Swal.fire({
            title: 'Oops!',
            text: 'Your cart is empty!',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Save cart data to local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Simulate a checkout process
    Swal.fire({
        title: 'Checkout Successful!',
        text: `Total Price: $${totalPrice.toFixed(2)}`,
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        // Clear the cart
        cart = [];
        updateCart();

        // Redirect to shoppinglist.html
        window.location.href = 'shoppinglist.html';
    });
}

// Event listener for category buttons
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        populateMenu(category);
    });
});

// Event listener for image clicks
carouselWrapper.addEventListener('click', (event) => {
    const img = event.target.closest('.item-img');
    if (img) {
        const itemID = img.getAttribute('data-id');
        console.log(`Item clicked: ${itemID}`); // Log clicked item ID
        addToCart(itemID);
    }
});

// Event listener for checkout button
checkoutButton.addEventListener('click', handleCheckout);

// Initialize with all items
populateMenu('all');  // Set default category

