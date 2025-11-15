document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. CẤU HÌNH VÀ BIẾN ===
    const API_BASE = 'https://namtranngoc.pythonanywhere.com';
    const PRODUCT_API_URL = `${API_BASE}/api/products/`; // API chuẩn
    const USER_API_URL = `${API_BASE}/api/auth/users/`;
    const ORDER_API_URL = `${API_BASE}/api/orders/admin/`;

    const token = localStorage.getItem('accessToken');
    
    // Lấy các element
    const productForm = document.getElementById('product-form');
    const productsTableBody = document.getElementById('products-table-body');
    const usersTableBody = document.getElementById('users-table-body');
    const ordersTableBody = document.getElementById('orders-table-body'); // Chỉ khai báo 1 lần
    const notificationArea = document.getElementById('admin-notification');
    const logoutLink = document.getElementById('admin-logout');

    // === 2. BẢO VỆ TRANG (GUARD) ===
    if (!token) {
        window.location.href = 'admin-login.html'; // Chuyển về trang login Admin
        return;
    }

    // === 3. HÀM HIỂN THỊ THÔNG BÁO (THAY THẾ ALERT) ===
    function showNotification(message, isError = false) {
        if (!notificationArea) return;
        notificationArea.textContent = message;
        notificationArea.className = `alert ${isError ? 'alert-danger' : 'alert-success'} d-block`;
        
        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            notificationArea.className = 'alert d-none';
        }, 3000);
    }
    
    // === 4. LOGIC ĐĂNG XUẤT ===
     if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = 'admin-login.html';
        });
    }

    // === 5. FORM THÊM SẢN PHẨM (ĐÃ SỬA) ===
    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(productForm);

            try {
                // SỬA API PATH: Gọi POST /api/products/
                const res = await fetch(PRODUCT_API_URL, {
                    method: 'POST',
                    headers: {
                        // BẮT BUỘC PHẢI GỬI TOKEN ĐỂ XÁC MINH ADMIN
                        'Authorization': `Bearer ${token}` 
                    },
                    body: formData // Khi dùng FormData, KHÔNG set 'Content-Type'
                });

                if (res.ok) {
                    showNotification('Thêm sản phẩm thành công!'); // Bỏ alert
                    productForm.reset();
                    loadProducts(); // Tải lại danh sách
                } else {
                    const err = await res.json();
                    showNotification('Lỗi: ' + JSON.stringify(err), true); // Bỏ alert
                }
            } catch (err) {
                showNotification('Lỗi kết nối: ' + err.message, true); // Bỏ alert
            }
        });
    }

    // === 6. HÀM TẢI DỮ LIỆU (ĐÃ SỬA) ===

    // --- TẢI SẢN PHẨM ---
    async function loadProducts() {
        if (!productsTableBody) return;
        productsTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Đang tải...</td></tr>';
        try {
            // SỬA API PATH: Gọi GET /api/products/
            const res = await fetch(PRODUCT_API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`Lỗi ${res.status}: Không thể tải sản phẩm.`);
            
            const data = await res.json();
            productsTableBody.innerHTML = '';
            if (data.length === 0) {
                 productsTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Chưa có sản phẩm nào</td></tr>';
                 return;
            }
            data.forEach(p => {
                const shortDesc = p.description ? (p.description.length > 50 ? p.description.substring(0, 50) + '...' : p.description) : '...';
                productsTableBody.innerHTML += `
                    <tr>
                        <td>${p.id}</td>
                        <td><strong>${p.name}</strong></td>
                        <td>${parseFloat(p.price).toLocaleString()} đ</td>
                        <td><img src="${p.image_url}" width="50" alt="${p.name}"/></td>
                        <td>${shortDesc}</td>
                    </tr>
                `;
            });
        } catch (err) {
            productsTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${err.message}</td></tr>`;
        }
    }

    // --- TẢI USERS ---
    async function loadUsers() {
        if (!usersTableBody) return;
        usersTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Đang tải...</td></tr>';
        try {
            // SỬA API PATH: Gọi GET /api/auth/users/
            const res = await fetch(USER_API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`Lỗi ${res.status}`);
            
            const data = await res.json();
            usersTableBody.innerHTML = '';
            data.forEach(u => {
                usersTableBody.innerHTML += `
                    <tr>
                        <td>${u.id}</td>
                        <td>${u.username}</td>
                        <td>${u.email}</td>
                        <td>${u.is_staff ? '<span class="badge bg-danger">Admin</span>' : 'User'}</td>
                        <td>${new Date(u.date_joined).toLocaleDateString()}</td>
                    </tr>
                `;
            });
        } catch (err) {
            usersTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Lỗi tải user.</td></tr>`;
        }
    }

    // --- TẢI ĐƠN HÀNG ---
    async function loadOrders() {
        if (!ordersTableBody) return;
        ordersTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Đang tải...</td></tr>';
        try {
            // SỬA API PATH: Gọi GET /api/orders/admin/
            const res = await fetch(ORDER_API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401 || res.status === 403) {
                showNotification('Bạn không có quyền Admin hoặc phiên hết hạn.', true);
                window.location.href = 'admin-login.html';
                return;
            }
            if (!res.ok) throw new Error(`Lỗi ${res.status}`);
            
            const data = await res.json();
            ordersTableBody.innerHTML = '';
            data.forEach(o => {
                ordersTableBody.innerHTML += `
                    <tr>
                        <td>${o.id}</td>
                        <td>${o.user_username}</td>
                        <td>${new Date(o.order_date).toLocaleString()}</td>
                        <td>${parseFloat(o.total_amount).toLocaleString()} đ</td>
                        <td>${o.status}</td>
                        <td><button class="btn btn-sm btn-primary">Xem</button></td>
                    </tr>
                `;
            });
        } catch (err) {
             ordersTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Lỗi tải đơn hàng.</td></tr>`;
        }
    }

    // === 7. LOGIC CHẠY TAB ===
    const productsTab = document.querySelector('#products-tab');
    const usersTab = document.querySelector('#users-tab');
    const ordersTab = document.querySelector('#orders-tab');

    if(productsTab) productsTab.addEventListener('shown.bs.tab', loadProducts);
    if(usersTab) usersTab.addEventListener('shown.bs.tab', loadUsers);
    if(ordersTab) ordersTab.addEventListener('shown.bs.tab', loadOrders);

    // Tải tab mặc định (Giả sử là tab User)
    loadUsers();
});