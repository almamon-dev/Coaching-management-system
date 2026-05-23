<?php

namespace App\Repositories\Admin\Logistics;

interface LogisticsRepositoryInterface
{
    public function getPaginatedOrdersWithTracking(array $filters);
    
    public function getActiveShippingMethods();
    
    public function updateShippingSettings(array $data);
    
    public function getPaginatedReturnRequests(array $filters);
}
