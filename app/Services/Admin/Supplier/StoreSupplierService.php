<?php

namespace App\Services\Admin\Supplier;

use App\Models\Supplier;
use App\Support\Media\FileUploader;
use Illuminate\Support\Facades\DB;

class StoreSupplierService
{
    /**
     * Create a new supplier with logo and brands handling.
     */
    public function execute(array $data, $logoFile = null): Supplier
    {
        return DB::transaction(function () use ($data, $logoFile) {
            if ($logoFile) {
                $data['logo'] = FileUploader::upload('suppliers', $logoFile);
            }

            $supplier = Supplier::create($data);

            if (isset($data['brand_ids'])) {
                $supplier->brands()->sync($data['brand_ids']);
            }

            return $supplier;
        });
    }
}
