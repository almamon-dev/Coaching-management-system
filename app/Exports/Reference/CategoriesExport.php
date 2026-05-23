<?php

namespace App\Exports\Reference;

use App\Models\Category;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class CategoriesExport implements FromCollection, WithHeadings, WithTitle
{
    public function collection()
    {
        $categories = Category::with(['parent.parent'])->get();
        
        return $categories->map(function($category) {
            $level = 'Main Category';
            if ($category->parent) {
                $level = $category->parent->parent ? 'Sub-Sub Category' : 'Sub Category';
            }

            return [
                'id'          => $category->id,
                'name'        => $category->name,
                'level'       => $level,
                'parent_name' => $category->parent->name ?? 'N/A',
            ];
        });
    }

    public function headings(): array
    {
        return ['ID', 'Name', 'Level', 'Parent Name'];
    }

    public function title(): string
    {
        return 'Categories';
    }
}
