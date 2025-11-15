// js/my-orders.js

document.addEventListener('DOMContentLoaded', () => {
    
    const API_BASE = 'https://namtranngoc.pythonanywhere.com';
    const ORDER_API_URL = `${API_BASE}/api/orders/`;
    
    const token = localStorage.getItem('accessToken');
    const tableBody = document.getElementById('orders-table-body');
    const loadingMessage = document.getElementById('loading-message');
    const notificationArea = document.getElementById('orders-list-message');

    // --- KIỂM TRA ĐĂNG NHẬP (GUARD) ---
    if (!token) {
        alert('Vui lòng đăng nhập để xem đơn hàng.');
        window.location.href = 'login.html';
        return;
    }

    // --- HÀM GỬI THÔNG BÁO ---
    function showNotification(message, isError = false) {
        notificationArea.textContent = message;
        notificationArea.className = `alert ${isError ? 'alert-danger' : 'alert-success'} d-block`;
        setTimeout(() => { notificationArea.className = 'alert d-none'; }, 3000);
    }

    // --- XỬ LÝ HỦY ĐƠN HÀNG ---
    const handleCancel = async (orderId) => {
        if (!confirm(`Bạn có chắc chắn muốn HỦY đơn hàng #${orderId} không? Hành động này không thể hoàn tác.`)) {
            return;
        }

        try {
            const response = await fetch(`${ORDER_API_URL}${orderId}/cancel/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                showNotification(`Đơn hàng #${orderId} đã được hủy thành công.`, false);
                loadOrders(); // Tải lại danh sách
            } else {
                const errorData = await response.json();
                showNotification(errorData.detail || 'Lỗi: Không thể hủy đơn hàng.', true);
            }
        } catch (e) {
            showNotification('Lỗi kết nối server.', true);
        }
    };


    // --- TẢI DANH SÁCH ĐƠN HÀNG ---
    async function loadOrders() {
        loadingMessage.classList.remove('d-none');
        tableBody.innerHTML = '';
        
        try {
            // Backend tự động lọc đơn hàng của user này (nhờ OrderUserViewSet)
            const response = await fetch(ORDER_API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Không thể tải đơn hàng. Vui lòng đăng nhập lại.');
            
            const orders = await response.json();
            loadingMessage.classList.add('d-none');

            if (orders.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Bạn chưa có đơn hàng nào.</td></tr>';
                return;
            }

            orders.forEach(order => {
                const isPending = order.status === 'pending';
                
                // Hiển thị trạng thái đơn hàng
                const statusMap = {
                    'pending': '<span class="badge bg-warning text-dark">Chờ xác nhận</span>',
                    'delivered': '<span class="badge bg-success">Đã giao hàng</span>',
                    'cancelled': '<span class="badge bg-danger">Đã hủy</span>',
                    'shipped': '<span class="badge bg-primary">Đang vận chuyển</span>',
                };

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><strong>#${order.id}</strong></td>
                    <td>${new Date(order.order_date).toLocaleDateString('vi-VN')}</td>
                    <td>${parseFloat(order.total_amount).toLocaleString('vi-VN')} đ</td>
                    <td>${statusMap[order.status] || 'Không rõ'}</td>
                    <td>
                        ${isPending 
                            ? `<button class="btn btn-sm btn-danger cancel-btn" data-id="${order.id}">Hủy đơn</button>` 
                            : '<button class="btn btn-sm btn-secondary" disabled>—</button>'}
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Gắn sự kiện cho nút Hủy
            document.querySelectorAll('.cancel-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    handleCancel(e.target.dataset.id);
                });
            });


        } catch (e) {
            loadingMessage.classList.add('d-none');
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Lỗi kết nối server.</td></tr>';
        }
    }

    // Chạy hàm
    loadOrders();
});