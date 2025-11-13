// js/admin-login.js

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://namtranngoc.pythonanywhere.com';
    const LOGIN_URL = `${API_URL}/api/auth/jwt/create/`;
    const USER_INFO_URL = `${API_URL}/api/auth/users/me/`;

    const loginForm = document.getElementById('adminLoginForm');
    const messageEl = document.getElementById('adminMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        messageEl.textContent = 'Đang xác thực...';

            if (username=='namtranngoc') {
                // ĐÚNG LÀ ADMIN -> Lưu token và vào Dashboard
                   setTimeout(() => {
                        window.location.href = 'admin-products.html';
                    }, 1000);
                
                messageEl.textContent = 'Đăng nhập thành công!';
                messageEl.className = 'text-center text-success small';
            } else {
                // LÀ USER THƯỜNG -> CHẶN
                messageEl.textContent = 'Tài khoản này không có quyền truy cập Admin!';
                messageEl.className = 'text-center text-danger small';
            }

    
    });
});