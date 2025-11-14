document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');
    const messageEl = document.getElementById('adminMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        messageEl.textContent = 'Đang xác thực...';
        messageEl.className = 'text-center text-info small';

        const formData = new FormData(loginForm);

        try {
            const res = await fetch('/api/admin-login/', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                messageEl.textContent = data.message;
                messageEl.className = 'text-center text-success small';
                setTimeout(() => {
                    window.location.href = 'admin-products.html';
                }, 500);
            } else {
                messageEl.textContent = data.message;
                messageEl.className = 'text-center text-danger small';
            }
        } catch (err) {
            messageEl.textContent = 'Lỗi server!';
            messageEl.className = 'text-center text-danger small';
        }
    });
});
