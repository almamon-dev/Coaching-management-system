<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
 
class Supplier extends Model
{
    use HasFactory;
 
    protected $guarded = ['id'];
 
    /**
     * Scope to only include active suppliers.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
 
    /**
     * Relationship with brands.
     */
    public function brands()
    {
        return $this->belongsToMany(Brand::class, 'brand_supplier');
    }
}
