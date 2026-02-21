import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { SharedHeader } from '@shared/components/SharedHeader';
import { SharedFooter } from '@shared/components/SharedFooter';
import { ThemeToggle } from '../components/ThemeToggle';
import { LoginButton } from '../components/LoginButton';

const PrivacyPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                <SharedHeader
                    currentRoute="algo"
                    onNavigate={(route) => navigate(route)}
                    ThemeToggleComponent={ThemeToggle}
                    LoginButtonComponent={LoginButton}
                />
            </div>

            <div className="max-w-3xl mx-auto w-full px-8 pb-16 space-y-10">
                {/* Hero */}
                <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                            <Shield size={24} />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: February 2026</p>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        Codenium is committed to protecting your privacy. This policy explains what data
                        we collect, why we collect it, and how you can control it. It applies to all
                        sections of the platform, including Algo and System Design.
                    </p>
                </div>

                <Section title="1. What we collect">
                    <ul className="space-y-3 text-slate-600 dark:text-slate-400 list-disc list-inside leading-relaxed">
                        <li><strong>Account data</strong> — name, email address, and profile picture from your Google account when you sign in.</li>
                        <li><strong>Progress data</strong> — which problems you have solved, attempted, or saved as drafts.</li>
                        <li><strong>Activity data</strong> — page views, problems opened, code runs, and tab interactions, used to improve the platform.</li>
                        <li><strong>Location data</strong> — approximate city and country derived from your IP address, stored as an anonymised hash. Collected once per login, not on every request.</li>
                        <li><strong>Session data</strong> — browser session duration and device type for analytics purposes.</li>
                    </ul>
                </Section>

                <Section title="2. How we use your data">
                    <ul className="space-y-3 text-slate-600 dark:text-slate-400 list-disc list-inside leading-relaxed">
                        <li>To save and sync your progress across devices.</li>
                        <li>To personalise your experience (e.g. remembering your preferred language or theme).</li>
                        <li>To understand how the platform is used and improve it.</li>
                        <li>We do <strong>not</strong> sell your data to third parties.</li>
                        <li>We do <strong>not</strong> use your data for advertising.</li>
                    </ul>
                </Section>

                <Section title="3. Data storage">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Your data is stored in Supabase (PostgreSQL), hosted on AWS. Data is encrypted at
                        rest and in transit. We apply row-level security so each user can only access their
                        own data.
                    </p>
                </Section>

                <Section title="4. Third-party services">
                    <ul className="space-y-3 text-slate-600 dark:text-slate-400 list-disc list-inside leading-relaxed">
                        <li><strong>Google OAuth</strong> — used for authentication only. We receive your basic profile; we do not request access to any other Google services.</li>
                        <li><strong>YouTube</strong> — explanatory videos embedded on problem pages and in the System Design section are served by YouTube. When you watch a video, YouTube may collect data under its own <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</a>. We use YouTube's privacy-enhanced embed mode where supported.</li>
                        <li><strong>Vercel Analytics</strong> — anonymous, aggregate page-view metrics. No cookies.</li>
                        <li><strong>OpenAI</strong> — your code and problem context may be sent to OpenAI when you use the AI Tutor feature. OpenAI's data usage policy applies.</li>
                    </ul>
                </Section>

                <Section title="5. Your rights">
                    <ul className="space-y-3 text-slate-600 dark:text-slate-400 list-disc list-inside leading-relaxed">
                        <li>You may decline analytics tracking when prompted on first visit.</li>
                        <li>You may request deletion of your account and all associated data by contacting us.</li>
                        <li>You may export your progress data at any time from your account settings.</li>
                    </ul>
                </Section>

                <Section title="6. Contact">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Questions about this policy? Reach out at{' '}
                        <a href="mailto:privacy@codenium.vercel.app" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                            privacy@codenium.vercel.app
                        </a>.
                    </p>
                </Section>
            </div>

            <SharedFooter />
        </div>
    );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                {title}
            </h2>
            {children}
        </div>
    );
}

export default PrivacyPage;
