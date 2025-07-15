import React, { useState, useEffect } from 'react';
import {
    Code,
    Mail,
    GitBranch,
    Activity,
    FileText,
    Shield,
    ScrollText,
} from 'lucide-react';
import { DiscordIcon } from '../DiscordIcon';
import ChangelogModal from './ChangelogModal';

export const Footer: React.FC = () => {
    const [isChangelogOpen, setIsChangelogOpen] = useState(false);
    const [currentVersion, setCurrentVersion] = useState('Unknown');

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                const response = await fetch('/api/version');
                if (response.ok) {
                    const data = await response.json();
                    if (data.success)
                        setCurrentVersion(data.data.currentVersion);
                }
            } catch (error) {
                console.error('Failed to fetch version:', error);
            }
        };

        fetchVersion();
    }, []);

    return (
        <>
            <ChangelogModal
                isOpen={isChangelogOpen}
                onClose={() => setIsChangelogOpen(false)}
            />
            <footer className={`bg-surface border-t border-divider`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                        {/* Left Content */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant lg:justify-start justify-center">
                            <a
                                href="/about"
                                className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
                            >
                                <FileText size={14} />
                                <span>About Us</span>
                            </a>
                            <a
                                href="/privacy"
                                className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
                            >
                                <Shield size={14} />
                                <span>Privacy Policy</span>
                            </a>
                            <a
                                href="/terms"
                                className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
                            >
                                <ScrollText size={14} />
                                <span>Terms of Service</span>
                            </a>
                            <a
                                // href="mailto:contact@clubhive.com"
                                className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
                                aria-label="Contact Email"
                            >
                                <Mail size={14} />
                                <span>Contact</span>
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
                                aria-label="Discord Support"
                            >
                                <DiscordIcon size={14} />
                                <span>Discord</span>
                            </a>
                        </div>

                        {/* Right Content */}
                        <div className="flex items-center gap-3 text-sm text-on-surface-variant lg:justify-end justify-center">
                            <a
                                href="/status"
                                className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
                            >
                                <Activity size={14} />
                                <span>Status</span>
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
                                aria-label="Source Code"
                            >
                                <Code size={14} />
                                <span>Source</span>
                            </a>
                            <button
                                onClick={() => setIsChangelogOpen(true)}
                                className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                            >
                                <GitBranch size={14} />
                                <span>{currentVersion}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};
