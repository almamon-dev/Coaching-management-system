<?php

namespace App\Http\Controllers\Admin\Logistics; 

use App\Http\Controllers\Controller;
use App\Services\Admin\Logistics\LogisticsService;
use App\Observers\Logistics\ResponseObserver;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogisticsController extends Controller
{
    protected $logisticsService;
    protected $responseObserver;

    /**
     * Injecting Dependencies via Constructor
     */
    public function __construct(LogisticsService $logisticsService, ResponseObserver $responseObserver)
    {
        $this->logisticsService = $logisticsService;
        $this->responseObserver = $responseObserver;
    }

    /**
     * Display the Order Tracking page.
     * Route: admin.logistics.tracking.index
     */
    public function trackingIndex(Request $request)
    {
        $trackedOrders = $this->logisticsService->getTrackedOrders($request->all());

        return Inertia::render('Admin/Logistics/Tracking', [
            'orders' => $trackedOrders,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Display the Shipping & Delivery Configuration page.
     * Route: admin.logistics.configuration.index
     */
    public function configurationIndex()
    {
        $shippingMethods = $this->logisticsService->getShippingConfiguration();

        return Inertia::render('Admin/Logistics/ShippingConfig', [
            'shippingMethods' => $shippingMethods
        ]);
    }

    /**
     * Update Shipping Configuration (Credentials, Active Status, or Charges).
     * Route: admin.logistics.configuration.update
     */
    public function configurationUpdate(Request $request)
    {
        $this->logisticsService->updateConfiguration($request->all());

        return $this->responseObserver->redirectBackWithSuccess('Shipping configuration updated successfully.');
    }

    /**
     * Display the Returns / RMA management page.
     * Route: admin.logistics.returns.index
     */
    public function returnsIndex(Request $request)
    {
        $returnRequests = $this->logisticsService->getReturnRequests($request->all());

        return Inertia::render('Admin/Logistics/Returns', [
            'returns' => $returnRequests
        ]);
    }
}
