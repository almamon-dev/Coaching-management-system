<?php

namespace App\Models;

use App\Support\Cache\CacheKeys;
use App\Support\Cache\CacheManager;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $appends = ['path'];

    /**
     * Scope to only include active categories.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    /**
     * Scope to only include top-level (root) categories.
     */
    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Relationship with parent category.
     */
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }



    /**
     * Accessor for full URL path (recursive).
     */
    public function getPathAttribute()
    {
        return CacheManager::store([CacheKeys::TAG_CATEGORIES])
            ->remember("category_path_{$this->id}", 86400, function () {

                $path = $this->slug;
                $parent = $this->parent;

                while ($parent) {
                    $path = $parent->slug.'/'.$path;
                    $parent = $parent->parent;
                }

                return $path;
            });
    }

    /**
     * Relationship with child categories.
     */
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Relationship with all ancestors (recursive).
     */
    public function ancestors()
    {
        return $this->parent()->with('ancestors');
    }

    /**
     * Get all ancestor IDs recursively.
     *
     * @return array
     */
    public function getAllAncestorIds()
    {
        $ids = [];
        $parentId = $this->parent_id;

        while ($parentId) {
            $ids[] = $parentId;
            $parent = Category::find($parentId);
            $parentId = $parent ? $parent->parent_id : null;
        }

        return $ids;
    }

    /**
     * Relationship with products.
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_categories');
    }



    /**
     * Accessor for top brands associated with this category.
     *
     * @return Collection
     */
    public function getTopBrandsAttribute()
    {
        $ids = $this->getAllChildrenIds();
        $ids[] = $this->id;

        return Brand::whereHas('products.categories', function ($q) use ($ids) {
            $q->whereIn('categories.id', $ids);
        })->limit(10)->get();
    }

    public function getAllChildrenIds()
    {
        return CacheManager::store([
            CacheKeys::TAG_CATEGORIES,
        ])->remember("category_children_ids_{$this->id}", 86400, function () {

            $ids = [];

            foreach ($this->children as $child) {
                $ids[] = $child->id;

                $ids = array_merge(
                    $ids,
                    $child->getAllChildrenIds()
                );
            }

            return $ids;
        });
    }
}
