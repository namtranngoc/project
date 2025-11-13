// js/main.js
// File này dùng để kiểm tra trạng thái đăng nhập
// trên các trang chung (index.html, cart.html, v.v.)

// 1. Định nghĩa API URL
const API_URL = 'https://namtranngoc.pythonanywhere.com/api/auth/';

// 2. Chờ cho toàn bộ HTML tải xong
document.addEventListener('DOMContentLoaded', () => {

    // 3. Tìm phần tử <li id="authButtons">
    const authButtonsContainer = document.getElementById('authButtons');
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken && authButtonsContainer) {
        // 4. NẾU ĐÃ ĐĂNG NHẬP

        // Lấy thông tin user (để hiển thị tên)
        fetch(API_URL + 'users/me/', {
            method: 'GET',
            headers: {
                // Gửi token lên để xác thực
                'Authorization': `JWT ${accessToken}` 
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                // Token có thể bị hết hạn
                throw new Error('Token không hợp lệ');
            }
        })
        .then(user => {
            // Đã lấy được thông tin user
            // Thay thế HTML của <li id="authButtons">
            authButtonsContainer.innerHTML = `
                <span class="nav-link text-dark me-2">Chào, ${user.first_name || user.username}!</span>
                <a href="#" id="logout-link" class="btn btn-outline-danger">Đăng xuất</a>
            `;
            
            // Gắn sự kiện cho nút Đăng xuất
            document.getElementById('logout-link').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                const authButtonsContainer = document.getElementById('authButtons');
                if (authButtonsContainer) {
                    authButtonsContainer.innerHTML = `
                        <span class="nav-link text-danger">Đang đăng xuất...</span>
                    `;
                }
                setTimeout(() => {
                    window.location.reload();
                }, 1000); // 1000ms = 1 giây
            });
            
        })
        
        
        .catch(error => {
            // Lỗi (ví dụ token hết hạn) -> Xóa token và hiển thị như khách
            console.error('Lỗi xác thực:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // Đảm bảo nút Đăng nhập vẫn hiển thị
            authButtonsContainer.innerHTML = `
                <a href="login.html" class="btn nav-link">Đăng nhập</a>
            `;
        });

    } else if (authButtonsContainer) {
        // 5. NẾU CHƯA ĐĂNG NHẬP (Giữ nguyên)
        authButtonsContainer.innerHTML = `
            <a href="login.html" class="btn nav-link">Đăng nhập</a>
        `;
    }
});