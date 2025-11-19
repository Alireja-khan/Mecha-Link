"use client";
import React, { useEffect, useState, useMemo } from "react";
import { DollarSign, BarChart, ArrowDownUp, CheckCircle, Search, Clock, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Reusable Stat Card component from the Review Management design
const StatCard = ({ icon: Icon, value, label, color = "primary", className = "" }) => {
    const colorClasses = {
        primary: { bg: "bg-primary/10", bgHover: "group-hover:bg-primary/20", text: "text-primary", border: "border-primary/20" },
        green: { bg: "bg-success/10", bgHover: "group-hover:bg-success/20", text: "text-success", border: "border-success/20" },
        blue: { bg: "bg-info/10", bgHover: "group-hover:bg-info/20", text: "text-info", border: "border-info/20" },
        purple: { bg: "bg-accent/10", bgHover: "group-hover:bg-accent/20", text: "text-accent", border: "border-accent/20" },
        yellow: { bg: "bg-warning/10", bgHover: "group-hover:bg-warning/20", text: "text-warning", border: "border-warning/20" }
    };
    const classes = colorClasses[color] || colorClasses.primary;

    return (
        <div className={`bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${classes.border} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group ${className}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-xl ${classes.bg} ${classes.bgHover} transition-colors duration-300`}>
                    <Icon className={classes.text} size={20} />
                </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-base-content mb-1">{value}</p>
            <p className="text-base-content/70 text-xs sm:text-sm font-medium">{label}</p>
        </div>
    );
};

const generateVisiblePages = (currentPage, totalPages) => {
    const pages = [];
    
    // Always show the first page
    if (totalPages > 0) {
        pages.push(1);
    }

    if (totalPages <= 7) {
        for (let i = 2; i < totalPages; i++) {
            pages.push(i);
        }
    } else {
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        if (start > 2) {
            pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            if (i > 1 && i < totalPages) {
                pages.push(i);
            }
        }
        
        if (end < totalPages - 1) {
            pages.push('...');
        }
    }

    // Always show the last page (if totalPages > 1 and not already included)
    if (totalPages > 1 && !pages.includes(totalPages)) {
        pages.push(totalPages);
    }
    
    // Ensure uniqueness and correct order
    return [...new Set(pages)];
};

export default function RevenueReport() {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [currentData, setCurrentData] = useState({});
    const [loading, setLoading] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Added for UI control, though API is fixed

    useEffect(() => {
        setLoading(true);
        // Note: The API call is structured to handle `page` but not necessarily `itemsPerPage`. 
        // We will assume the API returns 10 items per page as per your original index logic.
        fetch(`/api/payment?search=${search}&page=${currentPage}`) 
            .then((res) => res.json())
            .then((data) => {
                setCurrentData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching revenue data:", error);
                setLoading(false);
            });
    }, [currentPage, search]);

    const paymentData = currentData?.payments || [];
    const totalPages = currentData?.totalPages || 1;
    const totalItems = currentData?.totalItems || 0;
    const totalAmount = currentData?.totalAmount || 0;
    const totalPage = totalPages; // Alias for clarity in pagination logic

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleItemsPerPage = (e) => {
        // In a real app, this would trigger a new API call and reset currentPage
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); 
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const formatDateLong = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getPurposeBadge = (purpose) => {
        const base = "px-2 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";
        switch (purpose?.toLowerCase()) {
            case "shop registration":
            case "shop add": 
                return <span className={`${base} bg-success/20 text-success border-success/40`}>Registration</span>;
            case "renewal":
                return <span className={`${base} bg-info/20 text-info border-info/40`}>Renewal</span>;
            case "premium upgrade":
                return <span className={`${base} bg-accent/20 text-accent border-accent/40`}>Upgrade</span>;
            default:
                return <span className={`${base} bg-base-300/50 text-base-content border-neutral/40`}>Other</span>;
        }
    };

    const openDetailModal = (payment) => {
        setSelectedPayment(payment);
        setDetailModalOpen(true);
    };

    // --- Pagination Logic ---
    const getPageClass = (page) => {
        if (page === '...') {
            return '';
        }
        
        // Always show page 1, the last page, and the current page on all screens
        if (page === 1 || page === totalPage || page === currentPage) {
            return ''; 
        }
        
        // Hide other pages on mobile
        return 'hidden md:inline-block';
    };

    const visiblePages = useMemo(() => generateVisiblePages(currentPage, totalPage), [currentPage, totalPage]);
    // --- End Pagination Logic ---


    const RevenueMobileCard = ({ payment }) => {
        return (
            <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="flex items-start justify-between mb-3 border-b border-base-300 pb-3">
                    <div className="flex items-center gap-3">
                        <DollarSign size={20} className="text-success" />
                        <div>
                            <p className="font-semibold text-base-content text-lg">৳ {payment.amount}</p>
                            <p className="text-xs text-base-content/70">{formatDate(payment.paymentDate)}</p>
                        </div>
                    </div>
                    {getPurposeBadge(payment.purpose)}
                </div>
                <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center text-sm">
                        <p className="font-medium text-base-content">Shop:</p>
                        <p className="text-base-content/90 truncate max-w-[60%]">{payment.shopName}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <p className="font-medium text-base-content">Owner:</p>
                        <p className="text-base-content/90 truncate max-w-[60%]">{payment.ownerName}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <p className="font-medium text-base-content">TRXN ID:</p>
                        <p className="text-base-content/70 font-mono text-xs">{payment.tran_id}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <p className="font-medium text-base-content">Card Type:</p>
                        <span className="badge badge-outline badge-info text-xs">{payment.card_type}</span>
                    </div>
                </div>
                <div className="flex justify-end pt-3 border-t border-base-300">
                    <button
                        onClick={() => openDetailModal(payment)}
                        className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/30 hover:bg-primary/20 transition-colors flex items-center gap-1"
                        title="View Details"
                    >
                        <Eye size={14} /> View Details
                    </button>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen w-full bg-base-200">
            <span className="loading loading-bars loading-xl text-primary"></span>
        </div>
    );

    return (
        <div className="min-h-screen w-full p-3 sm:p-4 lg:p-6 mx-auto bg-base-200">
            <div className="mb-4 sm:mb-6 lg:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-1 sm:mb-2">Revenue Report</h1>
                <p className="text-base-content/70 text-sm sm:text-base lg:text-lg">Overview of all successful transactions and subscription payments</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <StatCard
                    icon={DollarSign}
                    value={`৳ ${totalAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                    label="Total Revenue"
                    color="green"
                />
                <StatCard
                    icon={BarChart}
                    value={totalItems.toLocaleString()}
                    label="Total Transactions"
                    color="primary"
                />
                <StatCard
                    icon={ArrowDownUp}
                    value={currentPage}
                    label="Current Page"
                    color="blue"
                />
                <StatCard
                    icon={CheckCircle}
                    value={totalPages}
                    label="Total Pages"
                    color="purple"
                />
            </div>

            <div className="bg-base-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-base-300 shadow-xl">
                <div className="flex justify-end w-full mb-6">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60" size={18} />
                        <input
                            type="text"
                            placeholder="Search shop, owner, or TRXN ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2.5 sm:py-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary w-full text-sm text-base-content"
                        />
                    </div>
                </div>

                <div className="block lg:hidden space-y-4">
                    {paymentData.length > 0 ? paymentData.map(p => <RevenueMobileCard key={p._id} payment={p} />) : <div className="text-center py-12"><DollarSign size={48} className="mx-auto text-base-content/30" /><p className="text-base-content/70">No transactions found.</p></div>}
                </div>

                <div className="hidden lg:block overflow-x-auto rounded-xl border border-base-300">
                    <table className="min-w-full divide-y divide-base-300">
                        <thead className="bg-base-300">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-base-content uppercase tracking-wider">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-base-content uppercase tracking-wider">Transaction ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-base-content uppercase tracking-wider">Owner & Shop</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-base-content uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-base-content uppercase tracking-wider">Purpose</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-base-content uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-base-content uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-base-100 divide-y divide-base-200">
                            {!loading && paymentData.length === 0 && <tr><td colSpan="7" className="text-center py-6 text-gray-500">No transactions found.</td></tr>}

                            {!loading && paymentData.map((rev, index) => (
                                <tr key={rev._id} className="hover:bg-base-200 transition-colors">
                                    <td className="px-4 py-3 text-sm text-base-content/90">{(currentPage - 1) * 10 + index + 1}</td>
                                    <td className="px-4 py-3 text-xs">
                                        <p className="font-mono text-base-content/90 font-semibold">{rev.tran_id}</p>
                                        <p className="font-mono text-base-content/70">Shop: {rev.shopID}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-semibold text-base-content">{rev.ownerName}</p>
                                        <p className="text-xs text-base-content/70">{rev.shopName}</p>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-bold text-success text-right">৳ {rev.amount}</td>
                                    <td className="px-4 py-3">{getPurposeBadge(rev.purpose)}</td>
                                    <td className="px-4 py-3 text-xs text-base-content/70">{formatDate(rev.paymentDate)}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => openDetailModal(rev)} className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/30 hover:bg-primary/20 transition-colors" title="View Details"><Eye size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- Updated Pagination --- */}
                <div className="flex flex-col md:flex-row justify-between mt-8 items-center gap-4">
                    <div className="flex items-center gap-3">
                        <label htmlFor="itemsPerPage" className="text-base-content/60 font-medium text-sm">
                            Show per page:
                        </label>
                        {/* Note: This control is for UI only unless the API is updated to handle it */}
                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPage}
                            className="px-4 py-2 bg-base-200 rounded-lg border-2 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 text-sm"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="50">50</option>
                        </select>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-2">
                        <button
                            className="h-10 w-10 flex items-center justify-center border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            title="Previous Page"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {visiblePages.map((page, index) =>
                            page === '...' ? (
                                <span key={`ellipsis-${index}`} className={`p-1.5 text-base-content/60`}>...</span>
                            ) : (
                                <button
                                    key={page}
                                    className={`
                                        h-10 w-10 border rounded-lg transition-all duration-300 text-sm sm:text-base
                                        ${page === currentPage
                                        ? "bg-primary text-white border-primary"
                                        : "border-base-300 text-base-content hover:bg-primary/10 hover:border-primary"
                                        }
                                        ${getPageClass(page)}
                                    `}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button
                            className="h-10 w-10 flex items-center justify-center border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={currentPage === totalPage}
                            onClick={() => handlePageChange(currentPage + 1)}
                            title="Next Page"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {/* --- End Updated Pagination --- */}
            </div>

            {/* Detail Modal */}
            {detailModalOpen && selectedPayment && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-base-content/20 z-50 p-4">
                    <div className="bg-base-100 rounded-3xl p-8 w-full max-w-4xl border border-base-300 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-base-content">Transaction Details</h2>
                            <button onClick={() => setDetailModalOpen(false)} className="p-2 bg-base-200 text-base-content rounded-xl border border-base-300 hover:bg-base-300 transition-colors"><X size={20} /></button>
                        </div>
                        <div className="space-y-6">
                            {/* Payment Summary Header Card */}
                            <div className="flex items-center gap-4 p-4 bg-success/10 rounded-xl border border-success/20">
                                <DollarSign size={40} className="text-success" />
                                <div>
                                    <h3 className="text-3xl font-bold text-success">৳ {selectedPayment.amount}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        {getPurposeBadge(selectedPayment.purpose)}
                                        <span className="text-sm text-base-content/70">Paid On: {formatDateLong(selectedPayment.paymentDate)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Transaction Info Card (Primary Color) */}
                                <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 text-base-content">
                                    <p className="font-semibold text-primary mb-2">Transaction Info</p>
                                    <div className='text-base-content/90 space-y-1'>
                                        <p className="flex justify-between">
                                            <span className="font-medium">TRXN ID:</span>
                                            <span className="font-mono text-sm">{selectedPayment.tran_id}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="font-medium">Card Type:</span>
                                            <span className="badge badge-outline badge-info">{selectedPayment.card_type}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="font-medium">Bank/Gateway:</span>
                                            <span>{selectedPayment.bank_tran_id}</span>
                                        </p>
                                    </div>
                                </div>
                                {/* Shop/Owner Info Card (Info Color) */}
                                <div className="p-4 bg-info/10 rounded-xl border border-info/20 text-base-content">
                                    <p className="font-semibold text-info mb-2">Shop & Owner</p>
                                    <div className='text-base-content/90 space-y-1'>
                                        <p className="flex justify-between">
                                            <span className="font-medium">Shop Name:</span>
                                            <span>{selectedPayment.shopName}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="font-medium">Owner:</span>
                                            <span>{selectedPayment.ownerName}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="font-medium">Owner Email:</span>
                                            <span className="text-sm">{selectedPayment.ownerEmail}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-base-200 rounded-xl border border-base-300 text-base-content">
                                <p className="font-semibold text-base-content/90 mb-2">Additional Metadata</p>
                                <div className='text-base-content/70 space-y-1 text-sm'>
                                    <p className="flex justify-between">
                                        <span className="font-medium">Currency:</span>
                                        <span>{selectedPayment.currency || (selectedPayment.amount ? 'BDT' : 'N/A')}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="font-medium">Purpose:</span>
                                        <span>{selectedPayment.purpose}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="font-medium">Status:</span>
                                        <span className="font-semibold text-success">Successful</span>
                                    </p>
                                </div>
                            </div>
                            {/* Modal Action Buttons */}
                            <div className="flex justify-end pt-4">
                                <button onClick={() => setDetailModalOpen(false)} className="px-6 py-2 bg-base-100 border border-base-300 text-base-content rounded-xl hover:bg-base-200 transition-colors">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}