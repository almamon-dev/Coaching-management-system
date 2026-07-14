import React from 'react';
import { Head } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import Hero from './Partials/Hero';
import StatisticsSection from './Partials/Home/StatisticsSection';
import AboutSection from './Partials/Home/AboutSection';
import NoticeBoardSection from './Partials/Home/NoticeBoardSection';
import FoundersSection from './Partials/Home/FoundersSection';
import FacultiesSection from './Partials/Home/FacultiesSection';
import UpcomingEventsSection from './Partials/Home/UpcomingEventsSection';
import CampusLifeSection from './Partials/Home/CampusLifeSection';

export default function Home({ notices = [], events = [], galleries = [] }) {
    return (
        <>
            <Head title="Lohadi High School - Enterprise School System" />

            <Hero />
            
            <StatisticsSection />
            
            <AboutSection />
            
            <NoticeBoardSection notices={notices} />
            
            <FacultiesSection />
            
            <UpcomingEventsSection events={events} />
            
            <CampusLifeSection galleries={galleries} />
            <FoundersSection />
        </>
    );
}

Home.layout = page => <FrontendLayout children={page} />;
