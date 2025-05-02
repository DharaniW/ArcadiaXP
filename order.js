document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const paymentMethodSelect = document.getElementById('payment');
  const cardDetailsSection = document.getElementById('card-details');
  const orderItemsTable = document.getElementById('order-items');
  const orderSubtotalElement = document.getElementById('order-subtotal');
  const orderTotalElement = document.getElementById('order-total');
  const orderForm = document.getElementById('order-form');
  

  // Load order from localStorage
  const order = JSON.parse(localStorage.getItem('currentOrder')) || [];
  
  // If no items in cart, redirect back to shop
  if (order.length === 0) {
    window.location.href = 'index.html';
    return;
  }

  // Render order items
  function renderOrderItems() {
    orderItemsTable.innerHTML = '';
    
    let subtotal = 0;
    
    order.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
      `;
      orderItemsTable.appendChild(row);
      
      subtotal += item.price * item.quantity;
    });
    
    const shipping = 10.00;
    const total = subtotal + shipping;
    
    orderSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    orderTotalElement.textContent = `$${total.toFixed(2)}`;
  }
  // Add this event listener for payment method change
paymentMethodSelect.addEventListener('change', function() {
  if (this.value === 'credit' || this.value === 'debit') {
    cardDetailsSection.classList.remove('hidden');
    // Make card fields required
    document.getElementById('card-number').required = true;
    document.getElementById('card-name').required = true;
    document.getElementById('card-expiry').required = true;
    document.getElementById('card-cvv').required = true;
  } else {
    cardDetailsSection.classList.add('hidden');
    // Make card fields not required
    document.getElementById('card-number').required = false;
    document.getElementById('card-name').required = false;
    document.getElementById('card-expiry').required = false;
    document.getElementById('card-cvv').required = false;
  }
});



// Add these helper functions for card formatting
document.getElementById('card-number').addEventListener('input', function(e) {
  // Format card number with spaces every 4 digits
  let value = e.target.value.replace(/\s+/g, '');
  if (value.length > 0) {
    value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
  }
  e.target.value = value;
});

document.getElementById('card-expiry').addEventListener('input', function(e) {
  // Format expiry date as MM/YY
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  e.target.value = value;
});

document.getElementById('card-cvv').addEventListener('input', function(e) {
  // Only allow numbers for CVV
  e.target.value = e.target.value.replace(/\D/g, '');
});

// Update the form submission to include card details
orderForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Validate card details if credit/debit card selected
  if (paymentMethodSelect.value === 'credit' || paymentMethodSelect.value === 'debit') {
    if (!validateCardDetails()) {
      return;
    }
  }
  
  // Rest of your existing submission code...
});

function validateCardDetails() {
  const cardNumber = document.getElementById('card-number').value.replace(/\s+/g, '');
  const cardName = document.getElementById('card-name').value.trim();
  const expiry = document.getElementById('card-expiry').value;
  const cvv = document.getElementById('card-cvv').value;
  
  // Simple validation - in a real app you'd want more robust validation
  if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
    alert('Please enter a valid 16-digit card number');
    return false;
  }
  
  if (cardName.length < 3) {
    alert('Please enter the name on your card');
    return false;
  }
  
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    alert('Please enter a valid expiry date (MM/YY)');
    return false;
  }
  
  if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
    alert('Please enter a valid 3-digit CVV');
    return false;
  }
  
  return true;
}
  // Form submission
  orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
  
  
    // Gather form data
    const formData = {
      customer: {
        name: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        payment: document.getElementById('payment').value
      },
      order: order,
      orderDate: new Date().toISOString(),
      deliveryDate: calculateDeliveryDate()
      
    };
    
    // Save order details to localStorage
    localStorage.setItem('orderConfirmation', JSON.stringify(formData));
    
    // Clear the cart
    localStorage.removeItem('currentOrder');
    
    // Redirect to thank you page
    window.location.href = 'thankyou.html';
  });
  
  // Calculate delivery date (3 days from now)
  function calculateDeliveryDate() {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    return deliveryDate.toISOString();
  }
  
  // Initialize the page
  renderOrderItems();
});