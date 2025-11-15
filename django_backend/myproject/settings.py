"""
Django settings for myproject project.
"""
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- CẤU HÌNH CỨNG (KHỎI CẦN ENV) ---
SECRET_KEY = 'zxcxfdf@!fdgsdhjhkkuu!dfgf-khoa-bi-mat-cua-ban'
DEBUG = True
ALLOWED_HOSTS = ['*'] # Cho phép tất cả

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
    'django.contrib.sites', # Bắt buộc có
    'djoser',
    'corsheaders',
    'users',
    'orders',
    'products',
]

SITE_ID = 1

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
        'DIRS': [BASE_DIR / 'templates'],
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

# --- DATABASE: SQLITE3 ---
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

# --- FILE TĨNH (STATIC) VÀ FILE UP (MEDIA) ---
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media' # Đã chuyển xuống đây cho đúng

# Custom settings
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'users.User' # Chỉ khai báo 1 lần ở đây
CORS_ALLOW_ALL_ORIGINS = True

# --- CẤU HÌNH JWT ---
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
   'AUTH_HEADER_TYPES': ('Bearer',),
}

# --- CẤU HÌNH DJOSER (ĐÃ SỬA LẠI LINK) ---
DJOSER = {
    'SERIALIZERS': {
        'user_create': 'djoser.serializers.UserCreateSerializer',
        'user': 'djoser.serializers.UserSerializer',
        'current_user': 'djoser.serializers.UserSerializer',
    },
    # 1. Đặt domain là tên miền Backend
    'DOMAIN': 'namtranngoc.pythonanywhere.com', 
    'SEND_ACTIVATION_EMAIL': False,

    # 2. Link trỏ về chính nó (vì FE giờ nằm chung)
    # (Lưu ý: Bỏ chữ /baitap/ vì chúng ta đã set root là /)
    'PASSWORD_RESET_CONFIRM_URL': 'password-reset-confirm.html?uid={uid}&token={token}',
    'USERNAME_RESET_CONFIRM_URL': 'username-reset-confirm.html?uid={uid}&token={token}',
    'ACTIVATION_URL': 'activate.html?uid={uid}&token={token}',
}
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
# --- CẤU HÌNH EMAIL ---
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

EMAIL_HOST_USER = 'llsakers2@gmail.com' 
EMAIL_HOST_PASSWORD = 'wiertfwsfnluaeyr' 

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER