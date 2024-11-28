chrome.storage.local.get('ordersArray', ({ ordersArray }) => {
    const container = document.getElementById('orders-container');
    const dateInput = document.getElementById('date');
    const filterButton = document.getElementById('filter');
    const exportButton = document.getElementById('export-pdf');

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    if (!ordersArray || ordersArray.length === 0) {
        container.innerHTML = '<p>No orders found.</p>';
        return;
    }

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

    function displayOrders(filteredOrders) {
        container.innerHTML = ''; // Clear previous results

        if (filteredOrders.length === 0) {
            container.innerHTML = '<p>No orders found for the selected date.</p>';
            return;
        }

        filteredOrders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order';
            orderDiv.innerHTML = `
                <strong>Date:</strong> ${order.date} | <strong>Seller:</strong> ${order.seller} <br>
                <div class="products">
                    ${order.products.map(product => `
                        <div>
                            - ${product.qtyPrice} (${product.total}) - ${product.name}<br>
                        </div>
                    `).join('')}
                </div>
                <strong>Total Price:</strong> ${order.totalPrice}
            `;
            container.appendChild(orderDiv);
        });
    }

    filterButton.addEventListener('click', () => {
        const selectedDate = new Date(dateInput.value);
        selectedDate.setHours(0, 0, 0, 0);

        const filteredOrders = ordersArray.filter(order => {
            const orderDate = parsePolishDate(order.date);
            return orderDate.getTime() === selectedDate.getTime();
        });

        displayOrders(filteredOrders);
    });

    // Export filtered data to a new window for printing
    exportButton.addEventListener('click', () => {
        const selectedDate = new Date(dateInput.value);
        selectedDate.setHours(0, 0, 0, 0);

        const filteredOrders = ordersArray.filter(order => {
            const orderDate = parsePolishDate(order.date);
            return orderDate.getTime() === selectedDate.getTime();
        });

        const printWindow = window.open('', '_blank', 'width=800,height=600');

        if (!printWindow) {
            alert('Failed to open a new window for export.');
            return;
        }

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
                        font-size: 14px;
                    }
                    .order {
                        padding: 10px;
                        border-bottom: 1px solid #ddd;
                    }
                    .products div {
                        padding: 3px 0px;
                    }
                </style>
            </head>
            <body>
                <h1>Filtered Orders for ${selectedDate.toDateString()}</h1>
                ${filteredOrders.map(order => `
                    <div class="order">
                        <strong>Date:</strong> ${order.date} | <strong>Seller:</strong> ${order.seller} <br>
                        <div class="products">
                            ${order.products.map(product => `
                                <div>
                                    ${product.qtyPrice} (${product.total}) - ${product.name}<br>
                                </div>
                            `).join('')}
                        </div>
                        <strong>Total Price:</strong> ${order.totalPrice}
                    </div>
                `).join('')}
            </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    });

    // Display all orders by default
    displayOrders(ordersArray);
});
