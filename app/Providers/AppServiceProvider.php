<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Repositories\Admin\Logistics\LogisticsRepositoryInterface;
use App\Repositories\Admin\Logistics\EloquentLogisticsRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Override Config from Database
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('settings')) {
                $settings = \App\Models\Setting::all()->pluck('value', 'key');


                if (isset($settings['site_name'])) {
                    config(['app.name' => $settings['site_name']]);
                }

                // For debug mode, we need to handle the string to boolean conversion
                if (isset($settings['debug_mode'])) {
                    config(['app.debug' => filter_var($settings['debug_mode'], FILTER_VALIDATE_BOOLEAN)]);
                }
            }
        } catch (\Exception $e) {
            // Silently fail if DB is not ready
        }
        \App\Models\Category::observe(\App\Observers\Category\CategoryObserver::class);
        \App\Models\Product::observe(\App\Observers\Product\ProductObserver::class);
        \App\Models\Brand::observe(\App\Observers\Brand\BrandObserver::class);
        $this->app->bind(
            LogisticsRepositoryInterface::class,
            EloquentLogisticsRepository::class
        );
    }
}
