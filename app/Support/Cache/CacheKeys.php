<?php

declare(strict_types=1);

namespace App\Support\Cache;

final class CacheKeys
{
    // Tags
    public const TAG_CATEGORIES = 'categories';
    public const TAG_PRODUCTS = 'products';
    public const TAG_WISHLIST = 'wishlists';
    public const TAG_ROLES = 'roles';
    public const TAG_PERMISSIONS = 'permissions';
    public const TAG_QUESTIONS = 'questions';
    public const TAG_BRANDS = 'brands';
    public const TAG_ATTRIBUTE_PRESETS = 'attribute_presets';

    /**
     * Get the cache key for the category list in admin panel.
     */
    public static function categoryList(array $params): string
    {
        return 'category_list_' . md5(json_encode($params));
    }

    /**
     * Get the cache key for the frontend navbar categories tree.
     */
    public static function navbarCategoriesTree(): string
    {
        return 'navbar_categories_tree';
    }

    /**
     * Get the cache key for category attributes (available attributes).
     */
    public static function categoryAttributes(int|string $categoryId): string
    {
        return "category_attributes_{$categoryId}";
    }

    /**
     * Get the cache key for category price range.
     */
    public static function categoryPriceRange(int|string $categoryId): string
    {
        return "category_price_range_{$categoryId}";
    }

    /**
     * Get the cache key for category relevant brands.
     */
    public static function categoryBrands(int|string $categoryId): string
    {
        return "category_brands_{$categoryId}";
    }

    /**
     * Get the cache key for home categories with brands.
     */
    public static function homeCategoriesWithBrands(): string
    {
        return 'home_categories_with_brands';
    }

    /**
     * Get the cache key for product list (paginated, filter-dependent).
     */
    public static function productList(array $params): string
    {
        return 'product_list_' . md5(json_encode($params));
    }

    /**
     * Get the cache key for product stats (global, not filter-dependent).
     */
    public static function productStats(): string
    {
        return 'product_stats';
    }

    /**
     * Get the cache key for the brand list in admin panel.
     */
    public static function brandList(array $params): string
    {
        return 'brand_list_' . md5(json_encode($params));
    }

    /**
     * Get the cache key for the attribute presets list in admin panel.
     */
    public static function attributePresetList(array $params): string
    {
        return 'attribute_preset_list_' . md5(json_encode($params));
    }
}
