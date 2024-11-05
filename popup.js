chrome.storage.local.get('ordersArray', ({ ordersArray }) => {
    const container = document.getElementById('orders-container');
    
    if (ordersArray && ordersArray.length > 0) {
        ordersArray.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order';
            orderDiv.innerHTML = `
                <strong>Date:</strong> ${order.date} <br>
                <strong>Status:</strong> ${order.status} <br>
                <strong>Total Price:</strong> ${order.totalPrice}
                <div class="products">
                    <strong>Products:</strong>
                </div>
            `;

            const productsContainer = orderDiv.querySelector('.products');
            order.products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                    - ${product.name} <br>
                    Quantity & Price: ${product.qtyPrice} <br>
                    Total: ${product.total}
                `;
                productsContainer.appendChild(productDiv);
            });

            container.appendChild(orderDiv);
        });
    } else {
        container.innerHTML = '<p>No orders found.</p>';
    }
});
