document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#ordersTable tbody');
    const statusFilter = document.getElementById('statusFilter');
    // const searchBtn = document.getElementById('searchBtn'); // switched to select vs. open text search (more intuitive ;)
    const resetBtn = document.getElementById('resetBtn');
    const errorMsg = document.getElementById('errorMsg');

    function showError(message) {
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.classList.remove('hidden');
        }
    }

    function hideError() {
        if (errorMsg) {
            errorMsg.classList.add('hidden');
        }
    }

    async function fetchOrders(status = '') {
        hideError();
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Loading...</td></tr>';

        try {
            let url = '/api/orders';
            if (status) {
                // use search endpoint if status is provided, or query param on list endpoint
                url = `/api/orders/search?status=${encodeURIComponent(status)}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to fetch orders');
            }

            const orders = await response.json();
            renderOrders(orders);
        } catch (error) {
            console.error('Error:', error);
            tableBody.innerHTML = '';
            showError(`Error loading data: ${error.message}`);
        }
    }

    function renderOrders(orders) {
        tableBody.innerHTML = '';

        if (orders.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 32px; color: var(--text-secondary);">No orders found.</td></tr>';
            return;
        }

        orders.forEach(order => {
            const row = document.createElement('tr');

            // determine styles
            const systemClass = order.sourceSystem === 'SystemA' ? 'system-a' : 'system-b';
            const statusLower = order.status.toLowerCase();
            const statusClass = `status-${statusLower}`;

            row.innerHTML = `
                <td style="font-weight: 500;">${order.orderId}</td>
                <td>${order.customerName}</td>
                <td style="color: var(--text-secondary);">${order.orderDate}</td>
                <td style="font-family: monospace; font-size: 1rem;">$${order.totalAmount.toFixed(2)}</td>
                <td><span class="badge ${statusClass}">${order.status}</span></td>
                <td>
                    <div class="source-tag ${systemClass}">
                        <span class="system-icon"></span>
                        ${order.sourceSystem}
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    // event listeners
    // trigger search immediately on dropdown change
    statusFilter.addEventListener('change', () => {
        const val = statusFilter.value;
        fetchOrders(val);
    });

    resetBtn.addEventListener('click', () => {
        statusFilter.value = '';
        fetchOrders();
    });

    // initial load
    fetchOrders();
});
