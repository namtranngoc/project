// js/login.js (Phiên bản GỌN - Chỉ dành cho User)

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ĐỊNH NGHĨA BIẾN VÀ API ---
    const API_URL = 'https://namtranngoc.pythonanywhere.com/api/auth/';
    
    // Lấy các Form
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotForm = document.getElementById('forgotForm');

    // Lấy các link chuyển đổi
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const forgotLink = document.getElementById('forgotLink');
    const showLoginFromForgot = document.getElementById('showLoginFromForgot');

    // Lấy các thẻ <p> hiển thị thông báo
    const loginMessageEl = document.getElementById('loginMessage');
    const registerMessageEl = document.getElementById('registerMessage');
    const forgotMessageEl = document.getElementById('forgotMessage');

    // --- 2. HÀM CHUYỂN ĐỔI GIAO DIỆN (UI) ---
    function showForm(formToShow) {
        loginForm.classList.remove('active');
        registerForm.classList.remove('active');
        forgotForm.classList.remove('active');
        
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        forgotForm.style.display = 'none';

        if(loginMessageEl) loginMessageEl.textContent = '';
        if(registerMessageEl) registerMessageEl.textContent = '';
        if(forgotMessageEl) forgotMessageEl.textContent = '';

        if (formToShow === 'login') {
            loginForm.classList.add('active');
            loginForm.style.display = 'block';
        } else if (formToShow === 'register') {
            registerForm.classList.add('active');
            registerForm.style.display = 'block';
        } else if (formToShow === 'forgot') {
            forgotForm.classList.add('active');
            forgotForm.style.display = 'block';
        }
    }

    // Gắn sự kiện click cho các link
    showRegister.addEventListener('click', (e) => { e.preventDefault(); showForm('register'); });
    showLogin.addEventListener('click', (e) => { e.preventDefault(); showForm('login'); });
    forgotLink.addEventListener('click', (e) => { e.preventDefault(); showForm('forgot'); });
    showLoginFromForgot.addEventListener('click', (e) => { e.preventDefault(); showForm('login'); });

    // --- 3. LOGIC XỬ LÝ API (ĐĂNG KÝ) ---
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const name = document.getElementById('regName').value;
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        const registrationData = {
            username: username,
            email: email,
            password: password,
            first_name: name 
        };

        try {
            const response = await fetch(API_URL + 'users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData)
            });

            if (response.ok) {
                registerMessageEl.textContent = 'Đăng ký thành công! Vui lòng đăng nhập.';
                registerMessageEl.className = 'form-message success';
                setTimeout(() => showForm('login'), 500); 
            } else {
                const errors = await response.json();
                let errorMsg = 'Đăng ký thất bại: ';
                if (errors.username) {
                    errorMsg += 'Tên đăng nhập này đã được sử dụng. ';
                } else if (errors.email) {
                    errorMsg += 'Email này đã được sử dụng. ';
                } else if (errors.password) {
                    const passError = errors.password[0];
                    if (passError.includes("too similar")) {
                        errorMsg += 'Mật khẩu quá giống với thông tin tài khoản.';
                    } else if (passError.includes("too common")) {
                        errorMsg += 'Mật khẩu này quá phổ biến.';
                    } else if (passError.includes("too short")) {
                        errorMsg += 'Mật khẩu quá ngắn (cần ít nhất 8 ký tự).';
                    } else {
                        errorMsg += `Mật khẩu: ${passError}`;
                    }
                } else {
                     for (const key in errors) {
                        errorMsg += `${errors[key].join(', ')} `;
                    }
                }
                registerMessageEl.textContent = errorMsg;
                registerMessageEl.className = 'form-message error';
            }
        } catch (error) {
            registerMessageEl.textContent = 'Lỗi: Không thể kết nối đến máy chủ.';
            registerMessageEl.className = 'form-message error';
        }
    });

    // --- 4. LOGIC XỬ LÝ API (ĐĂNG NHẬP) ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const loginData = { username: username, password: password };

        try {
            // Bước 1: Lấy Token
            const response = await fetch(API_URL + 'jwt/create/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                loginMessageEl.textContent = 'Đăng nhập thất bại: Sai Tên đăng nhập hoặc Mật khẩu.';
                loginMessageEl.className = 'form-message error';
                return;
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);

            // Bước 2: Chuyển hướng (luôn luôn)
            loginMessageEl.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';
            loginMessageEl.className = 'form-message success';
            setTimeout(() => {
                window.location.href = 'index.html'; // Luôn chuyển về trang chủ
            }, 1000);

        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            loginMessageEl.textContent = 'Lỗi: Không thể kết nối đến máy chủ.';
            loginMessageEl.className = 'form-message error';
        }
    });

    // --- 5. LOGIC QUÊN MẬT KHẨU ---
    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;
        try {
            const response = await fetch(API_URL + 'users/reset_password/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });
            if (response.ok) {
                forgotMessageEl.textContent = 'Yêu cầu đã được gửi. Vui lòng kiểm tra email!';
                forgotMessageEl.className = 'form-message success';
            } else {
                forgotMessageEl.textContent = 'Có lỗi xảy ra. Vui lòng thử lại.';
                forgotMessageEl.className = 'form-message error';
            }
        } catch(error) {
            forgotMessageEl.textContent = 'Lỗi: Không thể kết nối đến máy chủ.';
            forgotMessageEl.className = 'form-message error';
        }
    });

});