// js/main.js (Code chuẩn - Tải SP từ API & Kiểm tra Auth)

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CẤU HÌNH API (Trỏ về PythonAnywhere) ---
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

    let allProducts = []; // Biến lưu sản phẩm gốc

    // --- 3. LOGIC HIỂN THỊ SẢN PHẨM ---
    function render(items) {
        if (!grid) return;
        if (items.length === 0) {
            grid.innerHTML = '<p class="text-center">Không tìm thấy sản phẩm nào.</p>';
            return;
        }

        grid.innerHTML = items.map(p => {
            const priceFmt = parseFloat(p.price).toLocaleString('vi-VN');
            // Lấy link ảnh từ model (image_url)
            const imageUrl = p.image_url || 'https://via.placeholder.com/400x300.png?text=No+Image';

            return `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
              <article class="card h-100 border-secondary">
                <a class="ratio ratio-4x3" href="#"> <img src="${imageUrl}" alt="${p.name}" class="card-img-top object-fit-cover rounded-top">
                </a>
                <div class="card-body d-flex flex-column">
                  <h3 class="h6 flex-grow-1"><a class="link-dark text-decoration-none" href="#">${p.name}</a></h3>
                  <p class="fw-bold mb-2">${priceFmt} đ</p>
                  <button type="button" class="btn btn-primary w-100 add" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>Thêm vào giỏ</button>
                </div>
              </article>
            </div>
          `;
        }).join('');

        // Gắn sự kiện "Thêm vào giỏ"
        grid.querySelectorAll('button.add').forEach(btn => {
            btn.addEventListener('click', () => {
                alert('Đã thêm vào giỏ! (Tạm thời) - ID: ' + btn.dataset.id);
                // (Sau này bạn sẽ tích hợp lại file cart.js của bạn ở đây)
            });
        });
    }

    // --- 4. LOGIC TẢI SẢN PHẨM TỪ API ---
    async function loadProducts() {
        if (!grid) return;
        grid.innerHTML = '<p class="text-center">Đang tải sản phẩm...</p>';
        try {
            // GỌI API SẢN PHẨM (Không cần token vì đã AllowAny)
            const response = await fetch(PRODUCT_API_URL); 
            if (!response.ok) {
                throw new Error('Không thể tải sản phẩm. Server có thể đang lỗi.');
            }
            const data = await response.json();
            allProducts = data;
            render(allProducts);
        } catch (error) {
            console.error(error);
            grid.innerHTML = `<p class="text-center text-danger">${error.message}</p>`;
        }
    }

    // --- 5. LOGIC LỌC/SẮP XẾP ---
    function updateView() {
        if (!search || !sort) return;
        
        const searchTerm = search.value.toLowerCase();
        const sortValue = sort.value;

        let items = allProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm)
        );

        if (sortValue === 'price-asc') items.sort((a, b) => a.price - b.price);
        else if (sortValue === 'price-desc') items.sort((a, b) => b.price - a.price);
        else if (sortValue === 'name-asc') items.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortValue === 'name-desc') items.sort((a, b) => b.name.localeCompare(a.name));
        
        render(items);
    }
    
    if (search) search.addEventListener('input', updateView);
    if (sort) sort.addEventListener('change', updateView);

    // --- 6. LOGIC KIỂM TRA ĐĂNG NHẬP (AUTH) ---
    async function checkAuth() {
        const accessToken = localStorage.getItem('accessToken');
        
        const showLoginButton = () => {
            if (authButtonsContainer) {
                authButtonsContainer.innerHTML = `
                    <a href="login.html" class="btn btn-primary nav-link text-white px-3">Đăng nhập</a>
                `;
            }
        };

        if (!accessToken) {
            showLoginButton();
            return;
        }

        try {
            const res = await fetch(AUTH_API_URL + 'users/me/', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (!res.ok) throw new Error('Token hết hạn');
            
            const user = await res.json();
            
            if (authButtonsContainer) {
                authButtonsContainer.innerHTML = `
                    <span class="nav-link text-dark fw-bold me-2">Chào, ${user.first_name || user.username}</span>
                    <a href="#" id="logout-link" class="nav-link text-danger">Đăng xuất</a>
                `;
                document.getElementById('logout-link').addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.reload();
                });
            }
        } catch (error) {
            console.error(error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            showLoginButton();
        }
    }

    // --- 7. CHẠY CÁC HÀM KHỞI ĐỘNG ---
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    // initCartCount(); // Bạn cần import hàm này từ cart.js nếu muốn dùng
    
    loadProducts(); // Tải sản phẩm từ API
    checkAuth(); // Kiểm tra đăng nhập
});