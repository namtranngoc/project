"""
Django settings for myproject project.
"""
import environ
import os
from pathlib import Path
import dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Khởi tạo và Đọc biến môi trường từ file .env
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


# SECURITY WARNING: keep the secret key used in production secret!
# Lấy SECRET_KEY từ biến môi trường
SECRET_KEY = env('SECRET_KEY') 

# SECURITY WARNING: don't run with debug turned on in production!
# TẮT DEBUG khi không có biến DEBUG=True (mặc định là Production)
DEBUG = env('DEBUG', default=False) 

# Thêm tất cả các host để Render và Vercel truy cập
ALLOWED_HOSTS = [
    '127.0.0.1', 
    '.onrender.com', 
    'project-axu.onrender.com', # Link Backend của bạn
    'project-delta-three-32.vercel.app', # Link Frontend của bạn
]


# Application definition
INSTALLED_APPS = [
    # Thư viện cho giao diện admin đẹp (nếu bạn đã cài)
    # 'jazzmin', 
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    # Apps của bên thứ 3
    'rest_framework',
    'rest_framework_simplejwt',
    'djoser',
    'corsheaders',
    
    # App của chúng ta
    'users',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware", # Cho static files trên Render
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
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


# Database
DATABASES = {
    'default': {
        # Cấu hình dự phòng: Dùng SQLite khi chạy local mà không có .env
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# === CẤU HÌNH PRODUCTION (POSTGRESQL) ===
# Render tự động cung cấp biến DATABASE_URL_RENDER
DATABASE_URL_RENDER = env('DATABASE_URL_RENDER', default=None) 

if DATABASE_URL_RENDER:
    # ⚠️ QUAN TRỌNG: Dùng biến môi trường, không dùng link cứng!
    DATABASES['default'] = dj_database_url.parse(DATABASE_URL_RENDER, conn_max_age=600)


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    # Đã tắt bộ lọc quá giống username theo yêu cầu trước đó
    # { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]


# Internationalization & Time Zone
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# Static files (WhiteNoise)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


# Custom settings
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
CORS_ALLOW_ALL_ORIGINS = True # Tạm thời để dễ test
AUTH_USER_MODEL = 'users.User'
SITE_ID = 1 # Cho Sites framework


# Cấu hình DJOSER
DJOSER = {
    'SERIALIZERS': {
        'user_create': 'djoser.serializers.UserCreateSerializer',
        'user': 'djoser.serializers.UserSerializer',
        'current_user': 'djoser.serializers.UserSerializer',
    },
    'DOMAIN': 'project-delta-three-32.vercel.app',
    'SEND_ACTIVATION_EMAIL': False,
    # SỬ DỤNG HTTPS cho link reset trên mạng:
    'PASSWORD_RESET_CONFIRM_URL': 'https://project-delta-three-32.vercel.app/baitap/password-reset-confirm.html?uid={uid}&token={token}',
    'USERNAME_RESET_CONFIRM_URL': 'https://project-delta-three-32.vercel.app/baitap/username-reset-confirm.html?uid={uid}&token={token}',
    'ACTIVATION_URL': 'https://project-delta-three-32.vercel.app/baitap/activate.html?uid={uid}&token={token}',
}


# Cấu hình Gửi Email (Đọc từ .env)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# Đọc thông tin từ file .env
EMAIL_HOST_USER = env('EMAIL_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_PASS')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER