"""
Django settings for myproject project.
"""
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- CẤU HÌNH CỨNG (KHỎI CẦN ENV) ---
SECRET_KEY = 'zxcxfdf@!fdgsdhjhkkuu!dfgf-khoa-bi-mat-cua-ban'

# Bật DEBUG
DEBUG = True

# Cho phép tất cả truy cập
ALLOWED_HOSTS = ['*']

AUTH_USER_MODEL = 'users.User'

MEDIA_URL = '/media/'  # URL truy cập file
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')  # Thư mục lưu file vật lý
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

# QUAN TRỌNG: ID của site mặc định
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

# Static files
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'users.User'
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

# --- CẤU HÌNH DJOSER (QUAN TRỌNG NHẤT) ---
DJOSER = {
    'SERIALIZERS': {
        'user_create': 'djoser.serializers.UserCreateSerializer',
        'user': 'djoser.serializers.UserSerializer',
        'current_user': 'djoser.serializers.UserSerializer',
    },
    # Dòng này để Backend biết nó là ai (không ảnh hưởng link gửi đi nếu dùng link tuyệt đối dưới)
    'DOMAIN': '',
    'SEND_ACTIVATION_EMAIL': False,

    # Lưu ý: Không có chữ '/baitap' vì Vercel đã set root là baitap rồi
    'PASSWORD_RESET_CONFIRM_URL': 'password-reset-confirm.html?uid={uid}&token={token}',
    'USERNAME_RESET_CONFIRM_URL': 'username-reset-confirm.html?uid={uid}&token={token}',
    'ACTIVATION_URL': 'activate.html?uid={uid}&token={token}',
}

# --- CẤU HÌNH EMAIL ---
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# 👇 Thay bằng mật khẩu thật của bạn 👇
EMAIL_HOST_USER = 'llsakers2@gmail.com'
EMAIL_HOST_PASSWORD = 'wiertfwsfnluaeyr'

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

