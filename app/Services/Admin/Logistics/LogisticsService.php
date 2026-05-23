<?php

namespace App\Services\Admin\Logistics;

use App\Repositories\Admin\Logistics\LogisticsRepositoryInterface;

class LogisticsService
{
    protected $logisticsRepo;

    public function __construct(LogisticsRepositoryInterface $logisticsRepo)
    {
        $this->logisticsRepo = $logisticsRepo;
    }

    public function getTrackedOrders(array $filters)
    {
        // Business logic for processing or mutating request filters can go here
        return $this->logisticsRepo->getPaginatedOrdersWithTracking($filters);
    }

    public function getShippingConfiguration()
    {
        return $this->logisticsRepo->getActiveShippingMethods();
    }

    public function updateConfiguration(array $data)
    {
        // Add business validation logic here if required
        return $this->logisticsRepo->updateShippingSettings($data);
    }

    public function getReturnRequests(array $filters)
    {
        return $this->logisticsRepo->getPaginatedReturnRequests($filters);
    }
}
