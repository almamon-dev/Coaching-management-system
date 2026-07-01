import React from 'react';
import { BookOpen, Users, Award, Calendar } from 'lucide-react';

export default function StatisticsSection() {
    return (
        <section className="py-4 bg-[#15803d] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-between items-end px-10">
                <BookOpen size={120} className="mb-4" />
                <Users size={150} className="mb-4" />
                <Award size={100} className="mb-8" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-8xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">

                    {/* Stat 1 */}
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-2 hover:bg-white hover:text-[#15803d] transition-colors duration-300">
                            <Users size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold font-serif mb-1">7000+</h3>
                        <p className="text-[11px] font-semibold tracking-wide uppercase">Students</p>
                    </div>

                    {/* Stat 2 */}
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-2 hover:bg-white hover:text-[#15803d] transition-colors duration-300">
                            <BookOpen size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold font-serif mb-1">300+</h3>
                        <p className="text-[11px] font-semibold tracking-wide uppercase">Faculty</p>
                    </div>

                    {/* Stat 3 */}
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-2 hover:bg-white hover:text-[#15803d] transition-colors duration-300">
                            <Award size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold font-serif mb-1">8000+</h3>
                        <p className="text-[11px] font-semibold tracking-wide uppercase">Alumni</p>
                    </div>

                    {/* Stat 4 */}
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-2 hover:bg-white hover:text-[#15803d] transition-colors duration-300">
                            <Calendar size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold font-serif mb-1">50+</h3>
                        <p className="text-[11px] font-semibold tracking-wide uppercase">Active Clubs</p>
                    </div>

                </div>
            </div>
        </section>
    );
}
