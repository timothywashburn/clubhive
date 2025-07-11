import React from 'react';
import {
    Code,
    Mail,
    GitBranch,
    Activity,
    FileText,
    Shield,
    ScrollText,
} from 'lucide-react';

export const Footer: React.FC = () => {
    return (
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
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
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
                        <a
                            href="/changelog"
                            className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
                        >
                            <GitBranch size={14} />
                            <span>v1.0.0</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
