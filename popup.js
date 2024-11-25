chrome.storage.local.get('ordersArray', ({ ordersArray }) => {
    const container = document.getElementById('orders-container');

    if(!ordersArray || ordersArray.length === 0) {
        container.innerHTML = '<p>No orders found.</p>';
        return;
    }
    
    if (ordersArray && ordersArray.length > 0) {
        const dateFromInput = document.getElementById('date-from');
        const dateToInput = document.getElementById('date-to');
        const filterButton = document.getElementById('filter');
        const container = document.getElementById('orders-container');

        // Polish to English month mapping
        const monthMap = {
            'sty': 'Jan', 'lut': 'Feb', 'mar': 'Mar', 'kwi': 'Apr',
            'maj': 'May', 'cze': 'Jun', 'lip': 'Jul', 'sie': 'Aug',
            'wrz': 'Sep', 'paź': 'Oct', 'lis': 'Nov', 'gru': 'Dec'
        };

        // Function to parse Polish date to JavaScript Date
        function parsePolishDate(dateStr) {
            const [day, monthPolish, yearTime] = dateStr.split(' ');
            const monthEnglish = monthMap[monthPolish];
            const dateEnglishStr = `${day} ${monthEnglish} ${yearTime}`;
            const date = new Date(dateEnglishStr);
            date.setHours(0, 0, 0, 0);
            return date;
        }

        filterButton.addEventListener('click', () => {
            const fromDate = new Date(dateFromInput.value);
            const toDate = new Date(dateToInput.value);
            fromDate.setHours(0, 0, 0, 0);
            toDate.setHours(0, 0, 0, 0);

            console.log("From Date: ", fromDate);
            console.log("To Date: ", toDate);
            const filteredOrders = ordersArray.filter(order => {
                const orderDate = parsePolishDate(order.date);
                console.log("Order Date: ", orderDate);
                console.log("Order Date: ", orderDate >= fromDate && orderDate <= toDate);
                return orderDate >= fromDate && orderDate <= toDate;
            });

            container.innerHTML = ''; // Clear the container for new results

            // Display filtered orders
            filteredOrders.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.className = 'order';
                orderDiv.innerHTML = `
                    <strong>Date:</strong> ${order.date} <br>
                    <strong>Status:</strong> ${order.status} <br>
                    <strong>Total Price:</strong> ${order.totalPrice}
                    <div class="products">
                        ${order.products.map(product => `
                            <div>
                                <strong>Product:</strong> ${product.name} <br>
                                <strong>Qty & Price:</strong> ${product.qtyPrice} <br>
                                <strong>Product Total:</strong> ${product.total}
                            </div>
                        `).join('')}
                    </div>
                `;
                container.appendChild(orderDiv);
            });
        });

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
    }
    
    // Function to export filtered data to a new window
    function exportToPrint(filteredOrders) {
        // Open a new window
        const printWindow = window.open('', '_blank', 'width=800,height=600');

        if (!printWindow) {
            alert('Failed to open a new window for export.');
            return;
        }

        // Build the HTML content
        const printContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Exported Orders</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    .order {
                        border: 1px solid #ddd;
                        margin-bottom: 15px;
                        padding: 10px;
                        border-radius: 5px;
                    }
                    .products {
                        margin-top: 10px;
                    }
                    .products div {
                        margin-left: 15px;
                    }
                </style>
            </head>
            <body>
                <h1>Filtered Orders</h1>
                ${filteredOrders.map(order => `
                    <div class="order">
                        <strong>Date:</strong> ${order.date} <br>
                        <strong>Status:</strong> ${order.status} <br>
                        <strong>Total Price:</strong> ${order.totalPrice}
                        <div class="products">
                            <strong>Products:</strong>
                            ${order.products.map(product => `
                                <div>
                                    - ${product.name}, Qty & Price: ${product.qtyPrice}, Total: ${product.total}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </body>
            </html>
        `;

        // Write to the new window and print
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();

        // Automatically open print dialog
        printWindow.print();
    }

    // Add event listener for the Print button
    document.getElementById('export-pdf').addEventListener('click', () => {
        // Get the date inputs
        const fromDate = new Date(document.getElementById('date-from').value);
        const toDate = new Date(document.getElementById('date-to').value);

        // Ensure time is zeroed
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        // Filter orders by date
        const filteredOrders = ordersArray.filter(order => {
            const orderDate = parsePolishDate(order.date);
            return orderDate >= fromDate && orderDate <= toDate;
        });

        // Export the filtered data to a new window
        exportToPrint(filteredOrders);
    });

});
