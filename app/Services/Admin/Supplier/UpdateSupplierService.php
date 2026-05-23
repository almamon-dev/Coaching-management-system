<?php
 
namespace App\Services\Admin\Supplier;
 
use App\Models\Supplier;
use App\Support\Media\FileRemover;
use App\Support\Media\FileUploader;
use Illuminate\Support\Facades\DB;
 
class UpdateSupplierService
{
    /**
     * Update an existing supplier with logo replacement and brands synchronization.
     */
    public function execute(Supplier $supplier, array $data, $logoFile = null): bool
    {
        return DB::transaction(function () use ($supplier, $data, $logoFile) {
            if ($logoFile) {
                if ($supplier->logo) {
                    FileRemover::delete($supplier->logo);
                }
                $data['logo'] = FileUploader::upload('suppliers', $logoFile);
            }
 
            if (isset($data['brand_ids'])) {
                $supplier->brands()->sync($data['brand_ids']);
            }
 
            return $supplier->update($data);
        });
    }
}
