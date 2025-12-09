document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#ordersTable tbody');
    const statusFilter = document.getElementById('statusFilter');
    // const searchBtn = document.getElementById('searchBtn'); // switched to select vs. open text search (more intuitive ;)
    const resetBtn = document.getElementById('resetBtn');
    const errorMsg = document.getElementById('errorMsg');

    const textSearch = document.getElementById('textSearch');

    // store all fetched orders to allow client-side filtering
    let allOrders = [];

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
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 32px; color: var(--text-secondary);">Loading...</td></tr>';

        try {
            // check if we are searching for a specific ID via backend
            // but getting all is easier for client-side filtering of both ID and Name
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

            allOrders = await response.json();
            applyFilters(); // filter and render
        } catch (error) {
            console.error('Error:', error);
            tableBody.innerHTML = '';
            showError(`Error loading data: ${error.message}`);
        }
    }

    // specific function to filtering results based on inputs
    function applyFilters() {
        const statusVal = statusFilter.value.toLowerCase();
        const textVal = textSearch.value.trim().toLowerCase();

        const filtered = allOrders.filter(order => {
            const matchesText = textVal === '' ||
                order.orderId.toLowerCase().includes(textVal) ||
                order.customerName.toLowerCase().includes(textVal);
            return matchesText;
        });

        renderOrders(filtered);
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

    // Instant Text Search
    textSearch.addEventListener('input', () => {
        applyFilters();
    });

    resetBtn.addEventListener('click', () => {
        statusFilter.value = '';
        textSearch.value = ''; // clear text
        fetchOrders(); // reload all
    });

    // initial load
    fetchOrders();
});
