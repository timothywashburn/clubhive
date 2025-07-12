import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, stagger } from 'framer-motion';
import {
    X,
    FileText,
    Calendar,
    Bug,
    Plus,
    GitBranch,
    Minus,
    Settings,
    Edit2,
} from 'lucide-react';

interface ChangelogVersion {
    version: string;
    date: string;
    changes: {
        type: 'added' | 'changed' | 'removed' | 'fixed' | 'misc';
        text: string;
    }[];
}

interface ChangelogModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
    const [changelogVersions, setChangelogVersions] = useState<
        ChangelogVersion[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchChangelog();
        }
    }, [isOpen]);

    const fetchChangelog = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/changelog');
            if (!response.ok) {
                throw new Error('Failed to fetch changelog');
            }

            const data = await response.json();
            if (data.success) {
                setChangelogVersions(data.data.versions);
            } else {
                throw new Error(
                    data.error?.message || 'Failed to fetch changelog'
                );
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackdropClick = () => {
        onClose();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const getChangeIcon = (type: string) => {
        switch (type) {
            case 'added':
                return (
                    <Plus size={14} className="text-success flex-shrink-0" />
                );
            case 'changed':
                return (
                    <Edit2 size={14} className="text-blue-500 flex-shrink-0" />
                );
            case 'removed': // TODO: address this hard coded color at some point
                return (
                    <Minus size={14} className="text-red-500 flex-shrink-0" />
                );
            case 'fixed':
                return <Bug size={14} className="text-warning flex-shrink-0" />;
            case 'misc':
            default:
                return (
                    <Settings
                        size={14}
                        className="text-on-surface-variant flex-shrink-0"
                    />
                );
        }
    };

    const sortChanges = (changes: ChangelogVersion['changes']) => {
        const order = ['added', 'changed', 'removed', 'fixed', 'misc'];
        return [...changes].sort((a, b) => {
            const aIndex = order.indexOf(a.type);
            const bIndex = order.indexOf(b.type);
            return (
                (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
            );
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        onClick={handleBackdropClick}
                    />

                    <motion.div
                        className="relative bg-surface border border-outline rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-divider">
                            <div className="flex items-center flex-wrap">
                                <div className="flex items-center gap-2">
                                    <FileText
                                        size={20}
                                        className="text-primary"
                                    />
                                    <h2 className="text-xl font-semibold text-on-surface">
                                        Recent Changes
                                    </h2>
                                </div>
                                <span className="text-sm text-on-surface-variant ml-4">
                                    Last 6 months •{' '}
                                    <a
                                        href="https://gitlab.com/sdsc-rds/summer-internships/rds-interns-su25/team-hexagon/centralized-club-system"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        View full changelog
                                    </a>
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-on-surface-variant hover:text-on-surface transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5 overflow-y-auto max-h-[60vh]">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-on-surface-variant">
                                        Loading changelog...
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-error text-center">
                                        <p>Failed to load changelog</p>
                                        <p className="text-sm text-on-surface-variant mt-2">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            ) : changelogVersions.length === 0 ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-on-surface-variant">
                                        No recent changes found
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: {},
                                        visible: {
                                            transition: {
                                                delayChildren: stagger(0.1),
                                            },
                                        },
                                    }}
                                >
                                    {changelogVersions.map((version, index) => (
                                        <motion.div
                                            key={index}
                                            className="mb-6 last:mb-0"
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: { opacity: 1, y: 0 },
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {/* Version Header */}
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <GitBranch
                                                        size={16}
                                                        className="text-primary"
                                                    />
                                                    <span className="font-semibold text-on-surface">
                                                        {version.version}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                                                    <Calendar size={14} />
                                                    <span>
                                                        {formatDate(
                                                            version.date
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Changes */}
                                            <div className="space-y-2">
                                                {sortChanges(
                                                    version.changes
                                                ).map((change, changeIndex) => (
                                                    <div
                                                        key={changeIndex}
                                                        className="flex items-center gap-3"
                                                    >
                                                        {getChangeIcon(
                                                            change.type
                                                        )}
                                                        <span className="text-on-surface-variant text-sm leading-5">
                                                            {change.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChangelogModal;
