<?php

namespace App\Exports\Reference;

use App\Models\Brand;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class BrandsExport implements FromCollection, WithHeadings, WithTitle
{
    public function collection()
    {
        return Brand::select('id', 'name')->get();
    }

    public function headings(): array
    {
        return ['ID', 'Brand Name'];
    }

    public function title(): string
    {
        return 'Brands';
    }
}
