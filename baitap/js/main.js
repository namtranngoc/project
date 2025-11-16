// js/main.js (Đã thêm hiệu ứng "Bay vào giỏ")

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CẤU HÌNH API ---
    const API_BASE = 'https://namtranngoc.pythonanywhere.com';
    const PRODUCT_API_URL = `${API_BASE}/api/products/`;
    const AUTH_API_URL = `${API_BASE}/api/auth/`;

    // --- 2. LẤY CÁC ELEMENT ---
    const grid = document.getElementById('product-grid');
    const search = document.getElementById('search');
    const sort = document.getElementById('sort');
    const authButtonsContainer = document.getElementById('authButtons');
    const cartCountEl = document.getElementById('cart-count'); 
    const yearEl = document.getElementById('year');

    let allProducts = []; 

    // --- 3. LOGIC HIỂN THỊ SẢN PHẨM (ĐÃ SỬA NÚT BẤM) ---
    function render(items) {
        if (!grid) return;
        // ... (code kiểm tra items.length = 0 giữ nguyên) ...

        grid.innerHTML = items.map(p => {
            const priceFmt = parseFloat(p.price).toLocaleString('vi-VN');
            const imageUrl = p.image_url || 'https://via.placeholder.com/400x300.png?text=No+Image';

            return `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
              <article class="card h-100 border-secondary">
                <a class.Error" href="product.html?id=${p.id}">
                  <img src="${imageUrl}" alt="${p.name}" class="card-img-top object-fit-cover rounded-top product-image"> </a>
                <div class="card-body d-flex flex-column">
                  <h3 class="h6 flex-grow-1"><a class="link-dark text-decoration-none" href="product.html?id=${p.id}">${p.name}</a></h3>
                  <p class="fw-bold mb-2">${priceFmt} đ</p>
                  <button type="button" class="btn btn-primary w-100 add" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>Thêm vào giỏ</button>
                </div>
              </article>
            </div>
          `;
        }).join('');

        // Gắn sự kiện "Thêm vào giỏ"
        grid.querySelectorAll('button.add').forEach(btn => {
            btn.addEventListener('click', (e) => { // 'e' là sự kiện click

                // --- BƯỚC KIỂM TRA ĐĂNG NHẬP ---
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    // Nếu chưa đăng nhập, đá về trang login
                    window.location.href = 'login.html';
                    return; // Dừng lại, không thêm vào giỏ
                }

                const productId = btn.dataset.id;
                const productToAdd = allProducts.find(p => p.id == productId); 
                
                if (productToAdd) {
                    // 1. Gọi hàm từ cart.js
                    addToCart(productToAdd); 
                    // 2. GỌI HÀM ANIMATION
                    flyToCart(e.target); 
                }
            });
        });
    }

    // --- 4. HÀM ANIMATION MỚI ---
    function flyToCart(button) {
        // Lấy ảnh gốc của sản phẩm
        const originalImage = button.closest('.card').querySelector('.product-image');
        // Lấy icon giỏ hàng
        const cartIcon = document.getElementById('cart-count');

        if (!originalImage || !cartIcon) return;

        // Lấy vị trí của ảnh gốc và giỏ hàng
        const originalImageRect = originalImage.getBoundingClientRect();
        const cartIconRect = cartIcon.getBoundingClientRect();

        // 1. Tạo bản sao (clone) của cái ảnh
        const clone = originalImage.cloneNode(true);
        clone.classList.add('fly-to-cart-clone'); // Gắn class CSS đã tạo
        
        // 2. Set vị trí ban đầu cho ảnh clone (ngay trên ảnh gốc)
        clone.style.left = `${originalImageRect.left}px`;
        clone.style.top = `${originalImageRect.top}px`;
        clone.style.width = `${originalImageRect.width}px`;
        clone.style.height = `${originalImageRect.height}px`;

        // 3. Thêm ảnh clone vào body
        document.body.appendChild(clone);

        // 4. Bắt đầu bay (Dùng trick requestAnimationFrame)
        // Trick này để đảm bảo trình duyệt kịp "vẽ" ảnh clone ở vị trí cũ trước khi bay
        requestAnimationFrame(() => {
            // Set vị trí cuối cùng (bay về giữa icon giỏ hàng)
            clone.style.left = `${cartIconRect.left + cartIconRect.width / 2}px`;
            clone.style.top = `${cartIconRect.top + cartIconRect.height / 2}px`;
            clone.style.transform = 'scale(0.1)'; // Thu nhỏ lại
            clone.style.opacity = '0.5'; // Mờ đi
        });

        // 5. Dọn dẹp
        clone.addEventListener('transitionend', () => {
            clone.remove(); // Xóa ảnh clone khi bay xong
            
            // Làm cho icon giỏ hàng "rung" lên
            cartIcon.classList.add('cart-shake');
            setTimeout(() => {
                cartIcon.classList.remove('cart-shake');
            }, 300); // Xóa class rung sau 0.3s
        });
    }

    // --- 5. LOGIC TẢI SẢN PHẨM (Giữ nguyên) ---
    async function loadProducts() {
        // ... (Giữ nguyên code loadProducts của bạn)
        if (!grid) return;
        grid.innerHTML = '<p class="text-center">Đang tải sản phẩm...</p>';
        try {
            const response = await fetch(PRODUCT_API_URL); 
            if (!response.ok) throw new Error('Không thể tải sản phẩm. Server lỗi.');
            const data = await response.json();
            allProducts = data;
            render(allProducts);
        } catch (error) {
            grid.innerHTML = `<p class="text-center text-danger">${error.message}</p>`;
        }
    }

    // --- 6. LOGIC LỌC/SẮP XẾP (Giữ nguyên) ---
    function updateView() {
        // ... (Giữ nguyên code updateView của bạn)
        if (!search || !sort) return;
        const searchTerm = search.value.toLowerCase();
        const sortValue = sort.value;
        let items = allProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
        if (sortValue === 'price-asc') items.sort((a, b) => a.price - b.price);
        else if (sortValue === 'price-desc') items.sort((a, b) => b.price - a.price);
        else if (sortValue === 'name-asc') items.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortValue === 'name-desc') items.sort((a, b) => b.name.localeCompare(a.name));
        render(items);
    }
    
    if (search) search.addEventListener('input', updateView);
    if (sort) sort.addEventListener('change', updateView);

    // --- 7. LOGIC KIỂM TRA ĐĂNG NHẬP (Giữ nguyên) ---
    async function checkAuth() {
        // ... (Giữ nguyên code checkAuth của bạn)
        const accessToken = localStorage.getItem('accessToken');
        const showLoginButton = () => {
            if (authButtonsContainer) {
                authButtonsContainer.innerHTML = `<a href="login.html" class="btn btn-primary nav-link text-white px-3">Đăng nhập</a>`;
            }
        };
        if (!accessToken) { showLoginButton(); return; }
        try {
            const res = await fetch(AUTH_API_URL + 'users/me/', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (!res.ok) throw new Error('Token hết hạn');
            const user = await res.json();
           // ...
            if (authButtonsContainer) {
                authButtonsContainer.innerHTML = `
                    <span class="nav-link text-dark fw-bold">Chào, ${user.first_name || user.username}</span>
                    <a href="#" id="logout-link" class="nav-link text-danger">(Đăng xuất)</a>
                `;
                
                // Gắn sự kiện cho nút Đăng xuất
                document.getElementById('logout-link').addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.reload();
                });
            }
        } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            showLoginButton();
        }
    }

    // --- 8. CHẠY CÁC HÀM KHỞI ĐỘNG ---
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    
    loadProducts(); // Tải sản phẩm từ API
    checkAuth(); // Kiểm tra đăng nhập
});