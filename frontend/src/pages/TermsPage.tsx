import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { SharedHeader } from '@shared/components/SharedHeader';
import { SharedFooter } from '@shared/components/SharedFooter';
import { ThemeToggle } from '../components/ThemeToggle';
import { LoginButton } from '../components/LoginButton';

const TermsPage: React.FC = () => {
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
                        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <FileText size={24} />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: February 2026</p>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        By using Codenium you agree to these terms. Please read them carefully.
                        These terms apply to all sections of the platform, including Algo and System Design.
                    </p>
                </div>

                <Section title="1. Acceptance of terms">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        By accessing or using Codenium ("the Service") you agree to be bound by these
                        Terms of Service. If you do not agree, please do not use the Service.
                    </p>
                </Section>

                <Section title="2. Use of the service">
                    <ul className="space-y-3 text-slate-600 dark:text-slate-400 list-disc list-inside leading-relaxed">
                        <li>Codenium is provided for personal, non-commercial, educational use.</li>
                        <li>You must be at least 13 years old to create an account.</li>
                        <li>You are responsible for maintaining the security of your Google account credentials.</li>
                        <li>You may not use the Service to distribute spam, malware, or harmful content.</li>
                        <li>You may not attempt to reverse-engineer, scrape, or abuse the Service's APIs.</li>
                    </ul>
                </Section>

                <Section title="3. Intellectual property">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Problem statements and test cases are sourced from or inspired by{' '}
                        <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">LeetCode</a>{' '}
                        and used for educational purposes. System design content is inspired by publicly
                        available resources such as engineering blogs and the{' '}
                        <a href="https://github.com/donnemartin/system-design-primer" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">System Design Primer</a>.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
                        Explanatory videos embedded throughout the Algo and System Design sections are
                        hosted on YouTube and remain the property of their respective creators. Codenium
                        embeds these videos under YouTube's Terms of Service for educational purposes only.
                        We do not claim ownership of any embedded video content.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
                        Codenium's own explanations, visualisations, and platform code are owned by Codenium.
                        You may not reproduce them without permission. Code you write in the playground is
                        yours; by saving it you grant Codenium a non-exclusive licence to store it for
                        progress sync.
                    </p>
                </Section>

                <Section title="4. Disclaimers">
                    <ul className="space-y-3 text-slate-600 dark:text-slate-400 list-disc list-inside leading-relaxed">
                        <li>The Service is provided "as is" without warranty of any kind.</li>
                        <li>We do not guarantee the correctness or completeness of any solution or explanation.</li>
                        <li>We are not responsible for interview outcomes based on using this platform.</li>
                    </ul>
                </Section>

                <Section title="5. Limitation of liability">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Codenium shall not be liable for any indirect, incidental, or consequential damages
                        arising from your use of the Service. Our maximum liability is limited to the amount
                        you paid us in the past 12 months (if any).
                    </p>
                </Section>

                <Section title="6. Termination">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        We reserve the right to suspend or terminate accounts that violate these terms,
                        with or without notice. You may delete your account at any time.
                    </p>
                </Section>

                <Section title="7. Changes to terms">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        We may update these terms from time to time. Continued use of the Service after
                        changes constitutes acceptance of the new terms. Material changes will be
                        communicated via the in-app consent prompt.
                    </p>
                </Section>

                <Section title="8. Contact">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Questions? Reach out at{' '}
                        <a href="mailto:legal@codenium.vercel.app" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                            legal@codenium.vercel.app
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

export default TermsPage;
