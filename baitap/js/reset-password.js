// js/reset-password.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Định nghĩa API
    const API_URL = 'https://namtranngoc.pythonanywhere.com/api/auth/';
    
    // 2. Lấy các phần tử
    const resetForm = document.getElementById('reset-form');
    const newPasswordEl = document.getElementById('new_password');
    const confirmPasswordEl = document.getElementById('confirm_password');
    const messageEl = document.getElementById('resetMessage');

    // 3. Lấy uid và token từ URL (Phần quan trọng nhất)
    // URL sẽ có dạng: ...html?uid=NQ&token=c9u-a9b...
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');
    const token = urlParams.get('token');

    // 4. Gắn sự kiện submit
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = newPasswordEl.value;
        const confirmPassword = confirmPasswordEl.value;

        // 5. Kiểm tra mật khẩu có khớp không
        if (newPassword !== confirmPassword) {
            messageEl.textContent = 'Mật khẩu không khớp. Vui lòng nhập lại.';
            messageEl.className = 'form-message error';
            return;
        }

        // 6. Gửi dữ liệu lên backend
        const dataToSend = {
            uid: uid,
            token: token,
            new_password: newPassword
        };

        try {
            const response = await fetch(API_URL + 'users/reset_password_confirm/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                // Thành công!
                messageEl.textContent = 'Đổi mật khẩu thành công! Đang chuyển về trang đăng nhập...';
                messageEl.className = 'form-message success';
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000); // Chờ 1 giây

            } else {
                // Thất bại
                const errorData = await response.json();
                let errorMsg = 'Lỗi: ';
                if (errorData.token) {
                    errorMsg += 'Link này đã hết hạn hoặc không hợp lệ.';
                } else if (errorData.new_password) {
                    errorMsg += 'Mật khẩu mới không hợp lệ (có thể quá ngắn hoặc quá phổ biến).';
                } else {
                    errorMsg += 'Không thể đặt lại mật khẩu.';
                }
                messageEl.textContent = errorMsg;
                messageEl.className = 'form-message error';
            }
        } catch (error) {
            messageEl.textContent = 'Lỗi kết nối máy chủ.';
            messageEl.className = 'form-message error';
        }
    });
});