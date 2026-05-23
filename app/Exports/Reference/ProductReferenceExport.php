<?php

namespace App\Exports\Reference;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ProductReferenceExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            new CategoriesExport(),
            new BrandsExport(),
            new AttributesExport(),
        ];
    }
}
