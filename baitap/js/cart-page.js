// js/cart-page.js

// Hàm này được gọi ngay khi trang cart.html được tải
document.addEventListener('DOMContentLoaded', () => {

    const cartTableBody = document.getElementById('cart-items-body');
    const cartSubtotalEl = document.getElementById('cart-subtotal');

    // Gọi hàm render chính
    renderCart();

    /**
     * Hàm chính: Lấy dữ liệu từ cart.js và vẽ ra HTML
     * (Hàm này phải gọi hàm getCart() và saveCart() từ file cart.js)
     */
    function renderCart() {
        // Hàm getCart() và saveCart() nằm trong file cart.js (phải được tải trước)
        const cart = getCart(); 
        
        cartTableBody.innerHTML = ''; 

        if (cart.length === 0) {
            cartTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Giỏ hàng của bạn đang trống.</td></tr>';
            cartSubtotalEl.textContent = '0 đ';
            return;
        }

        let subtotal = 0;

        cart.forEach(item => {
            const price = parseFloat(item.price);
            const qty = parseInt(item.qty);
            const itemTotal = price * qty;
            subtotal += itemTotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${item.image_url || ''}" width="50" class="me-2" alt="${item.name}">
                    ${item.name}
                </td>
                <td>${price.toLocaleString('vi-VN')} đ</td>
                <td>
                    <input 
                        type="number" 
                        value="${qty}" 
                        min="1" 
                        class="form-control form-control-sm qty-input" 
                        style="width: 70px;"
                        data-id="${item.id}"
                    >
                </td>
                <td><strong>${itemTotal.toLocaleString('vi-VN')} đ</strong></td>
                <td>
                    <button class="btn btn-danger btn-sm remove-btn" data-id="${item.id}" title="Xóa sản phẩm">
                        <i class="bi bi-trash"></i> </button>
                </td>
            `;
            cartTableBody.appendChild(row);
        });

        // Cập nhật tổng tiền
        cartSubtotalEl.textContent = `${subtotal.toLocaleString('vi-VN')} đ`;

        // Gắn sự kiện cho các nút Xóa và ô Số lượng
        attachCartEvents();
    }

    /**
     * Gắn sự kiện cho các nút Xóa và ô Số lượng
     */
    function attachCartEvents() {
        // Sự kiện cho nút Xóa
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('button').dataset.id;
                removeItemFromCart(productId);
            });
        });

        // Sự kiện khi thay đổi Số lượng
        document.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.dataset.id;
                const newQty = parseInt(e.target.value);
                updateItemQuantity(productId, newQty);
            });
        });
    }

    /**
     * Xóa 1 sản phẩm khỏi giỏ hàng
     */
    function removeItemFromCart(productId) {
        let cart = getCart();
        cart = cart.filter(item => item.id != productId); 
        saveCart(cart); // 1. Lưu lại (data thay đổi)
        renderCart(); // 2. VẼ LẠI (giao diện thay đổi)
    }

    /**
     * Cập nhật số lượng của 1 sản phẩm
     */
    function updateItemQuantity(productId, newQty) {
        if (newQty < 1) {
            removeItemFromCart(productId); // Nếu giảm về 0 thì xóa luôn
            return;
        }
        
        let cart = getCart();
        const itemToUpdate = cart.find(item => item.id == productId);
        if (itemToUpdate) {
            itemToUpdate.qty = newQty;
        }
        saveCart(cart); // 1. Lưu lại (data thay đổi)
        renderCart(); // 2. VẼ LẠI (giao diện thay đổi)
    }
});