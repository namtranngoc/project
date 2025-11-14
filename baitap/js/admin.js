document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');
    const messageEl = document.getElementById('adminMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);

        try {
            const res = await fetch('/api/admin-login/', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                messageEl.textContent = data.message;
                messageEl.style.color = 'green';
                setTimeout(() => {
                    window.location.href = 'admin-products.html';  // redirect
                }, 500);
            } else {
                messageEl.textContent = data.message;
                messageEl.style.color = 'red';
            }
        } catch (err) {
            messageEl.textContent = 'Lỗi server!';
            messageEl.style.color = 'red';
        }
    });
});
