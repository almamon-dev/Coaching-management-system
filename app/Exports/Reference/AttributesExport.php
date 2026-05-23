<?php

namespace App\Exports\Reference;

use App\Models\Attribute;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class AttributesExport implements FromCollection, WithHeadings, WithTitle
{
    public function collection()
    {
        $data = [];
        Attribute::with('values')->get()->each(function($a) use (&$data) {
            foreach($a->values as $v) {
                $data[] = [
                    'attr_id' => $a->id,
                    'attr_name' => $a->name,
                    'value_id' => $v->id,
                    'value_name' => $v->value
                ];
            }
        });
        return collect($data);
    }

    public function headings(): array
    {
        return ['Attribute ID', 'Attribute Name', 'Value ID', 'Value Name'];
    }

    public function title(): string
    {
        return 'Attributes & Values';
    }
}
