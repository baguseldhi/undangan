#!/bin/bash

DOMAIN="domain.com"
EMAIL="email@kamu.com"
REPO_DIR="/var/www/nama-repo"

echo "=============================="
echo " DEPLOY UNDANGAN KE VPS"
echo "=============================="

# 1. Copy .env production
echo "[1/7] Setup .env..."
cp $REPO_DIR/api-undangan/.env.production $REPO_DIR/api-undangan/.env

# 2. Copy nginx HTTP config dulu
echo "[2/7] Setup nginx HTTP..."
cp $REPO_DIR/api-undangan/docker/nginx/default.http.conf $REPO_DIR/api-undangan/docker/nginx/default.conf
sed -i "s/domain.com/$DOMAIN/g" $REPO_DIR/api-undangan/docker/nginx/default.conf

# 3. Jalankan semua container
echo "[3/7] Menjalankan containers..."
cd $REPO_DIR/undangan
docker compose -f docker-compose.production.yml up -d --build

# 4. Tunggu app siap
echo "[4/7] Menunggu app siap..."
sleep 30

# 5. Migrasi database
echo "[5/7] Migrasi database..."
docker exec undangan-app php saya migrasi --gen

# 6. Ambil certificate HTTPS
echo "[6/7] Mengambil certificate HTTPS..."
docker compose -f docker-compose.production.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN \
  -d www.$DOMAIN

# 7. Update nginx ke HTTPS dan restart
echo "[7/7] Setup nginx HTTPS..."
cp $REPO_DIR/api-undangan/docker/nginx/default.https.conf $REPO_DIR/api-undangan/docker/nginx/default.conf
sed -i "s/domain.com/$DOMAIN/g" $REPO_DIR/api-undangan/docker/nginx/default.conf
docker compose -f docker-compose.production.yml restart nginx

# 8. Setup auto renewal
echo "Setup auto-renewal certificate..."
(crontab -l 2>/dev/null; echo "0 3 * * * cd $REPO_DIR/undangan && docker compose -f docker-compose.production.yml run --rm certbot renew && docker compose -f docker-compose.production.yml restart nginx >> /var/log/certbot-renew.log 2>&1") | crontab -

echo "=============================="
echo " DEPLOY SELESAI!"
echo " Akses: https://$DOMAIN"
echo "=============================="
