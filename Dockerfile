FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    curl \
    libpng-dev \
    libxml2-dev \
    libzip-dev \
    nodejs \
    npm

RUN docker-php-ext-install pdo pdo_mysql gd dom zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
