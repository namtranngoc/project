// js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    // === CHỈNH SỬA URL NÀY CHO KHỚP VỚI SERVER PYTHONANYWHERE CỦA BẠN ===
    const BASE_API_URL = 'https://namtranngoc.pythonanywhere.com';
    const ORDER_API_URL = `${BASE_API_URL}/api/orders/admin/`;
    const USER_API_URL = `${BASE_API_URL}/api/auth/users/`;
    
    const token = localStorage.getItem('accessToken');
    const ordersTableBody = document.getElementById('orders-table-body');
    const usersTableBody = document.getElementById('users-table-body');
    const logoutLink = document.getElementById('admin-logout');

    // =======================================================
    // === 1. KIỂM TRA ĐĂNG NHẬP VÀ XÁC THỰC ADMIN (GUARD) ===
    // =======================================================
    
    if (!token) {
        // Nếu không có token, chuyển hướng về trang đăng nhập
        alert('Vui lòng đăng nhập bằng tài khoản Admin.');
        window.location.href = 'login.html';
        return;
    }

    // --- Logout Handler ---
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = 'login.html';
    });

    // ===================================================
    // === 2. HÀM TẢI DỮ LIỆU ĐƠN HÀNG VÀ RENDER (CRUD) ===
    // ===================================================

    const renderOrders = (orders) => {
        ordersTableBody.innerHTML = ''; // Xóa thông báo 'Đang tải...'

        if (orders.length === 0) {
            ordersTableBody.innerHTML = `<tr><td colspan="6" class="text-center">Không có đơn hàng nào.</td></tr>`;
            return;
        }

        orders.forEach(order => {
            const statusMap = {
                'pending': { text: 'Đang chờ', class: 'bg-warning' },
                'shipped': { text: 'Đã vận chuyển', class: 'bg-primary' },
                'delivered': { text: 'Đã giao hàng', class: 'bg-success' },
                'cancelled': { text: 'Đã hủy', class: 'bg-danger' }
            };
            const currentStatus = statusMap[order.status] || { text: order.status, class: 'bg-secondary' };

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.user_username} (${order.user})</td>
                <td>${new Date(order.order_date).toLocaleString('vi-VN')}</td>
                <td>${parseFloat(order.total_amount).toLocaleString('vi-VN')} VND</td>
                <td><span class="status-badge ${currentStatus.class}">${currentStatus.text}</span></td>
                <td>
                    <select class="form-select form-select-sm status-changer" data-order-id="${order.id}">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Đang chờ</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Vận chuyển</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Đã giao</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                    </select>
                </td>
            `;
            ordersTableBody.appendChild(row);
        });
        
        // Gắn sự kiện cho các dropdown thay đổi trạng thái
        document.querySelectorAll('.status-changer').forEach(select => {
            select.addEventListener('change', updateOrderStatus);
        });
    };

    const updateOrderStatus = async (e) => {
        const orderId = e.target.dataset.orderId;
        const newStatus = e.target.value;
        const statusMessageEl = document.getElementById('orders-status-message');

        try {
            const response = await fetch(`${ORDER_API_URL}${orderId}/`, {
                method: 'PATCH', // Dùng PATCH để cập nhật 1 trường
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                statusMessageEl.textContent = `Đã cập nhật trạng thái đơn hàng #${orderId} thành ${newStatus}.`;
                statusMessageEl.className = 'alert alert-success d-block';
                loadAllData(); // Tải lại dữ liệu
            } else {
                const error = await response.json();
                statusMessageEl.textContent = `Lỗi: Không đủ quyền hoặc lỗi server.`;
                statusMessageEl.className = 'alert alert-danger d-block';
            }
        } catch (error) {
            statusMessageEl.textContent = `Lỗi kết nối: Server không phản hồi.`;
            statusMessageEl.className = 'alert alert-danger d-block';
        }
    };


    // ====================================================
    // === 3. HÀM TẢI DỮ LIỆU USER VÀ RENDER (Read-only) ===
    // ====================================================

    const renderUsers = (users) => {
        usersTableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${user.is_staff ? '<span class="text-success fw-bold">ADMIN</span>' : 'User thường'}</td>
                <td>${new Date(user.date_joined).toLocaleDateString('vi-VN')}</td>
            `;
            usersTableBody.appendChild(row);
        });
    };

    const loadAllData = async () => {
        // --- Tải Đơn hàng ---
        try {
            const orderResponse = await fetch(ORDER_API_URL, {
                headers: { 'Authorization': `JWT ${token}` }
            });
            const orders = await orderResponse.json();
            renderOrders(orders);
        } catch (e) {
            ordersTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Lỗi kết nối API đơn hàng.</td></tr>`;
        }

        // --- Tải User ---
        // Djoser không cung cấp /users/all, chúng ta phải dùng /users/
        try {
            const userResponse = await fetch(USER_API_URL, {
                 headers: { 'Authorization': `JWT ${token}` }
            });
            const users = await userResponse.json();
            renderUsers(users);
        } catch (e) {
            usersTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Lỗi kết nối API user.</td></tr>`;
        }
    };

    // Khởi chạy
    loadAllData();
});