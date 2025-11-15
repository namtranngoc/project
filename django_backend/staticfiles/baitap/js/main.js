// js/main.js - Code chuẩn để kiểm tra đăng nhập

// Link tới Backend PythonAnywhere của bạn
const API_URL = 'https://namtranngoc.pythonanywhere.com/api/auth/';

document.addEventListener('DOMContentLoaded', () => {
    const authButtonsContainer = document.getElementById('authButtons');
    const accessToken = localStorage.getItem('accessToken');

    // Hàm hiển thị nút Đăng nhập (Dùng khi chưa login hoặc lỗi token)
    const showLoginButton = () => {
        if (authButtonsContainer) {
            authButtonsContainer.innerHTML = `
                <a href="login.html" class="btn btn-primary nav-link text-white px-3">Đăng nhập</a>
            `;
        }
    };

    // LOGIC CHÍNH
    if (accessToken && authButtonsContainer) {
        // 1. Nếu có token trong máy, gọi API để kiểm tra xem token còn sống không
        fetch(API_URL + 'users/me/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Đã sửa thành Bearer cho chuẩn
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                // Nếu server trả về lỗi (401 Unauthorized), nghĩa là token hết hạn
                throw new Error('Token hết hạn');
            }
        })
        .then(user => {
            // 2. ĐĂNG NHẬP THÀNH CÔNG -> Hiển thị tên và nút Đăng xuất
            console.log("Đăng nhập thành công:", user);

            authButtonsContainer.innerHTML = `
                <div class="d-flex align-items-center gap-2">
                    <span class="nav-link text-dark fw-bold">Hi, ${user.first_name || user.username}</span>
                    <button id="logout-link" class="btn btn-outline-danger btn-sm">Đăng xuất</button>
                </div>
            `;
            
            // Gắn sự kiện cho nút Đăng xuất vừa tạo
            document.getElementById('logout-link').addEventListener('click', (e) => {
                e.preventDefault();
                // Xóa token
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                
                // Reload trang
                window.location.reload();
            });
        })
        .catch(error => {
            // 3. LỖI (Token đểu hoặc hết hạn) -> Xóa token và hiện nút Đăng nhập
            console.error('Lỗi xác thực:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            showLoginButton();
        });

    } else {
        // 4. KHÁCH VÃNG LAI (Chưa có token) -> Hiện nút Đăng nhập
        showLoginButton();
    }
});