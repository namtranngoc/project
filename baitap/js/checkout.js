// js/checkout.js

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'https://namtranngoc.pythonanywhere.com';
    const ORDER_API_URL = `${API_BASE}/api/orders/`;

    // Các khu vực cần thao tác
    const formSection = document.getElementById('checkout-form-section');
    const confirmationSection = document.getElementById('order-confirmation-section');
    const orderSummaryList = document.getElementById('order-summary-list');
    const summarySubtotalEl = document.getElementById('summary-subtotal');
    const checkoutForm = document.getElementById('checkout-form');
    const errorMessageEl = document.getElementById('error-message');
    const placeOrderBtn = document.getElementById('place-order-btn');

    let cartData = getCart(); // Lấy giỏ hàng từ cart.js
    let totalAmount = 0;

    // --- 1. KIỂM TRA ĐĂNG NHẬP VÀ HIỂN THỊ GIỎ HÀNG ---
    if (!localStorage.getItem('accessToken')) {
        // Nếu chưa đăng nhập, chuyển về trang login
        alert('Vui lòng đăng nhập để tiến hành thanh toán.');
        window.location.href = 'login.html';
        return;
    }

    if (cartData.length === 0) {
        // Nếu giỏ hàng trống, không cho thanh toán
        document.getElementById('checkout-main-content').innerHTML = `
            <div class="alert alert-warning text-center">
                Giỏ hàng của bạn đang trống. Vui lòng quay lại <a href="index.html">Trang chủ</a> để mua sắm.
            </div>
        `;
        return;
    }

    function renderOrderSummary() {
        orderSummaryList.innerHTML = '';
        totalAmount = 0;

        cartData.forEach(item => {
            const price = parseFloat(item.price);
            const itemTotal = price * item.qty;
            totalAmount += itemTotal;

            const div = document.createElement('div');
            div.className = 'd-flex justify-content-between small';
            div.innerHTML = `
                <span>${item.name} x ${item.qty}</span>
                <span>${itemTotal.toLocaleString('vi-VN')} đ</span>
            `;
            orderSummaryList.appendChild(div);
        });

        summarySubtotalEl.textContent = `${totalAmount.toLocaleString('vi-VN')} đ`;
    }

    // --- 2. XỬ LÝ SỰ KIỆN ĐẶT HÀNG ---
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Ẩn thông báo lỗi cũ
        errorMessageEl.classList.add('d-none');
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'Đang xử lý...';

        const address = document.getElementById('shippingAddress').value.trim();
        const phone = document.getElementById('phoneNumber').value.trim();
        const notes = document.getElementById('notes').value.trim();
        const token = localStorage.getItem('accessToken');

        if (!token) {
            alert('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
            window.location.href = 'login.html';
            return;
        }

        // Tạo payload (body) gửi lên API
        const payload = {
            total_amount: totalAmount,
            shipping_address: address,
            phone_number: phone,
            notes: notes, // Tuy backend chưa dùng, nhưng gửi lên để dễ mở rộng
            // Lưu lại "ảnh chụp" giỏ hàng (rất quan trọng)
            cart_snapshot: cartData 
        };

        try {
            const response = await fetch(ORDER_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // Xử lý lỗi từ server (Ví dụ: token hết hạn, dữ liệu sai)
                const errorData = await response.json();
                let errorMsg = 'Lỗi đặt hàng không xác định.';
                if (errorData.detail) errorMsg = errorData.detail; // Lỗi chung
                else if (errorData.phone_number) errorMsg = 'Lỗi: Số điện thoại không hợp lệ.';
                else if (errorData.shipping_address) errorMsg = 'Lỗi: Địa chỉ không hợp lệ.';

                errorMessageEl.textContent = errorMsg;
                errorMessageEl.classList.remove('d-none');
                
                throw new Error(errorMsg);
            }

            const order = await response.json();
            
            // --- 3. ĐẶT HÀNG THÀNH CÔNG ---
            displayOrderConfirmation(order);
            clearCart(); // Xóa giỏ hàng local

        } catch (error) {
            console.error('Lỗi đặt hàng:', error);
            // Re-enable button on failure
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Xác nhận và Đặt hàng';

        }
    });
    
    // --- 4. HIỂN THỊ ĐƠN HÀNG SAU KHI ĐẶT THÀNH CÔNG ---
    function displayOrderConfirmation(order) {
        // Ẩn form nhập
        formSection.classList.add('d-none');
        confirmationSection.classList.remove('d-none');
        
        let itemsHtml = order.cart_snapshot.map(item => {
            const itemTotal = parseFloat(item.price) * item.qty;
            return `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>${item.name} <span class="badge bg-secondary rounded-pill">x${item.qty}</span></div>
                    <span class="fw-bold">${itemTotal.toLocaleString('vi-VN')} đ</span>
                </li>
            `;
        }).join('');

        const statusMap = {
            'pending': '<span class="badge bg-warning text-dark">Chờ xác nhận</span>',
            'shipped': '<span class="badge bg-info">Đã vận chuyển</span>',
            'delivered': '<span class="badge bg-success">Đã giao hàng</span>',
            'cancelled': '<span class="badge bg-danger">Đã hủy</span>'
        };

        confirmationSection.innerHTML = `
            <div class="alert alert-success text-center">
                <h4 class="alert-heading"><i class="bi bi-check-circle-fill"></i> Đặt hàng thành công!</h4>
                <p>Cảm ơn bạn đã tin tưởng và đặt hàng. Chi tiết đơn hàng đã được gửi đến email của bạn.</p>
                <hr>
                <p class="mb-0"><strong>Mã đơn hàng:</strong> 
                    <span class="text-primary fw-bold">#${order.id}</span>
                </p>
                <p><strong>Trạng thái:</strong> ${statusMap[order.status]}</p>
            </div>

            <div class="row mt-4">
                <div class="col-md-6">
                    <h5 class="mb-3">Thông tin nhận hàng</h5>
                    <ul class="list-group">
                        <li class="list-group-item"><strong>Địa chỉ:</strong> ${order.shipping_address}</li>
                        <li class="list-group-item"><strong>SĐT:</strong> ${order.phone_number}</li>
                        <li class="list-group-item"><strong>Ngày đặt:</strong> ${new Date(order.order_date).toLocaleString('vi-VN')}</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h5 class="mb-3">Chi tiết sản phẩm</h5>
                    <ul class="list-group">${itemsHtml}</ul>
                    <div class="card card-body bg-light mt-3">
                        <div class="d-flex justify-content-between fw-bold">
                            <span>Tổng thanh toán:</span>
                            <span class="text-danger">${parseFloat(order.total_amount).toLocaleString('vi-VN')} đ</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-5">
                <a href="index.html" class="btn btn-primary me-2">Tiếp tục mua sắm</a>
                <a href="my-orders.html" class="btn btn-secondary"">Xem Đơn Hàng</a>
            </div>
        `;
    }

    renderOrderSummary(); // Lần đầu tải trang, hiển thị tóm tắt đơn hàng
});
