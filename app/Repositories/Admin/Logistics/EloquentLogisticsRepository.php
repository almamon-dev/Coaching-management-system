<?php

namespace App\Repositories\Admin\Logistics;

use App\Models\Order;
use App\Models\OrderReturn;
use App\Models\ShippingMethod;

class EloquentLogisticsRepository implements LogisticsRepositoryInterface
{
    public function getPaginatedOrdersWithTracking(array $filters)
    {
        $query = Order::with(['user', 'shippingAddress']); // Eager loading for ultra speed

        if (!empty($filters['search'])) {
            $query->where('order_number', 'like', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate(15);
    }

    public function getActiveShippingMethods()
    {
        return ShippingMethod::where('is_active', true)->get();
    }

    public function updateShippingSettings(array $data)
    {
        // Logic to update settings/credentials based on the courier type
        return ShippingMethod::where('provider', $data['provider'])->update([
            'api_credentials' => json_encode($data['credentials']),
            'charge' => $data['charge']
        ]);
    }

    public function getPaginatedReturnRequests(array $filters)
    {
        return OrderReturn::with(['order', 'user', 'item', 'product'])->latest()->paginate(15);
    }
}
