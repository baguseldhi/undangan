FROM php:8.2-fpm

# Install dependencies sistem
RUN apt-get update --fix-missing && \
    apt-get install -y \
        zip \
        unzip \
        libonig-dev \
        libicu-dev \
        libzip-dev \
        libpq-dev \
        libssl-dev \
        zlib1g-dev \
        pkg-config && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install PHP extensions (yang sudah ada + mongodb via PECL)
RUN docker-php-ext-install pdo zip pdo_pgsql pgsql opcache intl bcmath mbstring && \
    pecl install mongodb && \
    docker-php-ext-enable mongodb

# Enable semua extension yang diperlukan
RUN docker-php-ext-enable pdo zip pdo_pgsql pgsql opcache intl bcmath mbstring mongodb

# Copy custom php.ini (opcache)
COPY /api/php.ini /usr/local/etc/php/conf.d/opcache.ini

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy aplikasi
COPY . /var/www
WORKDIR /var/www

# Hanya chown folder yang benar-benar perlu
RUN chown -R www-data:www-data /var/www/storage /var/www/cache /var/www/bootstrap/cache 2>/dev/null || true
RUN chmod -R 775 /var/www/storage /var/www/cache /var/www/bootstrap/cache 2>/dev/null || true

# Composer install (tanpa --ignore-platform-req lagi)
RUN composer install --prefer-dist --no-dev --optimize-autoloader --no-interaction

# Jika ada command custom kamu
RUN php saya key
RUN php saya view:cache

USER www-data

EXPOSE 9000
CMD ["php-fpm"]