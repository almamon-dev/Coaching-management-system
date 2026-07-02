<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promotions Report</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f6f8; font-weight: bold; }
        .header { text-align: center; margin-bottom: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>{{ ucfirst($type) }} Promotions Report</h2>
        <p>Generated on: {{ date('Y-m-d H:i:s') }}</p>
    </div>

    <table>
        <thead>
            @if($type === 'teacher')
                <tr>
                    <th>Teacher Name</th>
                    <th>Employee ID</th>
                    <th>Previous Designation</th>
                    <th>New Designation</th>
                    <th>Previous Department</th>
                    <th>New Department</th>
                    <th>Promotion Date</th>
                </tr>
            @else
                <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Previous Session</th>
                    <th>Previous Class</th>
                    <th>Previous Section</th>
                    <th>Promoted Date</th>
                </tr>
            @endif
        </thead>
        <tbody>
            @foreach($data as $row)
                @if($type === 'teacher')
                    <tr>
                        <td>{{ $row->teacherProfile->user->name ?? 'N/A' }}</td>
                        <td>{{ $row->teacherProfile->employee_id ?? 'N/A' }}</td>
                        <td>{{ $row->previous_designation ?? 'N/A' }}</td>
                        <td>{{ $row->new_designation ?? 'N/A' }}</td>
                        <td>{{ $row->previous_department ?? 'N/A' }}</td>
                        <td>{{ $row->new_department ?? 'N/A' }}</td>
                        <td>{{ $row->promotion_date ? $row->promotion_date->format('Y-m-d') : 'N/A' }}</td>
                    </tr>
                @else
                    <tr>
                        <td>{{ $row->studentProfile->user->name ?? 'N/A' }}</td>
                        <td>{{ $row->studentProfile->student_id ?? 'N/A' }}</td>
                        <td>{{ $row->academicSession->name ?? 'N/A' }}</td>
                        <td>{{ $row->academicClass->name ?? 'N/A' }}</td>
                        <td>{{ $row->section->name ?? 'N/A' }}</td>
                        <td>{{ $row->updated_at ? $row->updated_at->format('Y-m-d') : 'N/A' }}</td>
                    </tr>
                @endif
            @endforeach
        </tbody>
    </table>
</body>
</html>
