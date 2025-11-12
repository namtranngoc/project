#!/usr/bin/env bash
# exit on error
set -o errexit

# Thu thập tất cả các file tĩnh (CSS/JS) cần thiết cho trang Admin và các app
python manage.py collectstatic --noinput

# Chạy lệnh di trú database (migrate)
python manage.py migrate