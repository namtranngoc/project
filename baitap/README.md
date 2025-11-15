# FE Shop – Dự án cuối khóa (Bài 1–13)
Website bán hàng thuần Front-end, xây tuần tự theo giáo trình: HTML → CSS → JS → ES6 → Bootstrap.

## Chạy thử
1. Tải về thư mục dự án và mở `index.html` trực tiếp trên trình duyệt **hoặc** dùng một HTTP server tĩnh (vd: `npx serve`).
2. Không cần backend. Dữ liệu giỏ hàng lưu trong `localStorage`.

## Cấu trúc
```
fe-ecommerce-lesson1-13/
├── index.html          # Trang chủ + lưới sản phẩm
├── product.html        # Trang chi tiết (query: ?id=)
├── cart.html           # Giỏ hàng
├── checkout.html       # Form thanh toán (demo)
├── styles.css          # CSS thuần (sẽ tối ưu responsive ở Bài 6)
├── js/
│   ├── utils.js        # formatCurrency, filter/sort, helpers
│   └── cart.js         # Cart localStorage
├── data/
│   └── products.js     # Mock data
└── assets/
    └── img/            # Ảnh minh họa
```

> Ảnh minh họa bạn có thể tự thêm hoặc thay bằng URL ảnh public.

---

## Roadmap theo bài học + Lab
**Bài 1: Giới thiệu**
- Mục tiêu: Nắm tổng quan web FE, cấu trúc dự án.
- Lab: Tạo thư mục dự án, thêm `index.html` với skeleton HTML5, header/nav/footer tối giản.

**Bài 2: HTML**
- Mục tiêu: Thẻ sematic (`header`, `nav`, `main`, `section`, `article`, `footer`), liên kết trang.
- Lab: Hoàn thiện cấu trúc 4 trang (`index.html`, `product.html`, `cart.html`, `checkout.html`), dùng thẻ sematic, thêm placeholder nội dung.

**Bài 3: CSS**
- Mục tiêu: Áp dụng CSS cơ bản: màu sắc, font, spacing, border, button.
- Lab: Viết `styles.css` cho header, nav, card, table, form. Hoàn thiện hero + card sản phẩm (không cần JS).

**Bài 4: Box model & Position**
- Mục tiêu: Margin/Padding/Border, `position: sticky` cho header, card layout.
- Lab: Biến header thành sticky, tinh chỉnh card (padding, radius, border).

**Bài 5: Layout**
- Mục tiêu: Flexbox/Grid để dựng lưới sản phẩm + layout 2 cột trang chi tiết.
- Lab: Lưới sản phẩm `grid-template-columns`, trang detail 2 cột (ảnh | thông tin).

**Bài 6: Responsiveness**
- Mục tiêu: Media queries, responsive images, mobile-first.
- Lab: Thêm breakpoints (≤880px) đổi layout 1 cột cho detail, toolbar xếp dọc, form 1 cột.

**Bài 7: JavaScript Basic**
- Mục tiêu: Biến, kiểu dữ liệu, toán tử, string template.
- Lab: Tạo `js/utils.js`, viết `formatCurrency`, gắn năm hiện tại vào footer qua JS.

**Bài 8: Flow Control**
- Mục tiêu: `if/else`, `switch`, `for`, `forEach`.
- Lab: Thêm ô `search`, `select sort`, viết hàm `getFilteredSorted` với `switch` chọn tiêu chí sắp xếp.

**Bài 9: Array & Object**
- Mục tiêu: Mảng, object, `map/filter/reduce`, dữ liệu sản phẩm.
- Lab: Tạo `data/products.js`, render lưới sản phẩm từ dữ liệu, áp dụng `map()` để tạo HTML.

**Bài 10: Function**
- Mục tiêu: Viết và tái sử dụng hàm.
- Lab: Tách `render()` riêng, `loadProducts()` trang chủ, viết `formatCurrency()` tái sử dụng.

**Bài 11: DOM, Events & Browser**
- Mục tiêu: `querySelector`, sự kiện `click/change/submit`, `localStorage`.
- Lab: Viết `js/cart.js`: thêm, cập nhật, xoá sản phẩm trong giỏ; cập nhật badge giỏ trên header.

**Bài 12: ES6**
- Mục tiêu: Module `import/export`, template literals, destructuring, spread.
- Lab: Chuyển toàn bộ JS sang `type="module"`, tách file theo module, dùng spread khi trang trí dữ liệu.

**Bài 13: Bootstrap**
- Mục tiêu: Nhúng Bootstrap để chuẩn hoá UI nhanh.
- Lab: Bổ sung một nhánh (không bắt buộc) dùng Bootstrap 5 (CDN) để tạo variant UI:
  - Thay `.btn` bằng `.btn.btn-primary`, form `.form-control`, table `.table`.
  - Lưu ý: vẫn giữ version CSS thuần để so sánh.
  - **Thử thách**: Dùng Grid system của Bootstrap để refactor layout.

> Sau Bài 13, website đã có: danh sách sản phẩm, chi tiết, giỏ hàng, form thanh toán (demo), tìm kiếm + sort, responsive đầy đủ.

### Bài tập nâng cao (tùy chọn)
- Thêm bộ lọc theo khoảng giá.
- Lưu đơn hàng gần nhất và trang “đơn hàng của tôi” đọc từ `localStorage`.
- Thêm toast thông báo khi thêm vào giỏ.
- Prefetch dữ liệu chi tiết qua `IntersectionObserver` khi card vào viewport.

---

## Gợi ý kiểm thử
- Mở `index.html`, thêm nhiều sản phẩm vào giỏ → `cart.html` cập nhật đúng số lượng/tạm tính.
- Tại `product.html?id=1`, thử tăng giảm số lượng, kiểm tra “Hết hàng” khi `stock = 0`.
- `checkout.html`: Submit form hiển thị mã đơn giả lập, đồng thời xóa giỏ (`clearCart`).

## Biến thể dùng Bootstrap (Bài 13)
- Thêm vào mỗi trang trong `<head>`:
  ```html
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  ```
- Thay class `.btn` thành `.btn btn-primary`, `.btn outline` → `.btn btn-outline-primary`.
- Bảng dùng `.table table-dark table-striped`, form dùng `.form-control`, layout dùng `.container`, `.row`, `.col-md-*`.


## Yêu cầu nâng cao gợi ý (tự nghiên cứu)
- **Routing client-side**: dùng `hash` (`#/product/1`) hoặc History API để điều hướng không tải lại trang.
- **Phân trang & lọc nâng cao**: phân trang client, lọc theo **khoảng giá**, **tồn kho**, **rating**, **category**.
- **UX**: debounce cho ô tìm kiếm; **scroll restoration**; **skeleton/loading** khi render nhiều thẻ; **lazy-load** ảnh (`loading="lazy"`).
- **Accessibility**: ARIA labels cho navbar, role cho button/link; thứ tự tab; focus ring & skip link.
- **Form**: kiểm tra dữ liệu nâng cao (regex email/phone), highlight lỗi inline, auto-save draft form vào `localStorage`.
- **Hiệu năng**: tách module; minify/uglify (esbuild/terser); đo Lighthouse; **preload**/`rel="preconnect"`; dùng `requestIdleCallback` cho công việc nền.
- **State management**: trừu tượng hoá `cartStore` publish/subscribe để đồng bộ badge giỏ trên nhiều trang.
- **Web Components**: tạo `<fe-product-card>` và `<fe-cart-table>` dùng Shadow DOM.
- **Unit Test**: Jest/Vitest kiểm thử `formatCurrency`, `getFilteredSorted`, `cart.js`.
- **PWA cơ bản**: Service Worker cache tài nguyên tĩnh; manifest.json; thêm icon.
- **Quốc tế hoá (i18n)**: vi/en toggle; định dạng tiền tệ/đơn vị theo locale.
- **Triển khai**: GitHub Pages/Netlify; thêm workflow CI build + lint; chuẩn hoá code với ESLint + Prettier.
- **Dark/Light mode**: thêm nút **toggle theme** (CSS variables) để chuyển nhanh giữa chế độ sáng/tối.
- **Bảo mật FE**: encode dữ liệu user-generated; Content Security Policy khi deploy.
- **Tối ưu ảnh**: dùng `srcset/sizes`; nén ảnh (squoosh/imagmin) trước khi đưa lên CDN.
