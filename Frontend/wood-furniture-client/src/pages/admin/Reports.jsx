
// ============================================================
//  FILE 3: src/pages/admin/Reports.jsx
// ============================================================
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAllOrders } from '../../api/orderApi';
import { getAllProducts } from '../../api/productApi';
import { getAllEmployees } from '../../api/employeeApi';
import { BarChart2, TrendingUp, Package, Users, Download, CalendarDays } from 'lucide-react';

const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatISO = (date) => date.toISOString().slice(0, 10);

const createRange = (start, end) => {
    const values = [];
    const current = new Date(start);
    while (current <= end) {
        values.push(formatISO(new Date(current)));
        current.setDate(current.getDate() + 1);
    }
    return values;
};

const findCostPrice = (item, productMap, skuMap) => {
    if (!item) return undefined;
    if (item.productName && productMap.has(item.productName)) return productMap.get(item.productName);
    if (item.sku && skuMap.has(item.sku)) return skuMap.get(item.sku);
    return undefined;
};

const calculateProfit = (order, productMap, skuMap) => {
    if (!order.Items || order.Items.length === 0) {
        return order.orderType === 'Custom' ? order.finalAmount * 0.2 : 0;
    }
    const cost = order.Items.reduce((sum, item) => {
        const costPrice = findCostPrice(item, productMap, skuMap);
        const unitCost = costPrice ?? item.unitPrice * 0.6;
        return sum + unitCost * item.quantity;
    }, 0);
    return (order.finalAmount || 0) - cost;
};

const Reports = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return formatISO(d);
    });
    const [toDate, setToDate] = useState(() => formatISO(new Date()));

    useEffect(() => {
        Promise.all([getAllOrders(), getAllProducts(), getAllEmployees()])
            .then(([o, p, e]) => {
                setOrders(o.data);
                setProducts(p.data);
                setEmployees(e.data);
            })
            .finally(() => setLoading(false));
    }, []);

    const start = new Date(fromDate);
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);

    const filteredOrders = orders.filter(order => {
        const date = new Date(order.orderDate);
        return date >= start && date <= end;
    });

    const productMap = new Map(products.map(p => [p.productName, p.costPrice]));
    const skuMap = new Map(products.map(p => [p.sku, p.costPrice]));

    const completedOrders = filteredOrders.filter(o => o.orderStatus !== 'Cancelled');
    const totalSales = completedOrders.reduce((sum, o) => sum + (o.finalAmount || 0), 0);
    const totalProfit = completedOrders.reduce((sum, o) => sum + calculateProfit(o, productMap, skuMap), 0);
    const salesCount = completedOrders.length;
    const averageOrder = salesCount > 0 ? totalSales / salesCount : 0;

    const dateRange = createRange(start, end);
    const salesSeries = dateRange.map(dateKey => {
        const dayOrders = completedOrders.filter(o => formatISO(new Date(o.orderDate)) === dateKey);
        const sales = dayOrders.reduce((sum, o) => sum + (o.finalAmount || 0), 0);
        const profit = dayOrders.reduce((sum, o) => sum + calculateProfit(o, productMap, skuMap), 0);
        return {
            date: dateKey,
            label: new Date(dateKey).toLocaleDateString('en-PK', { day: '2-digit', month: 'short' }),
            sales,
            profit
        };
    });

    const maxSales = Math.max(...salesSeries.map(point => point.sales), 1);
    const maxProfit = Math.max(...salesSeries.map(point => Math.abs(point.profit)), 1);

    const salesPath = salesSeries.map((point, idx) => {
        const x = idx * (700 / Math.max(salesSeries.length - 1, 1));
        const y = 180 - (point.sales / maxSales) * 160;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');

    const profitPath = salesSeries.map((point, idx) => {
        const x = idx * (700 / Math.max(salesSeries.length - 1, 1));
        const y = 180 - ((point.profit + maxProfit) / (2 * maxProfit)) * 160;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');

    const downloadReport = (type) => {
        const fileName = type === 'sales' ? 'Sales_Report' : 'ProfitLoss_Report';
        const rows = filteredOrders.map(order => {
            const profit = calculateProfit(order, productMap, skuMap);
            return {
                orderId: order.orderID,
                customer: order.customerName || 'Unknown',
                orderType: order.orderType,
                status: order.orderStatus,
                orderDate: formatDate(order.orderDate),
                finalAmount: order.finalAmount || 0,
                profit: type === 'profit' ? profit : undefined
            };
        });

        let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${type === 'sales' ? 'Sales Report' : 'Profit Loss Report'}</title><style>body{font-family:Arial,sans-serif;margin:20px;}h1{color:#111;}table{width:100%;border-collapse:collapse;margin-top:16px;}th,td{border:1px solid #ddd;padding:10px;text-align:left;}th{background:#8B5A2B;color:#fff;}tr:nth-child(even){background:#f9f9f9;} .summary{margin-top:10px;padding:16px;background:#f7f7f7;border-radius:12px;} .footer{margin-top:24px;color:#555;font-size:13px;}</style></head><body><h1>${type === 'sales' ? 'Sales Report' : 'Profit / Loss Report'}</h1><div class="summary"><p><strong>Period:</strong> ${formatDate(fromDate)} — ${formatDate(toDate)}</p><p><strong>Total Orders:</strong> ${salesCount}</p><p><strong>Total Sales:</strong> Rs. ${totalSales.toLocaleString()}</p>`;
        if (type === 'profit') {
            html += `<p><strong>Estimated Profit:</strong> Rs. ${totalProfit.toLocaleString()}</p>`;
        }
        html += `</div><table><thead><tr><th>Order ID</th><th>Customer</th><th>Type</th><th>Status</th><th>Date</th><th>Final Amount</th>`;
        if (type === 'profit') html += '<th>Estimated Profit</th>';
        html += '</tr></thead><tbody>';

        rows.forEach(row => {
            html += `<tr><td>${row.orderId}</td><td>${row.customer}</td><td>${row.orderType}</td><td>${row.status}</td><td>${row.orderDate}</td><td>Rs. ${row.finalAmount.toLocaleString()}</td>`;
            if (type === 'profit') html += `<td>Rs. ${row.profit?.toLocaleString()}</td>`;
            html += '</tr>';
        });

        html += `</tbody></table><div class="footer">Generated by Wood Furniture Management System.</div></body></html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}_${formatISO(new Date()).replace(/-/g, '')}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalRevenue = orders.filter(o => o.orderStatus === 'Delivered').reduce((sum, o) => sum + (o.finalAmount || 0), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
    const customOrders = orders.filter(o => o.orderType === 'Custom').length;
    const stockOrders = orders.filter(o => o.orderType === 'Stock').length;
    const lowStock = products.filter(p => p.stockStatus !== 'In Stock').length;
    const activeEmps = employees.filter(e => e.isActive).length;

    const stats = [
        { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Total Orders', value: totalOrders, icon: BarChart2, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Orders', value: pendingOrders, icon: BarChart2, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Custom Orders', value: customOrders, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Stock Orders', value: stockOrders, icon: Package, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        { label: 'Low Stock Items', value: lowStock, icon: Package, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Active Employees', value: activeEmps, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Total Products', value: products.length, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    return (
        <AdminLayout title="Reports">
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                    {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="bg-white h-28 rounded-2xl border border-gray-100"></div>)}
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-end justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Sales & Profit Reports</h2>
                                <p className="text-sm text-gray-500 mt-1">Choose a time range to analyze sales and profit / loss data.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <label className="block">
                                        <span className="text-sm text-gray-600">From</span>
                                        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                                            className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm text-gray-600">To</span>
                                        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                                            className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                    </label>
                                </div>
                                <button onClick={() => { if (new Date(fromDate) > new Date(toDate)) setFromDate(toDate); }}
                                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-xl font-semibold transition">
                                    <CalendarDays size={18} /> Apply Range
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 overflow-x-auto">
                            <div className="relative w-full min-w-[700px] rounded-3xl bg-slate-950 p-6 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Sales Trend</p>
                                        <h3 className="text-2xl font-bold">Sales over time</h3>
                                    </div>
                                    <div className="text-right text-sm text-slate-300">
                                        <p>{formatDate(fromDate)} – {formatDate(toDate)}</p>
                                        <p>{salesSeries.length} days</p>
                                    </div>
                                </div>
                                <svg viewBox="0 0 720 220" className="w-full h-[240px]">
                                    <defs>
                                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <rect x="0" y="0" width="720" height="220" fill="transparent" />
                                    {[1, 2, 3, 4].map(i => (
                                        <line key={i} x1="0" y1={40 + i * 40} x2="720" y2={40 + i * 40} stroke="rgba(255,255,255,0.08)" />
                                    ))}
                                    <path d={`${salesPath} L 700 180 L 0 180 Z`} fill="url(#salesGradient)" stroke="none" />
                                    <path d={salesPath} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                                    <path d={profitPath} fill="none" stroke="#22c55e" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                                    {salesSeries.map((point, idx) => {
                                        const x = idx * (700 / Math.max(salesSeries.length - 1, 1));
                                        const y = 180 - (point.sales / maxSales) * 160;
                                        return <circle key={point.date} cx={x} cy={y} r="3.5" fill="#f59e0b" />;
                                    })}
                                    {salesSeries.map((point, idx) => {
                                        const x = idx * (700 / Math.max(salesSeries.length - 1, 1));
                                        const y = 180 - ((point.profit + maxProfit) / (2 * maxProfit)) * 160;
                                        return <circle key={`${point.date}-profit`} cx={x} cy={y} r="3.5" fill="#22c55e" />;
                                    })}
                                </svg>
                                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                                    <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span> Sales</span>
                                    <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span> Profit / Loss</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {stats.map(s => (
                            <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
                                <s.icon size={24} className={`${s.color} mb-3`} />
                                <p className="text-gray-500 text-xs mb-1">{s.label}</p>
                                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-8">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Sales Summary</h2>
                                    <p className="text-sm text-gray-500">Summary of sales for selected range.</p>
                                </div>
                                <button onClick={() => downloadReport('sales')} className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-2xl text-sm font-semibold transition">
                                    <Download size={16} /> Download Sales Report
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm text-gray-500">Sales Revenue</p>
                                    <p className="text-2xl font-bold text-slate-900">Rs. {totalSales.toLocaleString()}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm text-gray-500">Orders in Range</p>
                                    <p className="text-2xl font-bold text-slate-900">{salesCount}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm text-gray-500">Average Order</p>
                                    <p className="text-2xl font-bold text-slate-900">Rs. {averageOrder.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm text-gray-500">Profit / Loss</p>
                                    <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>Rs. {totalProfit.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Profit / Loss</h2>
                                    <p className="text-sm text-gray-500">Download a detailed profit and loss report.</p>
                                </div>
                                <button onClick={() => downloadReport('profit')} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-2xl text-sm font-semibold transition">
                                    <Download size={16} /> Download P/L Report
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm text-gray-500">Estimated Profit / Loss</p>
                                    <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>Rs. {totalProfit.toLocaleString()}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm text-gray-500">Date Range</p>
                                    <p className="text-lg font-semibold text-slate-900">{formatDate(fromDate)} — {formatDate(toDate)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-5">Orders by Status</h2>
                        <div className="space-y-4">
                            {['Pending','Confirmed','InProduction','Ready','Shipped','Delivered','Cancelled'].map(status => {
                                const count = orders.filter(o => o.orderStatus === status).length;
                                const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                                return (
                                    <div key={status}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600 font-medium">{status}</span>
                                            <span className="text-gray-900 font-bold">{count} ({pct}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-amber-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default Reports;