<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\PlaceOrderRequest;
use App\Services\Frontend\ProductService;
use App\Services\Frontend\OrderService;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class CheckoutController extends Controller
{
    protected $productService;
    protected $orderService;

    public function __construct(ProductService $productService, OrderService $orderService)
    {
        $this->productService = $productService;
        $this->orderService = $orderService;
    }

    public function index()
    {
        $headerData = $this->productService->getHeaderData();
        $primaryAddress = auth()->check() 
            ? auth()->user()->addresses()->where('is_primary', true)->first() 
            : null;

        return Inertia::render('Frontend/Checkout', array_merge($headerData, [
            'auth_user' => auth()->user(),
            'primary_address' => $primaryAddress,
        ]));
    }

    public function placeOrder(PlaceOrderRequest $request)
    {
        try {
            $order = $this->orderService->placeOrder($request->validated());

            return redirect()->route('checkout.success', $order->order_number);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to place order: ' . $e->getMessage()]);
        }
    }

    public function orderSuccess($orderNumber)
    {
        $order = Order::with(['items', 'payment'])
            ->where('order_number', $orderNumber)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $headerData = $this->productService->getHeaderData();

        return Inertia::render('Frontend/OrderSuccess', array_merge($headerData, [
            'order' => $order
        ]));
    }

    public function generateInvoice($orderNumber)
    {
        $order = Order::with(['items', 'payment'])
            ->where('order_number', $orderNumber)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $pdf = Pdf::loadView('invoices.order', compact('order'));
        
        return $pdf->download('invoice-' . $order->order_number . '.pdf');
    }
}
