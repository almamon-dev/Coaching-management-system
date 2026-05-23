<?php
 
namespace App\Http\Controllers\User;
 
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StorePaymentMethodRequest;
use App\Http\Resources\User\AddressResource;
use App\Http\Resources\User\PaymentMethodResource;
use App\Http\Resources\User\ReviewResource;
use App\Models\Order;
use App\Models\Address;
use App\Models\PaymentMethod;  
use App\Services\User\Address\AddressService;
use App\Services\User\PaymentMethod\PaymentMethodService;
use App\Services\User\Review\ReviewService;
use App\Services\User\Wishlist\WishlistService;
use Inertia\Inertia;
 
class DashboardController extends Controller
{
    protected $paymentService;
    protected $reviewService;
    protected $addressService;
    protected $wishlistService;
 
    public function __construct(
        PaymentMethodService $paymentService,
        ReviewService $reviewService,
        AddressService $addressService,
        WishlistService $wishlistService
    ) {
        $this->paymentService = $paymentService;
        $this->reviewService = $reviewService;
        $this->addressService = $addressService;
        $this->wishlistService = $wishlistService;
    }
 
    public function index()
    {
        $user = auth()->user();
        
        $totalOrders = Order::where('user_id', $user->id)->count();
        $pendingOrders = Order::where('user_id', $user->id)->where('status', 'pending')->count();
        
        $recentOrders = Order::query()
            ->select(['order_number', 'total_amount', 'status', 'created_at'])
            ->where('user_id', $user->id)
            ->latest()
            ->take(3)
            ->get()
            ->map(fn($order) => [
                'id' => $order->order_number,
                'date' => $order->created_at->format('Y-m-d'),
                'amount' => (float) $order->total_amount,
                'status' => ucfirst($order->status),
            ]);

        return Inertia::render('User/Dashboard/Overview', [
            'stats' => [
                'total_orders' => $totalOrders,
                'wishlist_count' => $user->wishlists()->count(),
                'points' => $user->points ?? 0,
                'pending_orders' => $pendingOrders,
            ],
            'primary_address' => $user->addresses()
                ->select(['id', 'user_id', 'type', 'address', 'area', 'city', 'post_code'])
                ->where('is_primary', true)
                ->first(),
            'recent_orders' => $recentOrders,
        ]);

    }
 
    public function orders()
    {
        return Inertia::render('User/Dashboard/Orders', [
            'orders' => Order::query()
                ->select(['id', 'order_number', 'total_amount', 'status', 'created_at'])
                ->with(['payment:id,order_id,status'])
                ->withCount('items')
                ->where('user_id', auth()->id())
                ->latest()
                ->paginate(10)
                ->through(fn($order) => [
                    'id' => $order->order_number,
                    'date' => $order->created_at->format('Y-m-d'),
                    'amount' => (float) $order->total_amount,
                    'status' => ucfirst($order->status),
                    'payment_status' => $order->payment ? ucfirst($order->payment->status) : 'Pending',
                    'items_count' => $order->items_count,
                ]),


        ]);
    }

    public function trackOrder($orderNumber)
    {
        $order = Order::with(['items.returnRequest', 'payment'])
            ->where('order_number', $orderNumber)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return Inertia::render('User/Dashboard/OrderTracking', [
            'order' => $order,
        ]);
    }

    public function cancelOrder($orderNumber)
    {
        $order = Order::query()
            ->where('order_number', $orderNumber)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        if (strtolower($order->status) !== 'pending') {
            return back()->with('error', 'Only pending orders can be cancelled.');
        }

        $order->update([
            'status' => 'cancelled',
        ]);

        if ($order->payment) {
            $order->payment->update([
                'status' => 'failed',
            ]);
        }

        return back()->with('success', 'Order has been cancelled successfully.');
    }

    public function wishlist()
    {
        return Inertia::render('User/Dashboard/Wishlist', [
            'wishlist' => $this->wishlistService->getUserWishlist()->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'image' => $product->primaryImage ? $product->primaryImage->full_url : null,
                'price' => $product->price,
                'in_stock' => $product->status == 1,
            ]),
        ]);
    }

    public function removeWishlist($productId)
    {
        $this->wishlistService->remove($productId);
        return back()->with('success', 'Product removed from wishlist.');
    }
 
    public function reviews()
    {
        $reviews = $this->reviewService->getUserReviews();
 
        return Inertia::render('User/Dashboard/Reviews', [
            'reviews' => ReviewResource::collection($reviews),
        ]);
    }
 
    public function addresses()
    {
        $addresses = $this->addressService->getUserAddresses();
 
        return Inertia::render('User/Dashboard/Addresses', [
            'addresses' => AddressResource::collection($addresses),
        ]);
    }

    public function storeAddress(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'name' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'area' => 'nullable|string',
            'post_code' => 'nullable|string',
            'is_primary' => 'nullable|boolean',
        ]);

        $this->addressService->store($validated);

        return back()->with('success', 'Address added successfully.');
    }

    public function updateAddress(\Illuminate\Http\Request $request, Address $address)
    {
        if ($address->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'type' => 'required|string',
            'name' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'area' => 'nullable|string',
            'post_code' => 'nullable|string',
            'is_primary' => 'nullable|boolean',
        ]);

        $this->addressService->update($address, $validated);

        return back()->with('success', 'Address updated successfully.');
    }

    public function deleteAddress(Address $address)
    {
        if ($address->user_id !== auth()->id()) {
            abort(403);
        }

        $this->addressService->delete($address);

        return back()->with('success', 'Address deleted successfully.');
    }
 
    public function paymentMethods()
    {
        $cards = $this->paymentService->getUserPaymentMethods();
 
        return Inertia::render('User/Dashboard/PaymentMethods', [
            'cards' => PaymentMethodResource::collection($cards),
        ]);
    }
 
    public function storePaymentMethod(StorePaymentMethodRequest $request)
    {
        $this->paymentService->store($request->validated());
 
        return back()->with('success', 'Card added successfully.');
    }
 
    public function security()
    {
        return Inertia::render('User/Dashboard/Security', [
            'two_factor_enabled' => false,
            'last_login' => [
                'date' => '2026-05-11 10:45:12',
                'device' => 'Chrome on Windows 11',
                'ip' => '103.120.45.12',
            ],
        ]);
    }

    public function notifications()
    {
        $notifications = auth()->user()->notifications()->paginate(15);
        
        return Inertia::render('User/Dashboard/Notifications', [
            'notifications' => $notifications,
        ]);
    }

    public function markNotificationsAsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();
        
        // Clear cached notification data to keep it in sync instantly
        \Illuminate\Support\Facades\Cache::forget("user_notifications_" . auth()->id());
        \Illuminate\Support\Facades\Cache::forget("user_notifications_count_" . auth()->id());

        return back()->with('success', 'All notifications marked as read.');
    }
}
