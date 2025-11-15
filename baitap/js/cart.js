// js/cart.js

// Tên của key trong localStorage
const CART_KEY = 'myShopCart';

/**
 * Lấy giỏ hàng từ localStorage.
 * @returns {Array} Mảng các sản phẩm trong giỏ.
 */
function getCart() {
    const cartJSON = localStorage.getItem(CART_KEY);
    return cartJSON ? JSON.parse(cartJSON) : [];
}

/**
 * Lưu giỏ hàng vào localStorage và cập nhật icon.
 * @param {Array} cart Mảng giỏ hàng mới.
 */
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount(); // Cập nhật số lượng trên icon
}

/**
 * Thêm sản phẩm vào giỏ.
 * @param {object} product Sản phẩm đầy đủ (lấy từ allProducts).
 */
function addToCart(product) {
    let cart = getCart();
    
    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find(item => item.id == product.id);
    
    if (existingItem) {
        // Nếu có, tăng số lượng
        existingItem.qty += 1;
    } else {
        // Nếu chưa có, thêm mới với số lượng là 1
        // (Chúng ta lưu cả object product để trang cart.html dễ hiển thị)
        cart.push({ ...product, qty: 1 });
    }
    
    saveCart(cart);
}

/**
 * Cập nhật số lượng hiển thị trên icon giỏ hàng (navbar).
 */
function updateCartCount() {
    const cart = getCart();
    // Đếm tổng số lượng (qty) của tất cả các món
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0); 
    
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
    }
}

// Ngay khi file này được tải, nó sẽ cập nhật số lượng trên icon
document.addEventListener('DOMContentLoaded', updateCartCount);

// Ví dụ về hàm gửi đơn hàng (thường là hàm được gọi khi nhấn nút ĐẶT HÀNG)
async function submitOrder(orderData) {
    // ... Chuẩn bị dữ liệu và token ...
    
    try {
        const response = await fetch('https://namtranngoc.pythonanywhere.com/api/orders/', {
            method: 'POST',
            // ... (headers và body) ...
        });

        // 1. KIỂM TRA PHẢN HỒI THÀNH CÔNG TỪ DJANGO (status 200/201)
        if (response.ok) {
            
            // --- CÁC LỆNH BẮT BUỘC KHI ĐẶT HÀNG THÀNH CÔNG ---
            
            localStorage.removeItem('cartItems'); // Xóa giỏ hàng khỏi Local Storage
            
            // Nếu bạn có hàm cập nhật số lượng hàng hiển thị trên icon giỏ hàng
            if (typeof updateCartCount === 'function') {
                updateCartCount(); 
            }
            
            alert('Đặt hàng thành công! Đơn hàng của bạn sẽ được chuyển đến trang quản lý đơn.');
            
            // CHUYỂN HƯỚNG NGAY LẬP TỨC
            window.location.href = 'my-orders.html'; 
            
            // --------------------------------------------------

        } else {
            // Xử lý lỗi nếu Django báo lỗi (ví dụ: thiếu thông tin)
            const errorData = await response.json();
            alert('Đặt hàng thất bại: ' + (errorData.detail || 'Lỗi không xác định.'));
        }
    } catch (error) {
        alert('Lỗi kết nối mạng hoặc server.');
        console.error(error);
    }
}