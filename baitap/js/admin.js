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

        try {
            // 1. Lấy Token
            const res = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) throw new Error('Sai tên đăng nhập hoặc mật khẩu');
            const data = await res.json();
            const token = data.access;

            // 2. Kiểm tra quyền Admin ngay lập tức
            const userRes = await fetch(USER_INFO_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const user = await userRes.json();

            if (user.is_staff) {
                // ĐÚNG LÀ ADMIN -> Lưu token và vào Dashboard
                localStorage.setItem('accessToken', token);
                if (data.refresh) localStorage.setItem('refreshToken', data.refresh);
                
                messageEl.textContent = 'Đăng nhập thành công!';
                messageEl.className = 'text-center text-success small';
                window.location.href = 'admin-dashboard.html';
            } else {
                // LÀ USER THƯỜNG -> CHẶN
                messageEl.textContent = 'Tài khoản này không có quyền truy cập Admin!';
                messageEl.className = 'text-center text-danger small';
            }

        } catch (error) {
            console.error(error);
            messageEl.textContent = error.message || 'Lỗi kết nối server.';
            messageEl.className = 'text-center text-danger small';
        }
    });
});