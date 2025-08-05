import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface AdminTableColumn {
    key: string;
    label: string;
    width: string; // e.g., "25%", "200px"
    render?: (value: any, item: any) => React.ReactNode;
    sortable?: boolean;
}

export interface AdminTableItem {
    id: string;
    [key: string]: any;
}

interface AdminTableProps {
    title: string;
    columns: AdminTableColumn[];
    items: AdminTableItem[];
    onItemClick?: (item: AdminTableItem) => void;
    renderExpandedContent?: (item: AdminTableItem) => React.ReactNode;
    emptyMessage?: string;
    toolbar?: React.ReactNode;
}

type SortDirection = 'asc' | 'desc' | null;

function TableHeader({
    columns,
    sortKey,
    sortDirection,
    onSort,
}: {
    columns: AdminTableColumn[];
    sortKey: string | null;
    sortDirection: SortDirection;
    onSort: (key: string) => void;
}) {
    return (
        <div className="hidden md:flex bg-surface-variant px-6 py-3 border-b border-outline-variant text-sm font-medium text-on-surface-variant">
            {columns.map(column => (
                <div
                    key={column.key}
                    className={`px-2 ${column.sortable !== false ? 'cursor-pointer hover:text-on-surface transition-colors' : ''}`}
                    style={{ width: column.width }}
                    onClick={() => column.sortable !== false && onSort(column.key)}
                >
                    <div className="flex items-center gap-1">
                        {column.label}
                        {column.sortable !== false && (
                            <div className="flex flex-col">
                                <ChevronUp
                                    className={`h-3 w-3 ${
                                        sortKey === column.key && sortDirection === 'asc' ? 'text-primary' : 'text-on-surface-variant/40'
                                    }`}
                                />
                                <ChevronDown
                                    className={`h-3 w-3 -mt-1 ${
                                        sortKey === column.key && sortDirection === 'desc' ? 'text-primary' : 'text-on-surface-variant/40'
                                    }`}
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function AdminTableRow({
    item,
    columns,
    onItemClick,
    renderExpandedContent,
    isExpanded,
    onToggleExpand,
}: {
    item: AdminTableItem;
    columns: AdminTableColumn[];
    onItemClick?: (item: AdminTableItem) => void;
    renderExpandedContent?: (item: AdminTableItem) => React.ReactNode;
    isExpanded: boolean;
    onToggleExpand: () => void;
}) {
    const handleRowClick = () => {
        onToggleExpand();
        onItemClick?.(item);
    };

    return (
        <>
            <div
                className={`hidden md:flex bg-surface hover:bg-surface-variant cursor-pointer transition-all duration-200 group relative ${
                    isExpanded
                        ? 'border-l-2 border-l-primary bg-surface-variant/50'
                        : 'border-l-2 border-l-transparent hover:border-l-outline border-b border-outline-variant last:border-b-0'
                }`}
                onClick={handleRowClick}
            >
                {columns.map((column, index) => (
                    <motion.div
                        key={column.key}
                        className="px-2 py-3 flex items-center"
                        style={{ width: column.width }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                        <div className="text-sm text-on-surface truncate">
                            {column.render ? column.render(item[column.key], item) : item[column.key]}
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isExpanded && renderExpandedContent && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="bg-surface-variant border-b border-outline-variant border-l-2 border-l-primary overflow-hidden"
                    >
                        <div className="p-6">{renderExpandedContent(item)}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export function AdminTable({
    title,
    columns,
    items,
    onItemClick,
    renderExpandedContent,
    emptyMessage = 'No items found',
    toolbar,
}: AdminTableProps) {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [sortKey, setSortKey] = useState<string | null>(columns.find(col => col.sortable !== false)?.key || null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const toggleExpand = (itemId: string) => {
        setExpandedItem(prev => (prev === itemId ? null : itemId));
    };

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'));
            if (sortDirection === 'desc') {
                setSortKey(null);
            }
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const sortedItems = useMemo(() => {
        if (!sortKey || !sortDirection) return items;

        return [...items].sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];

            // Handle different data types
            let comparison = 0;
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                comparison = aValue.localeCompare(bValue);
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                comparison = aValue - bValue;
            } else {
                // Convert to string for comparison
                comparison = String(aValue).localeCompare(String(bValue));
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [items, sortKey, sortDirection]);

    return (
        <div className="w-full space-y-6">
            {/* Toolbar */}
            {toolbar}

            {/* Title */}
            <div className="flex items-center">
                <h3 className="text-xl font-semibold text-on-surface">{title}</h3>
                <span className="ml-3 text-sm text-on-surface-variant">
                    {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            {/* Table */}
            <div className="hidden md:block">
                {sortedItems.length > 0 ? (
                    <motion.div
                        className="bg-surface rounded-lg overflow-hidden border border-outline-variant shadow"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <TableHeader columns={columns} sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
                        <AnimatePresence>
                            {sortedItems.map(item => (
                                <AdminTableRow
                                    key={item.id}
                                    item={item}
                                    columns={columns}
                                    onItemClick={onItemClick}
                                    renderExpandedContent={renderExpandedContent}
                                    isExpanded={expandedItem === item.id}
                                    onToggleExpand={() => toggleExpand(item.id)}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="bg-surface rounded-lg shadow p-12 border border-outline-variant">
                        <div className="text-center">
                            <p className="text-on-surface-variant text-lg">{emptyMessage}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile view - simple list */}
            <div className="md:hidden space-y-3">
                {sortedItems.length > 0 ? (
                    sortedItems.map(item => (
                        <motion.div
                            key={item.id}
                            className={`bg-surface rounded-lg p-4 border cursor-pointer transition-all duration-200 ${
                                expandedItem === item.id
                                    ? 'border-primary bg-surface-variant/50'
                                    : 'border-outline-variant hover:bg-surface-variant hover:border-outline'
                            }`}
                            onClick={() => {
                                toggleExpand(item.id);
                                onItemClick?.(item);
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    {columns.slice(0, 2).map(column => (
                                        <div key={column.key} className="mb-1">
                                            <span className="text-sm font-medium text-on-surface">
                                                {column.render ? column.render(item[column.key], item) : item[column.key]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                        expandedItem === item.id ? 'bg-primary' : 'bg-outline'
                                    }`}
                                />
                            </div>

                            <AnimatePresence>
                                {expandedItem === item.id && renderExpandedContent && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-3 pt-3 border-t border-outline-variant overflow-hidden"
                                    >
                                        {renderExpandedContent(item)}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                ) : (
                    <div className="bg-surface rounded-lg shadow p-8 border border-outline-variant">
                        <div className="text-center">
                            <p className="text-on-surface-variant">{emptyMessage}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
