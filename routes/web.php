<?php

use App\Http\Controllers\Admin\Order\OrderController;
use App\Http\Controllers\User\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [\App\Http\Controllers\Frontend\HomeController::class, 'index'])->name('home');

// Language Switcher
Route::get('/language/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'bn'])) {
        session()->put('locale', $locale);
    }
    return redirect()->back();
})->name('language.switch');

// Staff Invitation acceptance routes
Route::get('invitations/accept/{user}', [\App\Http\Controllers\Admin\Users\UserController::class, 'showAcceptInvitation'])
    ->name('admin.invitations.accept');

Route::get('/dashboard', function () {
    if (auth()->user()->user_type === 'admin') {
        return redirect()->route('admin.dashboard');
    }

    return redirect()->route('user.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'user'])->group(function () {
    Route::get('/user/dashboard', [\App\Http\Controllers\User\DashboardController::class, 'index'])->name('user.dashboard');
    Route::get('/user/orders', [\App\Http\Controllers\User\DashboardController::class, 'orders'])->name('user.orders');
    Route::get('/user/orders/{orderNumber}/track', [\App\Http\Controllers\User\DashboardController::class, 'trackOrder'])->name('user.orders.track');
    Route::post('/user/orders/{orderNumber}/cancel', [\App\Http\Controllers\User\DashboardController::class, 'cancelOrder'])->name('user.orders.cancel');
    Route::post('/user/orders/{orderNumber}/returns', [\App\Http\Controllers\User\OrderReturnController::class, 'store'])->name('user.orders.returns.store');
    Route::get('/user/wishlist', [\App\Http\Controllers\User\DashboardController::class, 'wishlist'])->name('user.wishlist');
    Route::delete('/user/wishlist/{product}', [\App\Http\Controllers\User\DashboardController::class, 'removeWishlist'])->name('user.wishlist.destroy');
    Route::get('/user/reviews', [\App\Http\Controllers\User\DashboardController::class, 'reviews'])->name('user.reviews');
    Route::get('/user/addresses', [\App\Http\Controllers\User\DashboardController::class, 'addresses'])->name('user.addresses');
    Route::post('/user/addresses', [\App\Http\Controllers\User\DashboardController::class, 'storeAddress'])->name('user.addresses.store');
    Route::patch('/user/addresses/{address}', [\App\Http\Controllers\User\DashboardController::class, 'updateAddress'])->name('user.addresses.update');
    Route::delete('/user/addresses/{address}', [\App\Http\Controllers\User\DashboardController::class, 'deleteAddress'])->name('user.addresses.destroy');
    Route::get('/user/payment-methods', [\App\Http\Controllers\User\DashboardController::class, 'paymentMethods'])->name('user.payment-methods');
    Route::post('/user/payment-methods', [\App\Http\Controllers\User\DashboardController::class, 'storePaymentMethod'])->name('user.payment-methods.store');
    Route::get('/user/security', [\App\Http\Controllers\User\DashboardController::class, 'security'])->name('user.security');
    Route::get('/user/notifications', [\App\Http\Controllers\User\DashboardController::class, 'notifications'])->name('user.notifications.index');
    Route::post('/user/notifications/read-all', [\App\Http\Controllers\User\DashboardController::class, 'markNotificationsAsRead'])->name('user.notifications.read-all');

    // Customer Support Tickets
    Route::prefix('user/tickets')->name('dashboard.tickets.')->group(function () {
        Route::get('/', [\App\Http\Controllers\User\TicketController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\User\TicketController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\User\TicketController::class, 'store'])->name('store');
        Route::get('/{ticket}', [\App\Http\Controllers\User\TicketController::class, 'show'])->name('show');
        Route::post('/{ticket}/reply', [\App\Http\Controllers\User\TicketController::class, 'reply'])->name('reply');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Routes
    Route::prefix('admin')->middleware('admin')->name('admin.')->group(function () {
        // Blog Management
        Route::post('blogs/bulk-update-status', [\App\Http\Controllers\Admin\Blog\BlogController::class, 'bulkUpdateStatus'])->name('blogs.bulk-update-status');
        Route::delete('blogs/bulk-destroy', [\App\Http\Controllers\Admin\Blog\BlogController::class, 'bulkDestroy'])->name('blogs.bulk-destroy');
        Route::patch('blogs/{blog}/status', [\App\Http\Controllers\Admin\Blog\BlogController::class, 'updateStatus'])->name('blogs.status');
        Route::resource('blogs', \App\Http\Controllers\Admin\Blog\BlogController::class);

        // Page Management
        Route::post('pages/bulk-update-status', [\App\Http\Controllers\Admin\Page\PageController::class, 'bulkUpdateStatus'])->name('pages.bulk-update-status');
        Route::delete('pages/bulk-destroy', [\App\Http\Controllers\Admin\Page\PageController::class, 'bulkDestroy'])->name('pages.bulk-destroy');
        Route::patch('pages/{page}/status', [\App\Http\Controllers\Admin\Page\PageController::class, 'updateStatus'])->name('pages.status');
        Route::resource('pages', \App\Http\Controllers\Admin\Page\PageController::class);
        // Admin Orders
        Route::prefix('orders')->name('orders.')->group(function() {
            Route::get('/export', [OrderController::class, 'export'])->name('export');
            Route::get('/bulk-invoice', [OrderController::class, 'bulkInvoice'])->name('bulk-invoice');
            Route::post('/bulk-update-status', [OrderController::class, 'bulkUpdateStatus'])->name('bulk-update-status');
            Route::get('/{id}/invoice', [OrderController::class, 'invoice'])->name('invoice');
            Route::post('/{id}/status', [OrderController::class, 'updateStatus'])->name('update-status');
            Route::delete('/bulk-destroy', [OrderController::class, 'bulkDestroy'])->name('bulk-destroy');
        });
        Route::resource('orders', OrderController::class)->only(['index', 'show', 'destroy']);

        // Logistics Routes
        Route::prefix('logistics')->name('logistics.')->group(function() {
            Route::get('tracking', [\App\Http\Controllers\Admin\Logistics\LogisticsController::class, 'trackingIndex'])
                ->name('tracking.index');
            
            Route::get('configuration', [\App\Http\Controllers\Admin\Logistics\LogisticsController::class, 'configurationIndex'])
                ->name('configuration.index');
            Route::post('configuration', [\App\Http\Controllers\Admin\Logistics\LogisticsController::class, 'configurationUpdate'])
                ->name('configuration.update');
            
            Route::get('returns', [\App\Http\Controllers\Admin\OrderReturnController::class, 'index'])
                ->name('returns.index');
            Route::patch('returns/{return}', [\App\Http\Controllers\Admin\OrderReturnController::class, 'update'])
                ->name('returns.update');
        });

        Route::get('/dashboard', [\App\Http\Controllers\Admin\Dashboard\DashboardController::class, 'index'])->name('dashboard');
        // Settings Routes
        Route::prefix('settings')->name('settings.')->group(function () {
            // General Settings
            Route::prefix('general')->name('general.')->group(function () {
                Route::get('profile', [\App\Http\Controllers\Admin\Settings\ProfileController::class, 'index'])->name('profile');
                Route::post('profile/update', [\App\Http\Controllers\Admin\Settings\ProfileController::class, 'update'])->name('profile.update');
                Route::post('profile/remove-picture', [\App\Http\Controllers\Admin\Settings\ProfileController::class, 'removePicture'])->name('profile.remove-picture');
                Route::get('security', function () {
                    return Inertia::render('Admin/Settings/General/SecurityPage');
                })->name('security');
                Route::get('notifications', function () {
                    return Inertia::render('Admin/Settings/General/NotificationsPage');
                })->name('notifications');
            });

            // Website Settings
            Route::prefix('website')->name('website.')->group(function () {
                Route::get('system', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'websiteSystem'])->name('system');
                Route::get('company', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'companySettings'])->name('company');
                Route::get('localization', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'localizationSettings'])->name('localization');
                Route::post('localization', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'updateLocalizationSettings'])->name('localization.update');
                Route::get('prefixes', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'prefixesSettings'])->name('prefixes');
                Route::get('preference', function () {
                    return Inertia::render('Admin/Settings/Website/PreferencePage');
                })->name('preference');
                Route::get('appearance', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'appearanceSettings'])->name('appearance');
                Route::get('social-auth', function () {
                    return Inertia::render('Admin/Settings/Website/SocialAuthenticationPage');
                })->name('social-auth');
            });

            // System Settings
            Route::prefix('system')->name('system.')->group(function () {
                Route::get('email', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'emailSettings'])->name('email');
                Route::post('email/update', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'updateEmail'])->name('email.update');
                Route::get('storage', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'storageSettings'])->name('storage');
                Route::post('storage/update', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'updateStorage'])->name('storage.update');
                Route::get('sms', function () {
                    return Inertia::render('Admin/Settings/Components/PlaceholderPage', ['title' => 'SMS Settings']);
                })->name('sms');
                Route::get('otp', function () {
                    return Inertia::render('Admin/Settings/Components/PlaceholderPage', ['title' => 'OTP Settings']);
                })->name('otp');
                Route::get('gdpr', function () {
                    return Inertia::render('Admin/Settings/Components/PlaceholderPage', ['title' => 'GDPR Settings']);
                })->name('gdpr');
            });

            // Financial Settings
            Route::prefix('financial')->name('financial.')->group(function () {
                Route::get('gateway', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'financialGateway'])->name('gateway');
                Route::get('bank-accounts', function () {
                    return Inertia::render('Admin/Settings/Components/PlaceholderPage', ['title' => 'Bank Accounts']);
                })->name('bank-accounts');
                Route::get('tax-rates', function () {
                    return Inertia::render('Admin/Settings/Components/PlaceholderPage', ['title' => 'Tax Rates']);
                })->name('tax-rates');
                Route::get('currencies', function () {
                    return Inertia::render('Admin/Settings/Components/PlaceholderPage', ['title' => 'Currencies']);
                })->name('currencies');
            });

            // Generic Update Route
            Route::post('update', [\App\Http\Controllers\Admin\Settings\SettingController::class, 'update'])->name('update');

            // Other Settings
            Route::prefix('other')->name('other.')->group(function () {
                Route::get('storage', function () {
                    return Inertia::render('Admin/Settings/Components/PlaceholderPage', ['title' => 'Storage Settings']);
                })->name('storage');
                Route::get('ban-ip', function () {
                    return Inertia::render('Admin/Settings/Components/PlaceholderPage', ['title' => 'Ban IP Address']);
                })->name('ban-ip');
            });
        });
        // Brand Management
        Route::post('brands/bulk-update-status', [\App\Http\Controllers\Admin\Brand\BrandController::class, 'bulkUpdateStatus'])->name('brands.bulk-update-status');
        Route::delete('brands/bulk-destroy', [\App\Http\Controllers\Admin\Brand\BrandController::class, 'bulkDestroy'])->name('brands.bulk-destroy');
        Route::patch('brands/{brand}/status', [\App\Http\Controllers\Admin\Brand\BrandController::class, 'updateStatus'])->name('brands.status');
        Route::resource('brands', \App\Http\Controllers\Admin\Brand\BrandController::class)->except(['show']);

        // Category Management
        Route::prefix('categories')->name('categories.')->group(function () {

            Route::post('bulk-update-status', [\App\Http\Controllers\Admin\Category\CategoryController::class, 'bulkUpdateStatus'])->name('bulk-update-status');
            Route::delete('bulk-destroy', [\App\Http\Controllers\Admin\Category\CategoryController::class, 'bulkDestroy'])->name('bulk-destroy');
            Route::patch('{category}/status', [\App\Http\Controllers\Admin\Category\CategoryController::class, 'updateStatus'])->name('status');

        });
        Route::resource('categories', \App\Http\Controllers\Admin\Category\CategoryController::class)->except(['show']);

        // Variant Management
        Route::prefix('variants')->name('variants.')->group(function () {
            Route::post('bulk-update-status', [\App\Http\Controllers\Admin\Variant\VariantController::class, 'bulkUpdateStatus'])->name('bulk-update-status');
            Route::delete('bulk-destroy', [\App\Http\Controllers\Admin\Variant\VariantController::class, 'bulkDestroy'])->name('bulk-destroy');
            Route::patch('{variant}/status', [\App\Http\Controllers\Admin\Variant\VariantController::class, 'updateStatus'])->name('status');
            
            Route::post('{variant}/options', [\App\Http\Controllers\Admin\Variant\VariantController::class, 'storeOption'])->name('options.store');
            Route::put('{variant}/options/{option}', [\App\Http\Controllers\Admin\Variant\VariantController::class, 'updateOption'])->name('options.update');
            Route::delete('{variant}/options/{option}', [\App\Http\Controllers\Admin\Variant\VariantController::class, 'destroyOption'])->name('options.destroy');
        });
        Route::resource('variants', \App\Http\Controllers\Admin\Variant\VariantController::class)->except(['create', 'show', 'edit']);

        Route::delete('products/bulk-destroy', [\App\Http\Controllers\Admin\Product\ProductController::class, 'bulkDestroy'])->name('products.bulk-destroy');
        Route::patch('products/{product}/status', [\App\Http\Controllers\Admin\Product\ProductController::class, 'updateStatus'])->name('products.status');
        Route::get('products/download-template', [\App\Http\Controllers\Admin\Product\ProductController::class, 'downloadTemplate'])->name('products.download-template');
        Route::get('products/download-reference', [\App\Http\Controllers\Admin\Product\ProductController::class, 'downloadReference'])->name('products.download-reference');
        Route::post('products/parse-import', [\App\Http\Controllers\Admin\Product\ProductController::class, 'parseImport'])->name('products.parse-import');
        Route::post('products/import', [\App\Http\Controllers\Admin\Product\ProductController::class, 'import'])->name('products.import');
        Route::resource('products', \App\Http\Controllers\Admin\Product\ProductController::class);

        // Product Questions Management
        Route::post('questions/bulk-update-status', [\App\Http\Controllers\Admin\Product\ProductInteractionController::class, 'bulkUpdateQuestionsStatus'])->name('questions.bulk-update-status');
        Route::post('questions/bulk-destroy', [\App\Http\Controllers\Admin\Product\ProductInteractionController::class, 'bulkDestroyQuestions'])->name('questions.bulk-destroy');
        Route::get('questions', [\App\Http\Controllers\Admin\Product\ProductInteractionController::class, 'questionsIndex'])->name('questions.index');
        Route::post('questions/{question}/answer', [\App\Http\Controllers\Admin\Product\ProductInteractionController::class, 'answerQuestion'])->name('questions.answer');
        Route::delete('questions/{question}', [\App\Http\Controllers\Admin\Product\ProductInteractionController::class, 'destroyQuestion'])->name('questions.destroy');

        Route::patch('suppliers/{supplier}/status', [\App\Http\Controllers\Admin\Supplier\SupplierController::class, 'updateStatus'])->name('suppliers.status');
        Route::resource('suppliers', \App\Http\Controllers\Admin\Supplier\SupplierController::class)->except(['show']);

        // Warehouse Management
        Route::post('warehouses/bulk-destroy', [\App\Http\Controllers\Admin\Warehouse\WarehouseController::class, 'bulkDelete'])->name('warehouses.bulk-destroy');
        Route::patch('warehouses/{warehouse}/status', [\App\Http\Controllers\Admin\Warehouse\WarehouseController::class, 'status'])->name('warehouses.status');
        Route::resource('warehouses', \App\Http\Controllers\Admin\Warehouse\WarehouseController::class)->except(['show']);

        // Access Control (Protected: Super Admin Only)
        Route::middleware('role:Super Admin')->group(function () {
            // Users Management
            Route::post('users/bulk-destroy', [\App\Http\Controllers\Admin\Users\UserController::class, 'bulkDestroy'])->name('users.bulk-destroy');
            Route::post('users/bulk-update-status', [\App\Http\Controllers\Admin\Users\UserController::class, 'bulkUpdateStatus'])->name('users.bulk-update-status');
            Route::resource('users', \App\Http\Controllers\Admin\Users\UserController::class)->except(['show']);

            // Roles & Permissions Management
            Route::post('roles/bulk-destroy', [\App\Http\Controllers\Admin\Roles\RoleController::class, 'bulkDestroy'])->name('roles.bulk-destroy');
            Route::resource('roles', \App\Http\Controllers\Admin\Roles\RoleController::class);
            Route::post('permissions', [\App\Http\Controllers\Admin\Roles\RoleController::class, 'storePermission'])->name('permissions.store');
        });

        // Administrative Support Tickets (Accessible by Super Admin and Customer Support roles)
        Route::middleware('role_or_permission:Super Admin|Customer Support')->group(function () {
            Route::post('tickets/{ticket}/reply', [\App\Http\Controllers\Admin\Tickets\TicketController::class, 'reply'])->name('tickets.reply');
            Route::patch('tickets/{ticket}/assign', [\App\Http\Controllers\Admin\Tickets\TicketController::class, 'assign'])->name('tickets.assign');
            Route::patch('tickets/{ticket}/status', [\App\Http\Controllers\Admin\Tickets\TicketController::class, 'updateStatus'])->name('tickets.status');
            Route::patch('tickets/{ticket}/priority', [\App\Http\Controllers\Admin\Tickets\TicketController::class, 'updatePriority'])->name('tickets.priority');
            Route::resource('tickets', \App\Http\Controllers\Admin\Tickets\TicketController::class)->only(['index', 'show']);
        });

        Route::prefix('category-discounts')->name('category-discounts.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Category\GlobalDiscountController::class, 'index'])->name('index');
            Route::post('/', [\App\Http\Controllers\Admin\Category\GlobalDiscountController::class, 'store'])->name('store');
            Route::put('/{discount}', [\App\Http\Controllers\Admin\Category\GlobalDiscountController::class, 'update'])->name('update');
            Route::patch('/{discount}/status', [\App\Http\Controllers\Admin\Category\GlobalDiscountController::class, 'updateStatus'])->name('status');
            Route::delete('/{discount}', [\App\Http\Controllers\Admin\Category\GlobalDiscountController::class, 'destroy'])->name('destroy');
        });

        // Seller Products
        Route::prefix('seller')->name('seller.')->group(function () {
            Route::get('products', [\App\Http\Controllers\Admin\Product\ProductController::class, 'index'])->name('products.index');
            Route::get('products/physical', [\App\Http\Controllers\Admin\Product\ProductController::class, 'index'])->name('products.physical');
            Route::get('products/digital', [\App\Http\Controllers\Admin\Product\ProductController::class, 'index'])->name('products.digital');
        });

        // Product Reviews
        Route::post('reviews/bulk-update-status', [\App\Http\Controllers\Admin\Product\ProductReviewController::class, 'bulkUpdateStatus'])->name('reviews.bulk-update-status');
        Route::post('reviews/bulk-destroy', [\App\Http\Controllers\Admin\Product\ProductReviewController::class, 'bulkDestroy'])->name('reviews.bulk-destroy');
        Route::post('reviews/{review}/toggle-status', [\App\Http\Controllers\Admin\Product\ProductReviewController::class, 'toggleStatus'])->name('reviews.toggle-status');
        Route::resource('reviews', \App\Http\Controllers\Admin\Product\ProductReviewController::class)->only(['index', 'destroy']);

        // Marketing Campaigns
        Route::prefix('marketing')->name('marketing.')->group(function () {
            Route::get('coupons', [\App\Http\Controllers\Admin\Marketing\MarketingCampaignController::class, 'coupons'])->name('coupons.index');
            Route::patch('{campaign}/status', [\App\Http\Controllers\Admin\Marketing\MarketingCampaignController::class, 'updateStatus'])->name('status');
            Route::post('bulk-update-status', [\App\Http\Controllers\Admin\Marketing\MarketingCampaignController::class, 'bulkUpdateStatus'])->name('bulk-update-status');
            Route::delete('bulk-destroy', [\App\Http\Controllers\Admin\Marketing\MarketingCampaignController::class, 'bulkDestroy'])->name('bulk-destroy');
            Route::resource('campaigns', \App\Http\Controllers\Admin\Marketing\MarketingCampaignController::class)->except(['index', 'show']);

            // Admin Offers
            Route::post('offers/bulk-update-status', [\App\Http\Controllers\Admin\Marketing\OfferController::class, 'bulkUpdateStatus'])->name('offers.bulk-update-status');
            Route::delete('offers/bulk-destroy', [\App\Http\Controllers\Admin\Marketing\OfferController::class, 'bulkDestroy'])->name('offers.bulk-destroy');
            Route::patch('offers/{offer}/status', [\App\Http\Controllers\Admin\Marketing\OfferController::class, 'updateStatus'])->name('offers.status');
            Route::resource('offers', \App\Http\Controllers\Admin\Marketing\OfferController::class);
        });

        // Notifications
        Route::get('notifications', [\App\Http\Controllers\Admin\Notification\NotificationController::class, 'index'])->name('notifications.index');
        Route::post('notifications/read-all', [\App\Http\Controllers\Admin\Notification\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

        // Transaction History
        Route::get('transactions', [\App\Http\Controllers\Admin\Transaction\TransactionController::class, 'index'])->name('transactions.index');
        Route::delete('transactions/{payment}', [\App\Http\Controllers\Admin\Transaction\TransactionController::class, 'destroy'])->name('transactions.destroy');

        // Repair & Service Management
        Route::prefix('repairs')->name('repairs.')->group(function () {
            Route::post('/bulk-update-status', [\App\Http\Controllers\Admin\Repair\RepairController::class, 'bulkUpdateStatus'])->name('bulk-update-status');
            Route::delete('/bulk-destroy', [\App\Http\Controllers\Admin\Repair\RepairController::class, 'bulkDestroy'])->name('bulk-destroy');
            Route::post('/{repair}/register', [\App\Http\Controllers\Admin\Repair\RepairController::class, 'registerGadget'])->name('register');
            Route::post('/{repair}/assign', [\App\Http\Controllers\Admin\Repair\RepairController::class, 'assignTechnician'])->name('assign');
            Route::post('/{repair}/diagnose', [\App\Http\Controllers\Admin\Repair\RepairController::class, 'saveDiagnostics'])->name('diagnose');
            Route::post('/{repair}/add-part', [\App\Http\Controllers\Admin\Repair\RepairController::class, 'addSparePart'])->name('add-part');
            Route::delete('/{repair}/remove-part/{part}', [\App\Http\Controllers\Admin\Repair\RepairController::class, 'removeSparePart'])->name('remove-part');
            Route::post('/{repair}/update-status', [\App\Http\Controllers\Admin\Repair\RepairController::class, 'updateStatus'])->name('update-status');
        });
        Route::resource('repairs', \App\Http\Controllers\Admin\Repair\RepairController::class)->only(['index', 'show']);

        // Admin Kiosk Queue Counters
        Route::prefix('counters')->name('counters.')->group(function () {
            Route::patch('/{counter}/status', [\App\Http\Controllers\Admin\Counter\CounterController::class, 'updateStatus'])->name('status');
            Route::delete('/bulk-destroy', [\App\Http\Controllers\Admin\Counter\CounterController::class, 'bulkDestroy'])->name('bulk-destroy');
            Route::post('/bulk-update-status', [\App\Http\Controllers\Admin\Counter\CounterController::class, 'bulkUpdateStatus'])->name('bulk-update-status');
        });
        Route::resource('counters', \App\Http\Controllers\Admin\Counter\CounterController::class)->except(['show']);
    });

    Route::post('/product/{product}/question', [\App\Http\Controllers\Frontend\ProductInteractionController::class, 'storeQuestion'])->name('frontend.product.question.store');
    Route::post('/product/{product}/review', [\App\Http\Controllers\Frontend\ProductInteractionController::class, 'storeReview'])->name('frontend.product.review.store');
    Route::post('/product/{product}/wishlist', [\App\Http\Controllers\Frontend\ProductInteractionController::class, 'toggleWishlist'])->name('frontend.product.wishlist.toggle');

});

// Faculties Routes
Route::get('/faculties', [\App\Http\Controllers\Frontend\FacultyController::class, 'index'])->name('faculties.index');
Route::get('/faculties/{id}', [\App\Http\Controllers\Frontend\FacultyController::class, 'show'])->name('faculties.show');

// Checkout Routes
Route::get('/checkout', [\App\Http\Controllers\Frontend\CheckoutController::class, 'index'])->name('checkout');
Route::post('/checkout/place-order', [\App\Http\Controllers\Frontend\CheckoutController::class, 'placeOrder'])->name('checkout.place-order');
Route::get('/checkout/success/{orderNumber}', [\App\Http\Controllers\Frontend\CheckoutController::class, 'orderSuccess'])->name('checkout.success');
Route::get('/checkout/invoice/{orderNumber}', [\App\Http\Controllers\Frontend\CheckoutController::class, 'generateInvoice'])->name('checkout.invoice');

// Payment Routes (Centralized)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/payment/stripe/process', [\App\Http\Controllers\Frontend\StripePaymentController::class, 'processStripe'])->name('payment.stripe.process');
    Route::get('/payment/stripe/success/{orderNumber}', [\App\Http\Controllers\Frontend\StripePaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/stripe/cancel/{orderNumber}', [\App\Http\Controllers\Frontend\StripePaymentController::class, 'cancel'])->name('payment.cancel');
});

Route::post('/stripe/webhook', [\App\Http\Controllers\Frontend\StripePaymentController::class, 'handleWebhook']);

// In-store Walk-in Kiosk Routes
Route::get('/kiosk', [\App\Http\Controllers\Kiosk\RepairKioskController::class, 'showKiosk'])->name('kiosk.index');
Route::post('/kiosk/join', [\App\Http\Controllers\Kiosk\RepairKioskController::class, 'joinQueue'])->name('kiosk.join');
Route::post('/kiosk/pre-register', [\App\Http\Controllers\Kiosk\RepairKioskController::class, 'preRegisterRepair'])->name('kiosk.pre-register');
Route::get('/kiosk/check-status', [\App\Http\Controllers\Kiosk\RepairKioskController::class, 'checkStatus'])->name('kiosk.check-status');
Route::get('/kiosk/check-warranty', [\App\Http\Controllers\Kiosk\RepairKioskController::class, 'checkWarranty'])->name('kiosk.check-warranty');
Route::get('/kiosk/products', [\App\Http\Controllers\Kiosk\RepairKioskController::class, 'getProducts'])->name('kiosk.products');
Route::get('/kiosk/queue-state', [\App\Http\Controllers\Kiosk\RepairKioskController::class, 'getQueueState'])->name('kiosk.queue-state');
Route::get('/kiosk/queue-board', [\App\Http\Controllers\Kiosk\RepairKioskController::class, 'showQueueBoard'])->name('kiosk.queue-board');

require __DIR__.'/auth.php';

// PC Builder Routes
Route::prefix('pc-builder')->name('pc-builder.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Frontend\PCBuilderController::class, 'index'])->name('index');
    Route::get('/choose/{slotId}', [\App\Http\Controllers\Frontend\PCBuilderController::class, 'choose'])->name('choose');
    Route::post('/save', [\App\Http\Controllers\Frontend\PCBuilderController::class, 'saveBuild'])->name('save');
    Route::get('/shared/{uuid}', [\App\Http\Controllers\Frontend\PCBuilderController::class, 'showShared'])->name('shared');
});

Route::get('/info/{slug}', [\App\Http\Controllers\Frontend\PageController::class, 'show'])->name('frontend.pages.show');

Route::get('/offer', [\App\Http\Controllers\Frontend\OfferController::class, 'index'])->name('offers.index');
Route::get('/offer/{slug}', [\App\Http\Controllers\Frontend\OfferController::class, 'show'])->name('offers.show');

Route::get('/{slug}', [\App\Http\Controllers\Frontend\ProductController::class, 'handleSlug'])->where('slug', '.*')->name('frontend.url');
