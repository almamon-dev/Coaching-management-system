import React from 'react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export default function PrivacyPolicy() {
    const { categories, brands } = usePage().props;

    return (
        <FrontendLayout categories={categories} brands={brands}>
            <Head title="Privacy Policy" />

            <div className="w-full bg-white min-h-[60vh]">
                {/* Breadcrumb */}
                <div className="py-4">
                    <div className="container mx-auto px-4 flex items-center gap-2 text-[13px]">
                        <Link href="/" className="text-gray-600 hover:text-[#4f46e5] px-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                        </Link>
                        <ChevronRight size={14} className="text-gray-300" />
                        <span className="text-gray-400">Privacy Policy</span>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-full mx-auto bg-white p-9">
                        <div className="text-[#333] text-[13px] leading-[1.8] space-y-6">
                            <h1 className="text-[18px] font-bold border-b border-gray-200 pb-2 mb-4">Privacy Policy of Star Tech Ltd.</h1>

                            <p>This privacy policy has been compiled to better serve those who are concerned with how their 'Personally Identifiable Information' (PII) is being used online. PII, as used in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.</p>

                            <div>
                                <h2 className="text-[14px] font-bold mb-2">What personal information do we collect from the people that visit our website or blog?</h2>
                                <p>When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, mailing address, phone number or other details to help you with your experience.</p>
                            </div>

                            <div>
                                <h2 className="text-[14px] font-bold mb-2">When do we collect information?</h2>
                                <p>We collect information from you when you subscribe to a newsletter, respond to a survey, fill out a form or enter information on our site.</p>
                            </div>

                            <div>
                                <h2 className="text-[14px] font-bold mb-2">How do we use your information?</h2>
                                <p>We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>To personalize user's experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
                                    <li>To improve our website in order to better serve you.</li>
                                    <li>To administer a contest, promotion, survey or other site feature.</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-[14px] font-bold mb-2">How do we protect visitor information?</h2>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>We do not use vulnerability scanning and/or scanning to PCI standards. We use regular Malware Scanning.</li>
                                    <li>We do not use an SSL certificate.</li>
                                    <li>We do not need an SSL. Because, We only provide articles, products, articles, and information.</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-[14px] font-bold mb-2">User Responsibility & External Risks:</h2>
                                <p>We strongly recommend that all users of Star Tech Ltd. use strong and unique passwords for their accounts to help ensure maximum security and prevent unauthorized access.</p>
                                <p>Users are solely responsible for maintaining the confidentiality of their account credentials, including passwords. We shall not be held liable for any loss or damage arising from failure to safeguard account information.</p>
                                <p>In the event of a data breach originating from third-party platforms, services, or external sources beyond our control, we shall not be held responsible for any resulting impact on user data.</p>
                            </div>

                            <div>
                                <h2 className="text-[14px] font-bold mb-2">Do we use 'cookies'?</h2>
                                <p>Yes, but we do not use cookies for tracking purposes. You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser (like Internet Explorer) settings. Each browser is a little different, so look at your browser's Help menu to learn the correct way to modify your cookies.</p>
                                <p>If users disable cookies in their browser, If you disable cookies, some features will be disabled. It will make your site experience more efficient and some of our services will not function properly.</p>
                                <p>However, you can still browse our website.</p>
                            </div>

                            <div>
                                <h2 className="text-[14px] font-bold mb-2">Google</h2>
                                <p>Google's advertising requirements can be summed up by Google's Advertising Principles. They are put in place to provide a positive experience for users. <Link href="#" className="text-[#4f46e5]">Visit Here</Link></p>
                                <p>Google, as a third party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on their visit to our site and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.</p>
                                <p className="font-bold mt-2">We have implemented the following:</p>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>Remarketing with Google AdSense</li>
                                    <li>Google Display Network Impression Reporting</li>
                                    <li>Demographics and Interests Reporting</li>
                                    <li>DoubleClick Platform Integration</li>
                                </ul>
                                <p className="mt-2">We along with third-party vendors, such as Google use first-party cookies (such as the Google Analytics cookies) and third-party cookies (such as the DoubleClick cookie) or other third-party identifiers together to compile data regarding user interactions with ad impressions, and other ad service functions as they relate to our website.</p>
                                <p className="mt-2"><strong>Opting out:</strong> Users can set preferences for how Google advertises to you using the Google Ad Settings page. Alternatively, you can opt out by visiting the Network Advertising initiative opt out page or permanently using the Google Analytics Opt Out Browser add-on.</p>
                            </div>

                            <div>
                                <h2 className="text-[14px] font-bold mb-2">California Online Privacy Protection Act</h2>
                                <p>CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law's reach stretches well beyond California to require a person or company in the United States (and conceivably the world) that operates websites collecting personally identifiable information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those individuals with whom it is being shared, and to comply with this policy. - See more at: <Link href="#" className="text-[#4f46e5]">http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRb751.dpuf</Link></p>
                                <p className="mt-2">According to CalOPPA we agree to the following:</p>
                                <p>Users can visit our site anonymously. Once this privacy policy is created, we will add a link to it on our home page, or as a minimum on the first significant page after entering our website. Our Privacy Policy link includes the word 'Privacy', and can be easily be found on the page specified above.</p>
                                <p>Users will be notified of any privacy policy changes On our Privacy Policy Page. Users are able to change their personal information by emailing us or by logging in to their account.</p>
                            </div>

                            <div>
                                <h2 className="text-[14px] font-bold mb-2">How does our site handle do not track signals?</h2>
                                <p>We honor do not track signals and do not track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place.</p>
                            </div>

                            <div>
                                <h2 className="text-[14px] font-bold mb-2">Does our site allow third party behavioral tracking?</h2>
                                <p>It's also important to note that we allow third party behavioral tracking.</p>
                            </div>

                            <div>
                                <h2 className="text-[14px] font-bold mb-2">COPPA (Children Online Privacy Protection Act)</h2>
                                <p>When it comes to the collection of personal information from children under 13, the Children's Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, the nation's consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children's privacy and safety online. We do not specifically market to children under 13.</p>
                            </div>

                            <div>
                                <h2 className="text-[14px] font-bold mb-2">Fair Information Practices</h2>
                                <p>The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information.</p>
                                <p className="mt-2">In order to be in line with Fair Information Practices we will notify the users via email within 7 business days, if a data breach occurs. We also agree to the individual redress principle, which requires that individuals have a right to pursue legally enforceable rights against data collectors and processors who fail to adhere to the law. This principle requires not only that individuals have enforceable rights against data users, but also that individuals have recourse to courts or a government agency to investigate and/or prosecute non-compliance by data processors.</p>
                            </div>

                            <div>
                                <h2 className="text-[14px] font-bold mb-2">CAN SPAM Act:</h2>
                                <p>The CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements for commercial messages, gives recipients the right to have emails stopped from being sent to them, and spells out tough penalties for violations. We collect your email address in order to deliver fresh content.</p>
                                <p className="mt-2">To be in accordance with CANSPAM we agree to the following: If at any time you would like to unsubscribe from receiving future emails, you can email us at webmaster@startech.com.bd and we will promptly remove you from ALL correspondence.</p>
                            </div>

                            <div className="pt-8 border-t border-gray-200 text-center">
                                <h2 className="text-[16px] font-bold mb-4">Contacting Us</h2>
                                <p>If there are any questions regarding this privacy policy you may contact us using the information below.</p>
                                <p className="font-bold mt-2">Star Tech Ltd.</p>
                                <p>8th Floor, 28 Kazi Nazrul Islam Ave,</p>
                                <p>Navana Zohura Square, Dhaka 1000.</p>
                                <p className="font-bold text-[#4f46e5] mt-2">Phone: 16793 or 09678002003</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
