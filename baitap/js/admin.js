// js/admin.js - PHIÊN BẢN FIX LỖI QUYỀN & HIỂN THỊ DỮ LIỆU

document.addEventListener('DOMContentLoaded', () => {
    // === CẤU HÌNH API ===
    const BASE_API_URL = 'https://namtranngoc.pythonanywhere.com';
    const ORDER_API_URL = `${BASE_API_URL}/api/orders/admin/`;
    const USER_API_URL = `${BASE_API_URL}/api/auth/users/`;
    
    const token = localStorage.getItem('accessToken');
    const ordersTableBody = document.getElementById('orders-table-body');
    const usersTableBody = document.getElementById('users-table-body');
    const logoutLink = document.getElementById('admin-logout');
    const statusMessageEl = document.getElementById('orders-status-message');

    // 1. Kiểm tra sơ bộ: Nếu không có token, đá về login ngay
    if (!token) {
        window.location.href = 'login.html';
        return;
    }else{
        window.location.href = 'admin.html'
    }

    // 2. Hàm xử lý Đăng xuất
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = 'index.html';
        });
    }

    // ============================================================
    // 3. HÀM RENDER (HIỂN THỊ DỮ LIỆU RA BẢNG)
    // ============================================================

    const renderOrders = (orders) => {
        ordersTableBody.innerHTML = '';
        if (!orders || orders.length === 0) {
            ordersTableBody.innerHTML = `<tr><td colspan="6" class="text-center">Chưa có đơn hàng nào.</td></tr>`;
            return;
        }

        orders.forEach(order => {
            // Map trạng thái sang màu sắc/tên tiếng Việt
            let badgeClass = 'bg-secondary';
            let statusText = order.status;
            
            if (order.status === 'pending') { badgeClass = 'bg-warning text-dark'; statusText = 'Đang chờ'; }
            else if (order.status === 'shipped') { badgeClass = 'bg-primary'; statusText = 'Đang giao'; }
            else if (order.status === 'delivered') { badgeClass = 'bg-success'; statusText = 'Đã giao'; }
            else if (order.status === 'cancelled') { badgeClass = 'bg-danger'; statusText = 'Đã hủy'; }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${order.id}</td>
                <td><strong>${order.user_username || 'Unknown'}</strong></td>
                <td>${new Date(order.order_date).toLocaleString('vi-VN')}</td>
                <td>${parseFloat(order.total_amount).toLocaleString('vi-VN')} đ</td>
                <td><span class="badge ${badgeClass}">${statusText}</span></td>
                <td>
                    <select class="form-select form-select-sm status-select" data-id="${order.id}">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Vận chuyển</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Hoàn thành</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Hủy đơn</option>
                    </select>
                </td>
            `;
            ordersTableBody.appendChild(row);
        });

        // Gắn sự kiện thay đổi trạng thái cho các ô select vừa tạo
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', updateOrderStatus);
        });
    };

    const renderUsers = (users) => {
        usersTableBody.innerHTML = '';
        if (!users || users.length === 0) {
            usersTableBody.innerHTML = `<tr><td colspan="5" class="text-center">Không tìm thấy user.</td></tr>`;
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td><strong>${user.username}</strong></td>
                <td>${user.email}</td>
                <td>${user.is_staff ? '<span class="badge bg-danger">Admin</span>' : '<span class="badge bg-info text-dark">User</span>'}</td>
                <td>—</td> 
            `;
            // Lưu ý: Djoser mặc định có thể không trả về date_joined, nên để tạm —
            usersTableBody.appendChild(row);
        });
    };

    // ============================================================
    // 4. LOGIC GỌI API (QUAN TRỌNG)
    // ============================================================

    // Hàm cập nhật trạng thái đơn hàng
    const updateOrderStatus = async (e) => {
        const orderId = e.target.dataset.id;
        const newStatus = e.target.value;

        try {
            const response = await fetch(`${ORDER_API_URL}${orderId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Hiển thị thông báo thành công nhỏ
                alert(`Cập nhật đơn hàng #${orderId} thành công!`);
                // Tải lại dữ liệu để cập nhật màu sắc badge
                loadData(); 
            } else {
                alert('Lỗi: Không thể cập nhật trạng thái.');
            }
        } catch (err) {
            alert('Lỗi kết nối server.');
        }
    };

    // Hàm tải toàn bộ dữ liệu
    const loadData = async () => {
        // 1. Tải Đơn hàng
        try {
            const orderRes = await fetch(ORDER_API_URL, {
                headers: { 'Authorization': `JWT ${token}` }
            });

            if (orderRes.status === 401 || orderRes.status === 403) {
                // NẾU LỖI 401/403 TẠI ĐÂY => CHẮC CHẮN KHÔNG PHẢI ADMIN HOẶC TOKEN HẾT HẠN
                alert('Bạn không có quyền Admin hoặc phiên đăng nhập hết hạn.');
                window.location.href = 'login.html';
                return;
            }

            const orders = await orderRes.json();
            renderOrders(orders);

        } catch (error) {
            console.error(error);
            ordersTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Lỗi tải đơn hàng.</td></tr>`;
        }

        // 2. Tải User (Chỉ chạy nếu bước trên không bị đá ra)
        try {
            const userRes = await fetch(USER_API_URL, {
                headers: { 'Authorization': `JWT ${token}` }
            });
            const users = await userRes.json();
            renderUsers(users);
        } catch (error) {
            console.error(error);
        }
    };

    // Chạy hàm tải dữ liệu ngay khi vào trang
    loadData();
});