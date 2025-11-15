// js/product-detail.js (Đã thêm hiệu ứng Bay vào giỏ)

document.addEventListener('DOMContentLoaded', () => {
    
    // API Backend
    const API_BASE = 'https://namtranngoc.pythonanywhere.com';
    const PRODUCT_API_URL = `${API_BASE}/api/products/`;

    const container = document.getElementById('product-detail-container');
    let currentProduct = null; // Biến lưu sản phẩm đang xem

    // Hàm để lấy ID sản phẩm từ URL (ví dụ: ?id=1)
    function getProductId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    // === HÀM ANIMATION (Copy từ main.js) ===
    function flyToCart(button) {
        // Lấy ảnh gốc (lần này ta tìm bằng ID)
        const originalImage = document.getElementById('product-detail-image');
        const cartIcon = document.getElementById('cart-count');

        if (!originalImage || !cartIcon) return;

        const originalImageRect = originalImage.getBoundingClientRect();
        const cartIconRect = cartIcon.getBoundingClientRect();

        const clone = originalImage.cloneNode(true);
        clone.classList.add('fly-to-cart-clone'); 
        
        clone.style.left = `${originalImageRect.left}px`;
        clone.style.top = `${originalImageRect.top}px`;
        clone.style.width = `${originalImageRect.width}px`;
        clone.style.height = `${originalImageRect.height}px`;

        document.body.appendChild(clone);

        requestAnimationFrame(() => {
            clone.style.left = `${cartIconRect.left + cartIconRect.width / 2}px`;
            clone.style.top = `${cartIconRect.top + cartIconRect.height / 2}px`;
            clone.style.transform = 'scale(0.1)';
            clone.style.opacity = '0.5';
        });

        clone.addEventListener('transitionend', () => {
            clone.remove();
            cartIcon.classList.add('cart-shake');
            setTimeout(() => {
                cartIcon.classList.remove('cart-shake');
            }, 300);
        });
    }

    // === HÀM TẢI DỮ LIỆU (ĐÃ SỬA NÚT BẤM) ===
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
            currentProduct = p; // Lưu sản phẩm vào biến
            
            // Render HTML
            const priceFmt = parseFloat(p.price).toLocaleString('vi-VN');
            const imageUrl = p.image_url || 'https://via.placeholder.com/600x400.png?text=No+Image';

            container.innerHTML = `
                <div class="col-md-6">
                    <img src="${imageUrl}" alt="${p.name}" class="img-fluid rounded" id="product-detail-image">
                </div>
                <div class="col-md-6">
                    <h2>${p.name}</h2>
                    <h3 class="text-danger fw-bold">${priceFmt} đ</h3>
                    <p>Tình trạng kho: <strong>${p.stock > 0 ? p.stock : 'Hết hàng'}</strong></p>
                    <hr>
                    <p>${p.description || 'Sản phẩm chưa có mô tả.'}</p>
                    
                    <div class="d-grid gap-2">
                         <button type="button" class="btn btn-primary btn-lg add-to-cart" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
                            Thêm vào giỏ hàng
                         </button>
                    </div>
                </div>
            `;
            // Gắn sự kiện cho nút Thêm vào giỏ
             container.querySelector('.add-to-cart').addEventListener('click', (e) => {
                
                // --- BƯỚC KIỂM TRA ĐĂNG NHẬP ---
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    // Nếu chưa đăng nhập, đá về trang login
                    window.location.href = 'login.html';
                    return; // Dừng lại, không thêm vào giỏ
                }
                // ---------------------------------

                 // Gọi hàm từ cart.js
                 if (currentProduct) {
                     addToCart(currentProduct);
                     // Gọi hàm animation
                     flyToCart(e.target);
                 }
             });

        } catch (error) {
            container.innerHTML = `<p class="text-center text-danger">${error.message}</p>`;
        }
    }

    // Chạy hàm
    loadProductDetail();
});