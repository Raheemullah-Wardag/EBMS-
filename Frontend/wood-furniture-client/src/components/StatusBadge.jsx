const colors = {
    Pending:      'bg-yellow-100 text-yellow-800',
    Confirmed:    'bg-blue-100 text-blue-800',
    InProduction: 'bg-purple-100 text-purple-800',
    Ready:        'bg-indigo-100 text-indigo-800',
    Shipped:      'bg-cyan-100 text-cyan-800',
    Delivered:    'bg-green-100 text-green-800',
    Cancelled:    'bg-red-100 text-red-800',
    Planned:      'bg-gray-100 text-gray-800',
    InProgress:   'bg-orange-100 text-orange-800',
    QC:           'bg-pink-100 text-pink-800',
    Completed:    'bg-green-100 text-green-800',
    Present:      'bg-green-100 text-green-800',
    Absent:       'bg-red-100 text-red-800',
    Leave:        'bg-yellow-100 text-yellow-800',
    HalfDay:      'bg-orange-100 text-orange-800',
    Paid:         'bg-green-100 text-green-800',
    Failed:       'bg-red-100 text-red-800',
    Refunded:     'bg-gray-100 text-gray-800',
};

const StatusBadge = ({ status }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
    </span>
);

export default StatusBadge;
