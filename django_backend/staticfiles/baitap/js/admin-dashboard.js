document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'https://namtranngoc.pythonanywhere.com';

    // ---- Products ----
    const productForm = document.getElementById('product-form');
    const productsTableBody = document.getElementById('products-table-body');

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(productForm);

        try {
            const res = await fetch(`${API_BASE}/products/create/`, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                alert('Thêm sản phẩm thành công!');
                productForm.reset();
                loadProducts();
            } else {
                const err = await res.json();
                alert('Có lỗi xảy ra: ' + (err.error || res.statusText));
            }
        } catch (err) {
            alert('Lỗi kết nối: ' + err.message);
        }
    });

    async function loadProducts() {
        try {
            const res = await fetch(`${API_BASE}/products/list/`);
            if (!res.ok) throw new Error('Không thể load products');
            const data = await res.json();
            productsTableBody.innerHTML = '';
            if (data.length === 0) {
                productsTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Chưa có sản phẩm nào</td></tr>';
                return;
            }
            data.forEach(p => {
                productsTableBody.innerHTML += `
                    <tr>
                        <td>${p.id}</td>
                        <td>${p.name}</td>
                        <td>${p.price}</td>
                        <td><img src="${API_BASE}${p.image}" width="50"/></td>
                    </tr>
                `;
            });
        } catch (err) {
            console.error(err);
            productsTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Lỗi khi load sản phẩm</td></tr>';
        }
    }

    document.querySelector('#products-tab').addEventListener('shown.bs.tab', loadProducts);
    loadProducts();

    // ---- Users ----
    const usersTableBody = document.getElementById('users-table-body');
    async function loadUsers() {
        try {
            const res = await fetch(`${API_BASE}/users/list/`);
            if (!res.ok) throw new Error('Không thể load users');
            const data = await res.json();
            usersTableBody.innerHTML = '';
            if (data.length === 0) {
                usersTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Chưa có user nào</td></tr>';
                return;
            }
            data.forEach(u => {
                usersTableBody.innerHTML += `
                    <tr>
                        <td>${u.id}</td>
                        <td>${u.username}</td>
                        <td>${u.email}</td>
                        <td>${u.is_staff ? 'Yes' : 'No'}</td>
                        <td>${u.date_joined}</td>
                    </tr>
                `;
            });
        } catch (err) {
            console.error(err);
        }
    }
    document.querySelector('#users-tab').addEventListener('shown.bs.tab', loadUsers);
    loadUsers();

    // ---- Orders ----
    const ordersTableBody = document.getElementById('orders-table-body');
    async function loadOrders() {
        try {
            const res = await fetch(`${API_BASE}/orders/list/`);
            if (!res.ok) throw new Error('Không thể load orders');
            const data = await res.json();
            ordersTableBody.innerHTML = '';
            if (data.length === 0) {
                ordersTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Chưa có đơn hàng nào</td></tr>';
                return;
            }
            data.forEach(o => {
                ordersTableBody.innerHTML += `
                    <tr>
                        <td>${o.id}</td>
                        <td>${o.user}</td>
                        <td>${o.created_at}</td>
                        <td>${o.total_price}</td>
                        <td>${o.status}</td>
                    </tr>
                `;
            });
        } catch (err) {
            console.error(err);
        }
    }
    document.querySelector('#orders-tab').addEventListener('shown.bs.tab', loadOrders);
    loadOrders();
});
