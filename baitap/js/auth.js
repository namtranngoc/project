// baitap/js/auth.js

// 1. Định nghĩa API URL của backend
const API_URL = 'http://127.0.0.1:8000/api/auth/';

// 2. Tìm form đăng ký trong HTML
const registerForm = document.getElementById('register-form');
const messageEl = document.getElementById('message');

// 3. Gắn một trình lắng nghe sự kiện 'submit'
if (registerForm) {
    registerForm.addEventListener('submit', async function(event) {
        
        // 4. Ngăn form gửi đi theo cách truyền thống
        event.preventDefault(); 
        
        // 5. Lấy dữ liệu từ form
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // 6. Gửi dữ liệu lên backend Django bằng fetch
        try {
            const response = await fetch(API_URL + 'users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            // 7. Xử lý kết quả trả về
            if (response.ok) { 
                // response.ok là khi mã trạng thái là 2xx (ví dụ 201 Created)
                messageEl.textContent = 'Đăng ký thành công! Đang chuyển đến trang đăng nhập...';
                messageEl.style.color = 'green';
                
                // Tự động chuyển đến trang đăng nhập sau 2 giây
                setTimeout(() => {
                    window.location.href = 'login.html'; 
                }, 2000);

            } else {
                // Xử lý lỗi từ server (ví dụ: username đã tồn tại)
                // Djoser trả về lỗi trong object, ví dụ: { username: ["đã tồn tại"] }
                let errorMessage = '';
                for (const key in data) {
                    errorMessage += `${key}: ${data[key].join(', ')}\n`;
                }
                messageEl.textContent = 'Lỗi: ' + errorMessage;
                messageEl.style.color = 'red';
            }

        } catch (error) {
            console.error('Lỗi kết nối:', error);
            messageEl.textContent = 'Không thể kết nối đến server. Hãy đảm bảo backend đang chạy.';
            messageEl.style.color = 'red';
        }
    });
}