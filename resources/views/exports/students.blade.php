<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Report</title>
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
        <h2>Student Report</h2>
        <p>Generated on: {{ date('Y-m-d H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Gender</th>
                <th>Blood Group</th>
                <th>Session</th>
                <th>Class</th>
                <th>Section</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $row)
                <tr>
                    <td>{{ $row->studentProfile->user->name ?? 'N/A' }}</td>
                    <td>{{ $row->studentProfile->student_id ?? 'N/A' }}</td>
                    <td>{{ ucfirst($row->studentProfile->gender ?? 'N/A') }}</td>
                    <td>{{ $row->studentProfile->blood_group ?? 'N/A' }}</td>
                    <td>{{ $row->academicSession->name ?? 'N/A' }}</td>
                    <td>{{ $row->academicClass->name ?? 'N/A' }}</td>
                    <td>{{ $row->section->name ?? 'N/A' }}</td>
                    <td>{{ ucfirst($row->status ?? 'N/A') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
