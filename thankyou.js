document.addEventListener('DOMContentLoaded', function() {
    // Load order confirmation from localStorage
    const orderConfirmation = JSON.parse(localStorage.getItem('orderConfirmation'));
    
    if (!orderConfirmation) {
        window.location.href = 'index.html';
        return;
    }
    
    // Format delivery date
    const deliveryDate = new Date(orderConfirmation.deliveryDate);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = deliveryDate.toLocaleDateString('en-US', options);
    
    // Display order details
    document.getElementById('customer-email').textContent = orderConfirmation.customer.email;
    document.getElementById('delivery-date').textContent = formattedDate;
    
    // Clear the order confirmation from localStorage
    localStorage.removeItem('orderConfirmation');
});
   