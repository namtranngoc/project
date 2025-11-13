"""
Django settings for myproject project.
"""
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- CẤU HÌNH CỨNG (KHỎI CẦN ENV, CHO PYTHONANYWHERE) ---
SECRET_KEY = 'zxcxfdf@!fdgsdhjhkkuu!dfgf' # Key của bạn

# Bật DEBUG để xem lỗi (sau này chạy ngon thì sửa thành False)
DEBUG = True

# Cho phép tên miền của bạn và Vercel truy cập
ALLOWED_HOSTS = [
    '127.0.0.1',
    'namtranngoc.pythonanywhere.com',
    'project-delta-three-32.vercel.app',
]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'djoser',
    'corsheaders',
    'users',
    'orders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'myproject.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'myproject.wsgi.application'

# --- DATABASE: SQLITE3 (Lưu vào file) ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (Quan trọng cho Admin trên PythonAnywhere)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles' # Nơi collectstatic sẽ gom file vào

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
CORS_ALLOW_ALL_ORIGINS = True 
AUTH_USER_MODEL = 'users.User'

# --- CẤU HÌNH TOKEN (JWT) ---
# Dùng "Bearer" cho chuẩn
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
   'AUTH_HEADER_TYPES': ('Bearer',), # Chỉ nghe 'Bearer'
}


# --- CẤU HÌNH DJOSER (Gửi mail) ---
DJOSER = {
    'SERIALIZERS': {
        'user_create': 'djoser.serializers.UserCreateSerializer',
        'user': 'djoser.serializers.UserSerializer',
        'current_user': 'djoser.serializers.UserSerializer',
    },
    'DOMAIN': 'https://project-delta-three-32.vercel.app/', # Tên miền backend
    'SEND_ACTIVATION_EMAIL': False,
    # Link trỏ về Frontend Vercel
    'PASSWORD_RESET_CONFIRM_URL': 'https://project-delta-three-32.vercel.app/password-reset-confirm.html?uid={uid}&token={token}',
    'USERNAME_RESET_CONFIRM_URL': 'https://project-delta-three-32.vercel.app/username-reset-confirm.html?uid={uid}&token={token}',
    'ACTIVATION_URL': 'https://project-delta-three-32.vercel.app/activate.html?uid={uid}&token={token}',
}

# --- CẤU HÌNH EMAIL GMAIL (GHI CỨNG) ---
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

EMAIL_HOST_USER = 'llsakers2@gmail.com' 
EMAIL_HOST_PASSWORD = 'wiertfwsfnluaeyr' 

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER