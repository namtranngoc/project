# Hướng dẫn chạy dự án (Frontend + Backend Django)

Dự án này bao gồm hai phần chạy độc lập:
* `django_backend`: Server backend bằng Python (Django).
* `baitap`: Giao diện frontend bằng HTML/CSS/JS (của bạn).

---

## 🚀 Backend (Thư mục: `django_backend`)

Bạn **bắt buộc** phải chạy server này trước để Frontend có thể Đăng nhập/Đăng ký.

### 1. Cài đặt lần đầu (Chỉ làm 1 lần trên máy mới)

Mở terminal và chạy các lệnh sau từ thư mục `django_backend`:

```bash
# 1. Di chuyển vào thư mục backend
cd django_backend

# 2. Tạo môi trường ảo (virtual environment) tên là 'venv'
python -m venv venv

Set-ExecutionPolicy Unrestricted -Scope Process

# 3. Kích hoạt môi trường ảo
# Trên Windows (Command Prompt):
venv\Scripts\activate
# Trên Windows (PowerShell - nếu bị lỗi, chạy lệnh này trước: Set-ExecutionPolicy Unrestricted -Scope Process)
.\venv\Scripts\activate
# Trên macOS/Linux:
source venv/bin/activate
# 3. Chạy server
# Server sẽ chạy ở: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
python manage.py runserver

# 4. Cài đặt tất cả thư viện cần thiết từ file requirements.txt
pip freeze > requirements.txt
pip install -r requirements.txt

# 5. Tạo file database (db.sqlite3) lần đầu
python manage.py migrate
# 🛠️ Các lệnh hữu ích khác (Backend)
# (Chỉ chạy khi (venv) đã được kích hoạt)

# Tạo tài khoản admin (để vào trang [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/))
python manage.py createsuperuser

# Nếu bạn có thay đổi trong file 'users/models.py', chạy 2 lệnh sau:
python manage.py makemigrations users
python manage.py migrate
<<<<<<< HEAD
=======
# Thư viện để chạy server Python (thay thế runserver)
pip install gunicorn

# Thư viện để kết nối Django với database PostgreSQL
pip install psycopg2-binary

# Thư viện giúp đọc URL của database
pip install dj-database-url
>>>>>>> 1e39527 (Fix: Line endings for build.sh)
postgresql://project_wpr4_user:fglVOG9lvz9lDpaAcE7OF4iUmNqqlM0S@dpg-d4a6g2vgi27c739smfv0-a/project_wpr4
https://project-ux9u.onrender.com/
project-delta-three-32.vercel.app

# fontend đẩy lên server https://vercel.com/
# backend đẩy lên server https://www.pythonanywhere.com/

# git fetch origin → lấy cập nhật từ remote mà chưa merge.

# git reset --hard origin/main → reset tất cả file local giống hoàn toàn remote, mọi thay đổi trên server bị mất.