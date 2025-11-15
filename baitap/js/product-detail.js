// js/product-detail.js

document.addEventListener('DOMContentLoaded', () => {
    
    // API Backend (Phải giống hệt các file JS khác)
    const API_BASE = 'https://namtranngoc.pythonanywhere.com';
    const PRODUCT_API_URL = `${API_BASE}/api/products/`;

    const container = document.getElementById('product-detail-container');

    // Hàm để lấy ID sản phẩm từ URL (ví dụ: ?id=1)
    function getProductId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    // Hàm tải dữ liệu chi tiết
    async function loadProductDetail() {
        const productId = getProductId();
        if (!productId) {
            container.innerHTML = '<p class="text-center text-danger">Không tìm thấy ID sản phẩm.</p>';
            return;
        }

        try {
            // Gọi API (Ví dụ: /api/products/1/)
            const response = await fetch(PRODUCT_API_URL + `${productId}/`); 
            if (!response.ok) {
                throw new Error('Không tìm thấy sản phẩm hoặc server lỗi.');
            }
            const p = await response.json();
            
            // Render HTML
            const priceFmt = parseFloat(p.price).toLocaleString('vi-VN');
            const imageUrl = p.image_url || 'https://via.placeholder.com/600x400.png?text=No+Image';

            container.innerHTML = `
                <div class="col-md-6">
                    <img src="${imageUrl}" alt="${p.name}" class="img-fluid rounded">
                </div>
                <div class="col-md-6">
                    <h2>${p.name}</h2>
                    <h3 class="text-danger fw-bold">${priceFmt} đ</h3>
                    <p>Tình trạng kho: <strong>${p.stock > 0 ? p.stock : 'Hết hàng'}</strong></p>
                    <hr>
                    <p>Mô tả (Tạm thời): Đây là sản phẩm áo đấu chính thức của CLB Real Madrid, mùa giải 2024-2025...</p>
                    
                    <div class="d-grid gap-2">
                         <button type="button" class="btn btn-primary btn-lg add-to-cart" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
                            Thêm vào giỏ hàng
                         </button>
                    </div>
                </div>
            `;
            
            // Gắn sự kiện cho nút Thêm vào giỏ
             container.querySelector('.add-to-cart').addEventListener('click', (e) => {
                 alert('Đã thêm vào giỏ! (Tạm thời) - ID: ' + e.target.dataset.id);
             });

        } catch (error) {
            container.innerHTML = `<p class="text-center text-danger">${error.message}</p>`;
        }
    }

    // Chạy hàm
    loadProductDetail();
});