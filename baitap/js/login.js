// js/login.js

document.addEventListener('DOMContentLoaded', () => {
    // Link Backend PythonAnywhere
    const BASE_API_URL = 'https://namtranngoc.pythonanywhere.com';
    const LOGIN_URL = `${BASE_API_URL}/api/auth/jwt/create/`;
    const USER_INFO_URL = `${BASE_API_URL}/api/auth/users/me/`;

    const loginForm = document.getElementById('loginForm');
    const loginMessageEl = document.getElementById('loginMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            // 1. Gửi yêu cầu đăng nhập để lấy Token
            try {
                const response = await fetch(LOGIN_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    // Lưu token vào LocalStorage
                    localStorage.setItem('accessToken', data.access);
                    localStorage.removeItem('refreshToken'); // Xóa refresh cũ nếu có (cho sạch)
                    if (data.refresh) {
                        localStorage.setItem('refreshToken', data.refresh);
                    }

                    loginMessageEl.textContent = 'Đăng nhập thành công! Đang kiểm tra quyền...';
                    loginMessageEl.className = 'form-message success';

                    // 2. Gọi tiếp API /users/me/ để kiểm tra xem có phải Admin không
                    checkUserRoleAndRedirect(data.access);

                } else {
                    // Xử lý lỗi đăng nhập
                    const errorData = await response.json();
                    loginMessageEl.textContent = errorData.detail || 'Sai tên đăng nhập hoặc mật khẩu.';
                    loginMessageEl.className = 'form-message error';
                }
            } catch (error) {
                console.error('Lỗi:', error);
                loginMessageEl.textContent = 'Lỗi kết nối server.';
                loginMessageEl.className = 'form-message error';
            }
        });
    }

    // Hàm kiểm tra quyền và chuyển hướng
    async function checkUserRoleAndRedirect(token) {
        try {
            const response = await fetch(USER_INFO_URL, {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`, // Dùng Bearer cho chuẩn
                    'Content-Type': 'application/json' 
                }
            });

            if (response.ok) {
                const user = await response.json();
                
                if (user.is_staff) {
                    // === NẾU LÀ ADMIN -> VÀO DASHBOARD ===
                    console.log("Admin detected. Redirecting to Dashboard.");
                    setTimeout(() => {
                        window.location.href = 'admin-dashboard.html';
                    }, 1000);
                } else {
                    // === NẾU LÀ KHÁCH -> VÀO TRANG CHỦ ===
                    console.log("User detected. Redirecting to Home.");
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                }
            } else {
                // Nếu lấy thông tin thất bại, cứ về trang chủ cho an toàn
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error("Lỗi kiểm tra quyền:", error);
            window.location.href = 'index.html';
        }
    }
});