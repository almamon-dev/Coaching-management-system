import React, { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import UserLayout from '@/Layouts/UserLayout';
import { Head, usePage } from '@inertiajs/react';
import { 
    Calendar, ChevronDown, Users, CheckCircle2, UserX, Clock, 
    CalendarCheck, Download, Save, PieChart as PieChartIcon,
    BookOpen, RefreshCcw
} from 'lucide-react';
import SelectInput from '@/Components/SelectInput';

// --- MOCK DATA ---
const initialStudents = [
    { id: 1, roll: '1', name: 'Ahmed Rahman', status: 'Present', time: '', remark: '', avatar: 'https://ui-avatars.com/api/?name=Ahmed+Rahman&background=0D8ABC&color=fff' },
    { id: 2, roll: '2', name: 'Sakib Hossain', status: 'Present', time: '', remark: '', avatar: 'https://ui-avatars.com/api/?name=Sakib+Hossain&background=0D8ABC&color=fff' },
    { id: 3, roll: '3', name: 'Mehedi Hasan', status: 'Absent', time: '', remark: '', avatar: 'https://ui-avatars.com/api/?name=Mehedi+Hasan&background=0D8ABC&color=fff' },
    { id: 4, roll: '4', name: 'Nusrat Jahan', status: 'Present', time: '', remark: '', avatar: 'https://ui-avatars.com/api/?name=Nusrat+Jahan&background=0D8ABC&color=fff' },
    { id: 5, roll: '5', name: 'Tanha Islam', status: 'Late', time: '09:55 AM', remark: 'Reached at 09:55 AM', avatar: 'https://ui-avatars.com/api/?name=Tanha+Islam&background=0D8ABC&color=fff' },
    { id: 6, roll: '6', name: 'Raihan Kabir', status: 'Present', time: '', remark: '', avatar: 'https://ui-avatars.com/api/?name=Raihan+Kabir&background=0D8ABC&color=fff' },
    { id: 7, roll: '7', name: 'Fahim Ahmed', status: 'Absent', time: '', remark: '', avatar: 'https://ui-avatars.com/api/?name=Fahim+Ahmed&background=0D8ABC&color=fff' },
    { id: 8, roll: '8', name: 'Asif Mahmud', status: 'Present', time: '', remark: '', avatar: 'https://ui-avatars.com/api/?name=Asif+Mahmud&background=0D8ABC&color=fff' },
];

export default function Index({ auth }) {
    const [attendanceList, setAttendanceList] = useState(initialStudents);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkDropdownOpen, setBulkDropdownOpen] = useState(false);
    
    // Filter states
    const [selectedClass, setSelectedClass] = useState('Class 10-B');
    const [selectedSubject, setSelectedSubject] = useState('Mathematics');
    const [selectedPeriod, setSelectedPeriod] = useState('2nd Period (09:45 AM)');
    
    const Layout = auth?.user?.user_type === 'admin' ? AdminLayout : UserLayout;

    // Computed Stats
    const stats = useMemo(() => {
        const total = attendanceList.length;
        const present = attendanceList.filter(s => s.status === 'Present').length;
        const absent = attendanceList.filter(s => s.status === 'Absent').length;
        const late = attendanceList.filter(s => s.status === 'Late').length;

        return {
            total,
            present,
            absent,
            late,
            presentPct: total ? ((present / total) * 100).toFixed(2) : '0.00',
            absentPct: total ? ((absent / total) * 100).toFixed(2) : '0.00',
            latePct: total ? ((late / total) * 100).toFixed(2) : '0.00'
        };
    }, [attendanceList]);


    // Handlers
    const handleStatusChange = (id, newStatus) => {
        setAttendanceList(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    const handleRemarkChange = (id, val) => {
        setAttendanceList(prev => prev.map(s => s.id === id ? { ...s, remark: val } : s));
    };

    const handleQuickAction = (action) => {
        if (action === 'Clear') {
            setAttendanceList(prev => prev.map(s => ({ ...s, status: '' })));
        } else {
            setAttendanceList(prev => prev.map(s => ({ ...s, status: action })));
        }
    };

    const handleSelectedBulkAction = (action) => {
        if (selectedIds.length === 0) return alert('Please select at least one student.');
        setAttendanceList(prev => prev.map(s => selectedIds.includes(s.id) ? { ...s, status: action } : s));
        setSelectedIds([]);
        setBulkDropdownOpen(false);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === attendanceList.length) setSelectedIds([]);
        else setSelectedIds(attendanceList.map(s => s.id));
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <Layout user={auth?.user}>
            <Head title="Mark Attendance" />

            <div className="bg-[#f8fafc] font-sans">
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div>
                        <h1 className="text-[18px] font-bold text-slate-900 tracking-tight">Mark Attendance</h1>
                        <p className="text-slate-500 text-[12px] font-medium">Select class, date and mark attendance</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded px-3 py-1.5 text-[12px] font-semibold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                            <Calendar size={14} className="text-slate-400" />
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', weekday: 'short' })}
                            <ChevronDown size={14} className="text-slate-400 ml-1" />
                        </div>
                    </div>
                </div>

                {/* --- TOP FILTERS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-0.5">Select Class</label>
                        <SelectInput 
                            icon={Users}
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="h-[42px]"
                        >
                            <option value="Class 10-A">Class 10-A</option>
                            <option value="Class 10-B">Class 10-B</option>
                            <option value="Class 9-A">Class 9-A</option>
                            <option value="Class 9-B">Class 9-B</option>
                        </SelectInput>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-0.5">Select Subject</label>
                        <SelectInput 
                            icon={BookOpen}
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="h-[42px]"
                        >
                            <option value="Mathematics">Mathematics</option>
                            <option value="English">English</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                        </SelectInput>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-0.5">Select Period</label>
                        <SelectInput 
                            icon={Clock}
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="h-[42px]"
                        >
                            <option value="1st Period (08:45 AM)">1st Period (08:45 AM)</option>
                            <option value="2nd Period (09:45 AM)">2nd Period (09:45 AM)</option>
                            <option value="3rd Period (11:30 AM)">3rd Period (11:30 AM)</option>
                            <option value="4th Period (12:30 PM)">4th Period (12:30 PM)</option>
                        </SelectInput>
                    </div>
                </div>


                {/* --- MAIN TABLE SECTION --- */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-5 flex flex-col">
                    {/* Table Header */}
                    <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h2 className="text-[14px] font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            Student Attendance
                            {selectedIds.length > 0 && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px]">{selectedIds.length} selected</span>}
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button 
                                    onClick={() => setBulkDropdownOpen(!bulkDropdownOpen)}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-blue-600 text-[11.5px] font-bold rounded hover:bg-slate-100 transition-colors"
                                >
                                    Bulk Actions <ChevronDown size={13} />
                                </button>
                                {bulkDropdownOpen && (
                                    <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 shadow-lg rounded-md overflow-hidden z-10">
                                        <button onClick={() => handleSelectedBulkAction('Present')} className="w-full text-left px-4 py-2 text-[12px] font-medium text-emerald-600 hover:bg-slate-50">Mark Present</button>
                                        <button onClick={() => handleSelectedBulkAction('Absent')} className="w-full text-left px-4 py-2 text-[12px] font-medium text-red-600 hover:bg-slate-50">Mark Absent</button>
                                        <button onClick={() => handleSelectedBulkAction('Late')} className="w-full text-left px-4 py-2 text-[12px] font-medium text-amber-600 hover:bg-slate-50">Mark Late</button>
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => handleQuickAction('Clear')}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 text-slate-600 text-[11.5px] font-bold rounded hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-colors"
                            >
                                <RefreshCcw size={13} /> Clear
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[11.5px] font-bold rounded hover:bg-blue-700 shadow-sm transition-colors">
                                <Save size={13} /> Save
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-white">
                                    <th className="py-2 pl-4 pr-3 w-[40px]">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.length === attendanceList.length && attendanceList.length > 0}
                                            onChange={toggleSelectAll}
                                            className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                        />
                                    </th>
                                    <th className="py-2 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[80px]">Roll No.</th>
                                    <th className="py-2 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[220px]">Student Name</th>
                                    <th className="py-2 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[240px]">Status</th>
                                    <th className="py-2 pr-4 pl-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Remarks (Optional)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceList.map((student) => (
                                    <tr key={student.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${selectedIds.includes(student.id) ? 'bg-blue-50/30' : ''}`}>
                                        <td className="py-2.5 pl-4 pr-3">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.includes(student.id)}
                                                onChange={() => toggleSelect(student.id)}
                                                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                            />
                                        </td>
                                        <td className="py-2.5 px-3 text-[12px] font-bold text-slate-700">{student.roll}</td>
                                        <td className="py-2.5 px-3">
                                            <div className="flex items-center gap-2.5">
                                                <img src={student.avatar} alt={student.name} className="w-6 h-6 rounded-full shadow-sm" />
                                                <span className="text-[12px] font-bold text-slate-800">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <StatusRadio status={student.status} studentId={student.id} onChange={(val) => handleStatusChange(student.id, val)} />
                                        </td>
                                        <td className="py-2.5 pr-4 pl-3">
                                            <input 
                                                type="text" 
                                                value={student.remark}
                                                onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                                                placeholder="Add remark" 
                                                className={`w-full border border-slate-200 rounded px-2.5 py-1 text-[11.5px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${student.remark ? 'text-slate-800 font-medium' : 'text-slate-400'}`}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Table Footer / Summary */}
                    <div className="bg-slate-50/50 border-t border-slate-100 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-b-xl">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-[12px]">
                                <span className="font-semibold text-slate-600">Total Students:</span>
                                <span className="font-bold text-slate-800">{stats.total}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[12px]">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="font-semibold text-slate-600">Present:</span>
                                <span className="font-bold text-emerald-700">{stats.present}</span>
                                <span className="text-slate-400 font-medium text-[10px]">({stats.presentPct}%)</span>
                            </div>
                            <div className="flex items-center gap-2 text-[12px]">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="font-semibold text-slate-600">Absent:</span>
                                <span className="font-bold text-red-700">{stats.absent}</span>
                                <span className="text-slate-400 font-medium text-[10px]">({stats.absentPct}%)</span>
                            </div>
                            <div className="flex items-center gap-2 text-[12px]">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <span className="font-semibold text-slate-600">Late:</span>
                                <span className="font-bold text-amber-700">{stats.late}</span>
                                <span className="text-slate-400 font-medium text-[10px]">({stats.latePct}%)</span>
                            </div>
                        </div>
                        <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-sm">
                            <CalendarCheck size={13} className="text-slate-400" />
                            Marked by <span className="font-bold text-slate-700 ml-0.5">{auth?.user?.name || 'Admin'}</span>
                        </div>
                    </div>
                </div>



            </div>
        </Layout>
    );
}

// --- SUB-COMPONENTS ---


function StatusRadio({ status, studentId, onChange }) {
    const options = [
        { value: 'Present', label: 'Present', activeColor: 'text-emerald-600', radioColor: 'text-emerald-500 focus:ring-emerald-500' },
        { value: 'Absent', label: 'Absent', activeColor: 'text-red-600', radioColor: 'text-red-500 focus:ring-red-500' },
        { value: 'Late', label: 'Late', activeColor: 'text-amber-600', radioColor: 'text-amber-500 focus:ring-amber-500' }
    ];

    return (
        <div className="flex items-center gap-4">
            {options.map(opt => (
                <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer group">
                    <input 
                        type="radio" 
                        name={`status-${studentId}`}
                        value={opt.value} 
                        checked={status === opt.value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-3.5 h-3.5 border-slate-300 cursor-pointer transition-all ${opt.radioColor}`}
                    />
                    <span className={`text-[11px] font-bold transition-colors ${status === opt.value ? opt.activeColor : 'text-slate-500 group-hover:text-slate-700'}`}>
                        {opt.label}
                    </span>
                </label>
            ))}
        </div>
    );
}

