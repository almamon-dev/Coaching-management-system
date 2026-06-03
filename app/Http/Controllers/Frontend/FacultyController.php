<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacultyController extends Controller
{
    private $dummyFaculties = [
        [
            'id' => 1, 
            'name' => 'Dr. Hasan Mahmud', 
            'role' => 'Head of Science', 
            'email' => 'hasan@lohadi.edu.bd', 
            'phone' => '+880 1711 000001', 
            'image' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&h=300&auto=format&fit=crop', 
            'department' => 'Science', 
            'bio' => "Dr. Hasan Mahmud has been an integral part of Lohadi High School since 2005. With a passion for uncovering the mysteries of the universe, he has dedicated over 20 years to educating young minds in Physics and Advanced Mathematics.\n\nHis interactive teaching style focuses on practical experiments and real-world applications, helping students bridge the gap between textbook theories and everyday phenomena. Under his guidance, the school's science club has won numerous regional and national science fair awards.", 
            'qualifications' => [
                [
                    'year' => '2001',
                    'degree' => 'Ph.D.',
                    'major' => 'Theoretical Physics',
                    'institution' => 'University of Dhaka'
                ],
                [
                    'year' => '1995',
                    'degree' => 'M.Sc.',
                    'major' => 'Applied Physics',
                    'institution' => 'Jahangirnagar University'
                ],
                [
                    'year' => '1993',
                    'degree' => 'B.Sc. (Hons)',
                    'major' => 'Physics',
                    'institution' => 'Jahangirnagar University'
                ],
                [
                    'year' => '2010',
                    'degree' => 'Certification',
                    'major' => 'Advanced Science Educator',
                    'institution' => 'NCTB'
                ]
            ]
        ],
        [
            'id' => 2, 
            'name' => 'Prof. Farida Yasmin', 
            'role' => 'Senior Teacher, Bengali', 
            'email' => 'farida@lohadi.edu.bd', 
            'phone' => '+880 1711 000002', 
            'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&h=300&auto=format&fit=crop', 
            'department' => 'Humanities', 
            'bio' => "Prof. Farida Yasmin is a renowned literature enthusiast and a pillar of our Humanities department. She has been teaching Bengali language and literature for over 25 years, instilling a deep appreciation for our cultural heritage in her students.\n\nBesides teaching, she is an active writer and has authored several supplementary textbooks for Bengali grammar. She frequently organizes poetry recitations and cultural programs at the school.", 
            'qualifications' => [
                [
                    'year' => '1998',
                    'degree' => 'M.A.',
                    'major' => 'Bengali Literature',
                    'institution' => 'Rajshahi University'
                ],
                [
                    'year' => '1996',
                    'degree' => 'B.A. (Hons)',
                    'major' => 'Bengali',
                    'institution' => 'Rajshahi University'
                ],
                [
                    'year' => '2005',
                    'degree' => 'Diploma',
                    'major' => 'Recitation and Performing Arts',
                    'institution' => 'Shilpakala Academy'
                ]
            ]
        ],
        [
            'id' => 3, 
            'name' => 'Mr. Jamal Uddin', 
            'role' => 'Teacher, Mathematics', 
            'email' => 'jamal@lohadi.edu.bd', 
            'phone' => '+880 1711 000003', 
            'image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&h=300&auto=format&fit=crop', 
            'department' => 'Science', 
            'bio' => "Mr. Jamal Uddin specializes in making complex mathematical concepts accessible and enjoyable for high school students. Known for his patience and clear instructional methods, he helps students overcome their fear of math.\n\nHe has developed custom worksheet programs tailored to different learning paces and regularly conducts after-school tutoring sessions for students preparing for board exams.", 
            'qualifications' => [
                [
                    'year' => '2012',
                    'degree' => 'M.Sc.',
                    'major' => 'Mathematics',
                    'institution' => 'Jagannath University'
                ],
                [
                    'year' => '2010',
                    'degree' => 'B.Sc. (Hons)',
                    'major' => 'Mathematics',
                    'institution' => 'Jagannath University'
                ],
                [
                    'year' => '2014',
                    'degree' => 'B.Ed.',
                    'major' => 'Education',
                    'institution' => 'National University'
                ]
            ]
        ],
        [
            'id' => 4, 
            'name' => 'Mrs. Salma Khatun', 
            'role' => 'Head of Business Studies', 
            'email' => 'salma@lohadi.edu.bd', 
            'phone' => '+880 1711 000004', 
            'image' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&h=300&auto=format&fit=crop', 
            'department' => 'Business Studies', 
            'bio' => "Mrs. Salma Khatun brings valuable real-world corporate experience into her classroom, effectively bridging the gap between academic theory and modern business practices.\n\nBefore joining the education sector, she worked in the finance department of a multinational corporation. She leverages this background to teach students the practical fundamentals of accounting, management, and entrepreneurship.", 
            'qualifications' => [
                [
                    'year' => '2008',
                    'degree' => 'MBA',
                    'major' => 'Finance',
                    'institution' => 'Institute of Business Administration (IBA)'
                ],
                [
                    'year' => '2005',
                    'degree' => 'BBA',
                    'major' => 'Accounting & Information Systems',
                    'institution' => 'Dhaka University'
                ],
                [
                    'year' => '2010',
                    'degree' => 'CPA Part-1',
                    'major' => 'Professional Accounting',
                    'institution' => 'ICAB'
                ]
            ]
        ],
        [
            'id' => 5, 
            'name' => 'Mr. Rafiqul Islam', 
            'role' => 'Sports Instructor', 
            'email' => 'rafiq@lohadi.edu.bd', 
            'phone' => '+880 1711 000005', 
            'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&auto=format&fit=crop', 
            'department' => 'Physical Education', 
            'bio' => "A former national-level athlete, Mr. Rafiqul Islam is the driving force behind Lohadi High School's athletic achievements. He believes that physical fitness is crucial for academic success and mental well-being.\n\nUnder his rigorous yet encouraging coaching, the school football and athletics teams have secured numerous regional and district-level championships. He also coordinates the annual school sports day.", 
            'qualifications' => [
                [
                    'year' => '2015',
                    'degree' => 'M.P.Ed.',
                    'major' => 'Physical Education',
                    'institution' => 'Uttara University'
                ],
                [
                    'year' => '2012',
                    'degree' => 'B.P.Ed.',
                    'major' => 'Physical Education',
                    'institution' => 'National University'
                ],
                [
                    'year' => '2016',
                    'degree' => 'Diploma',
                    'major' => 'Sports Psychology',
                    'institution' => 'BKSP'
                ]
            ]
        ],
        [
            'id' => 6, 
            'name' => 'Dr. Amina Begum', 
            'role' => 'Teacher, English', 
            'email' => 'amina@lohadi.edu.bd', 
            'phone' => '+880 1711 000006', 
            'image' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&h=300&auto=format&fit=crop', 
            'department' => 'Humanities', 
            'bio' => "Dr. Amina Begum is a passionate linguist and educator who focuses on enhancing students' English communication, comprehension, and creative writing skills.\n\nHer classes are highly interactive, incorporating modern multimedia tools, group discussions, and public speaking exercises to build students' confidence in English. She also leads the school's English Debate Club.", 
            'qualifications' => [
                [
                    'year' => '2019',
                    'degree' => 'Ph.D.',
                    'major' => 'Applied Linguistics',
                    'institution' => 'BRAC University'
                ],
                [
                    'year' => '2014',
                    'degree' => 'M.A.',
                    'major' => 'English Literature',
                    'institution' => 'Dhaka University'
                ],
                [
                    'year' => '2012',
                    'degree' => 'B.A. (Hons)',
                    'major' => 'English',
                    'institution' => 'Dhaka University'
                ],
                [
                    'year' => '2020',
                    'degree' => 'CELTA',
                    'major' => 'English Teaching',
                    'institution' => 'Cambridge Assessment'
                ]
            ]
        ]
    ];

    public function index()
    {
        return Inertia::render('Frontend/Faculties/Index', [
            'faculties' => $this->dummyFaculties
        ]);
    }

    public function show($id)
    {
        $faculty = collect($this->dummyFaculties)->firstWhere('id', (int) $id);
        
        if (!$faculty) {
            abort(404, 'Faculty not found');
        }

        return Inertia::render('Frontend/Faculties/Show', [
            'faculty' => $faculty
        ]);
    }
}
