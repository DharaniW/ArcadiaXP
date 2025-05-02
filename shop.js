// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Update aria-expanded attribute for accessibility
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
    });
    
    // Close menu when clicking on a link (optional)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Close menu when clicking outside (optional)
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && 
            !event.target.closest('.nav-links') && 
            !event.target.closest('.hamburger')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});
    
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    let cart = [];
    
    // DOM elements
    const cartTable = document.querySelector('#cart-table tbody');
    const subtotalElement = document.getElementById('subtotal');
    const cartCountElement = document.getElementById('cart-count');
    const buyNowButton = document.getElementById('buy-now');
    const addToFavoritesButton = document.getElementById('add-to-favorites');
    const applyFavoritesButton = document.getElementById('apply-favorites');
    
    // Update cart count
    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = count;
    }
    
    // Helper function to parse price correctly
    function parsePrice(priceString) {
        // Remove dollar sign and commas, then parse as float
        return parseFloat(priceString.replace(/[^\d.-]/g, ''));
    }
    
    // Quantity controls
    document.querySelectorAll('.quantity-control').forEach(control => {
        const increment = control.querySelector('.increment');
        const decrement = control.querySelector('.decrement');
        const input = control.querySelector('.quantity');
        const product = control.closest('.product');
        
        increment.addEventListener('click', () => {
            input.value = parseInt(input.value) + 1;
            updateCart(product);
        });
        
        decrement.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue > 0) {
                input.value = currentValue - 1;
                updateCart(product);
            }
        });
        
        input.addEventListener('change', () => {
            const value = parseInt(input.value);
            input.value = value < 0 ? 0 : value;
            updateCart(product);
        });
    });
    
    // Update cart function
    function updateCart(product) {
        const id = product.dataset.id;
        const name = product.dataset.name;
        const price = parsePrice(product.dataset.price);
        const quantity = parseInt(product.querySelector('.quantity').value);
        
        // Remove if quantity is 0
        if (quantity === 0) {
            cart = cart.filter(item => item.id !== id);
        } else {
            // Check if item already in cart
            const existingItemIndex = cart.findIndex(item => item.id === id);
            
            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity = quantity;
            } else {
                cart.push({ id, name, price, quantity });
            }
        }
        
        // Save to localStorage
        localStorage.setItem('currentOrder', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
    
    // Remove item from cart
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        
        // Update quantity input to 0
        const productElement = document.querySelector(`.product[data-id="${id}"]`);
        if (productElement) {
            productElement.querySelector('.quantity').value = 0;
        }
        
        // Save to localStorage
        localStorage.setItem('currentOrder', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
    
    // Render cart function with event delegation
    function renderCart() {
        // Clear cart table
        cartTable.innerHTML = '';
        
        // Add items to cart
        cart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td><button class="remove-btn" data-id="${item.id}">Remove</button></td>
            `;
            cartTable.appendChild(row);
        });
        
        // Calculate subtotal
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    // Event delegation for remove buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn')) {
            removeFromCart(e.target.dataset.id);
        }
    });
    
    // Buy Now button
    buyNowButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before proceeding.');
            return;
        }
        
        // Save cart to localStorage before redirecting
        localStorage.setItem('currentOrder', JSON.stringify(cart));
        window.location.href = 'order.html';
    });
    
    // Add to Favorites
    addToFavoritesButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before saving as favorite.');
            return;
        }
        
        localStorage.setItem('favoriteOrder', JSON.stringify(cart));
        alert('Your current build has been saved as favorite!');
    });
    
    // Apply Favorites
    applyFavoritesButton.addEventListener('click', () => {
        const favoriteOrder = localStorage.getItem('favoriteOrder');
        
        if (!favoriteOrder) {
            alert('No favorite build found. Please save a build as favorite first.');
            return;
        }
        
        // Reset all quantities to 0 first
        document.querySelectorAll('.quantity').forEach(input => {
            input.value = 0;
        });
        
        try {
            // Parse favorite order and update quantities
            const parsedOrder = JSON.parse(favoriteOrder);
            cart = []; // Reset cart before applying favorites
            
            parsedOrder.forEach(item => {
                const productElement = document.querySelector(`.product[data-id="${item.id}"]`);
                if (productElement) {
                    productElement.querySelector('.quantity').value = item.quantity;
                    cart.push({...item}); // Add to cart
                }
            });
            
            // Save to localStorage
            localStorage.setItem('currentOrder', JSON.stringify(cart));
            renderCart();
            updateCartCount();
            alert('Favorite build applied successfully!');
        } catch (e) {
            console.error('Error parsing favorite order:', e);
            alert('Favorite build applied successfully!');
        }
    });
    
    // Initialize cart from localStorage if exists
    function initializeCart() {
        const savedOrder = localStorage.getItem('currentOrder');
        if (savedOrder) {
            try {
                cart = JSON.parse(savedOrder);
                // Update quantity inputs to match cart
                cart.forEach(item => {
                    const productElement = document.querySelector(`.product[data-id="${item.id}"]`);
                    if (productElement) {
                        productElement.querySelector('.quantity').value = item.quantity;
                    }
                });
                renderCart();
                updateCartCount();
            } catch (e) {
                console.error('Error parsing saved cart:', e);
                localStorage.removeItem('currentOrder');
                cart = [];
            }
        }
    }
    
    // Initialize the cart when page loads
    initializeCart();
});