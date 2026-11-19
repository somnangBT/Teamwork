import { CheckCircle2, Clock, CalendarClock, AlertCircle, XCircle, Archive, HelpCircle, RefreshCw, FileEdit, MinusCircle } from '@lucide/vue';

const STATUS_THEME_MAP = {
    // Success / Green
    RESOLVED: 'success',
    PUBLISHED: 'success',
    ACTIVE: 'success',
    ENABLED: 'success',
    COMPLETED: 'success',
    VERIFIED: 'success',
    AVAILABLE: 'success',
    ONLINE: 'success',
    SUCCESS: 'success',
    APPROVED: 'success',
    DONE: 'success',
    OPENING: 'success',
    CONFIRMED: 'success',
    DELIVERED: 'success',
    IN_STOCK: 'success',
    ON_DUTY: 'success',
    PAID: 'success',

    // Info / Blue
    IN_PROGRESS: 'info',
    SCHEDULED: 'info',
    PROCESSING: 'info',
    SHIPPED: 'info',
    REVIEWING: 'info',
    INFO: 'info',
    OPEN: 'info',

    // Warning / Yellow
    PENDING: 'warning',
    DRAFT: 'warning',
    WAITING: 'warning',
    UNVERIFIED: 'warning',
    MAINTENANCE: 'warning',
    WARNING: 'warning',
    PAUSED: 'warning',
    BOOKED: 'warning',
    LOW_STOCK: 'warning',
    BREAK: 'warning',

    // Danger / Red
    REJECTED: 'danger',
    FAILED: 'danger',
    CANCELLED: 'danger',
    DISABLED: 'danger',
    SUSPENDED: 'danger',
    OCCUPIED: 'danger',
    OFFLINE: 'danger',
    ERROR: 'danger',
    OUT_OF_STOCK: 'danger',

    // Secondary / Grey
    ARCHIVED: 'secondary',
    CLOSED: 'secondary',
    INACTIVE: 'secondary',
    UNKNOWN: 'secondary',
    ALL: 'secondary',
    DEFAULT: 'secondary',
    UNAVAILABLE: 'secondary',
    OFF_DUTY: 'secondary'
};

const STATUS_ICON_MAP = {
    // Success / Green
    RESOLVED: CheckCircle2,
    PUBLISHED: CheckCircle2,
    ACTIVE: CheckCircle2,
    ENABLED: CheckCircle2,
    COMPLETED: CheckCircle2,
    VERIFIED: CheckCircle2,
    AVAILABLE: CheckCircle2,
    ONLINE: CheckCircle2,
    SUCCESS: CheckCircle2,
    APPROVED: CheckCircle2,
    DONE: CheckCircle2,
    OPENING: CheckCircle2,
    CONFIRMED: CheckCircle2,
    DELIVERED: CheckCircle2,
    IN_STOCK: CheckCircle2,
    ON_DUTY: CheckCircle2,
    PAID: CheckCircle2,

    // Info / Blue
    IN_PROGRESS: RefreshCw,
    SCHEDULED: CalendarClock,
    PROCESSING: RefreshCw,
    SHIPPED: RefreshCw,
    REVIEWING: Clock,
    INFO: Clock,
    OPEN: Clock,

    // Warning / Yellow
    PENDING: Clock,
    DRAFT: FileEdit,
    WAITING: Clock,
    UNVERIFIED: AlertCircle,
    MAINTENANCE: AlertCircle,
    WARNING: AlertCircle,
    PAUSED: Clock,
    BOOKED: Clock,
    LOW_STOCK: AlertCircle,
    BREAK: Clock,

    // Danger / Red
    REJECTED: XCircle,
    FAILED: XCircle,
    CANCELLED: XCircle,
    DISABLED: XCircle,
    SUSPENDED: XCircle,
    OCCUPIED: XCircle,
    OFFLINE: XCircle,
    ERROR: XCircle,
    OUT_OF_STOCK: XCircle,

    // Secondary / Grey
    ARCHIVED: Archive,
    CLOSED: Archive,
    INACTIVE: MinusCircle,
    UNKNOWN: HelpCircle,
    ALL: HelpCircle,
    DEFAULT: HelpCircle,
    UNAVAILABLE: Archive,
    OFF_DUTY: MinusCircle
};

export const getStatusBadge = (status, customMap = {}) => {
    if (!status) return 'bg-secondary-subtle text-secondary-emphasis';
    const key = String(status).toUpperCase().replace(/\s+/g, '_').trim();
    const theme = customMap[key] || STATUS_THEME_MAP[key] || 'secondary';
    return `bg-${theme}-subtle text-${theme}-emphasis`;
};

export const getStatusVariant = (status, customMap = {}) => {
    if (!status) return 'secondary';
    const key = String(status).toUpperCase().replace(/\s+/g, '_').trim();
    return customMap[key] || STATUS_THEME_MAP[key] || 'secondary';
};

export const getStatusIcon = (status, customMap = {}) => {
    if (!status) return HelpCircle;
    const key = String(status).toUpperCase().replace(/\s+/g, '_').trim();
    return customMap[key] || STATUS_ICON_MAP[key] || HelpCircle;
};

export const formatStatusLabel = (status) => {
    if (!status) return 'UNKNOWN';
    return String(status).replace(/_/g, ' ').toUpperCase();
};

export const getCategoryColorHex = (category) => {
    if (!category || category === 'Uncategorized' || category === 'all') return '#8c98a4';
    const str = String(category).trim();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 75%, 45%)`;
};
