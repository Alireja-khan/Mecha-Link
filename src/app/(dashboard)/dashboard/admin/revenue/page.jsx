"use client";
import React, { useEffect, useState } from "react";

export default function RevenueReport() {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState([]);
    const [currentData, setCurrentData] = useState({});
    const [loading, setLoading] = useState(false);
   
    useEffect(() => {
        setLoading(true);
        fetch(`/api/payment?search=${search}&page=${currentPage}`).then((res) => res.json()).then((data) => {
            setCurrentData(data);
            setLoading(false);
        })
    },[currentPage,search])
    console.log(currentData)
    const paymentData = currentData?.payments || [];
    const totalPages = currentData?.totalPages || 1;
    const totalItems = currentData?.totalItems || 0;
    const totalAmount = currentData?.totalAmount || 0;

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="min-h-screen bg-base-200 p-6 text-base-content">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold">Revenue Report</h2>
                <p className="text-sm text-gray-500">
                    Overview of all successful transactions
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="rounded-2xl p-4 bg-base-100 border border-base-300 shadow-sm">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <h2 className="text-xl font-bold">৳ {totalAmount}</h2>
                </div>
                <div className="rounded-2xl p-4 bg-base-100 border border-base-300 shadow-sm">
                    <p className="text-sm text-gray-500">Total Transactions</p>
                    <h2 className="text-xl font-bold">{totalItems}</h2>
                </div>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Search shops..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-bordered w-64"
                />
            </div>
            <div className="overflow-x-auto bg-base-100 border border-base-300 rounded-2xl shadow">
                <table className="table w-full">
                    <thead className="bg-base-300 text-base-content">
                        <tr>
                            <th>#</th>
                            <th>IDs</th>
                            <th>Owner Name</th>
                            <th>Shop Name</th>
                            <th>Email</th>
                            <th>Amount</th>
                            <th>Card Type</th>
                            <th>Date</th>
                            <th>Purpose</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && <tr><td colSpan="9" className="text-center">Loading...</td></tr>}
                        {!loading && paymentData.map((rev, index) => (
                            <tr key={rev._id} className="hover:bg-base-200">
                                <td>{ index + 1}</td>
                                <td className="font-medium">
                                    <p>TRXN: {rev.tran_id}</p>
                                    <p>SHOP: {rev.shopID}</p>
                                </td>
                                <td>{rev.ownerName}</td>
                                <td>{rev.shopName}</td>
                                <td>{rev.ownerEmail}</td>
                                <td className="font-semibold text-primary">৳ {rev.amount}</td>
                                <td>{rev.card_type}</td>
                                <td>{new Date(rev.paymentDate).toLocaleString()}</td>
                                <td>{rev.purpose}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex items-center justify-center gap-2 py-4 bg-base-100 rounded-b-2xl border-t border-base-300">
                    <button
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn btn-sm border-none bg-base-300 text-base-content hover:bg-primary hover:text-primary-content disabled:opacity-50"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => changePage(i + 1)}
                            className={`btn btn-sm border-none ${currentPage === i + 1
                                    ? "bg-primary text-primary-content"
                                    : "bg-base-300 text-base-content hover:bg-primary hover:text-primary-content"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn btn-sm border-none bg-base-300 text-base-content hover:bg-primary hover:text-primary-content disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
