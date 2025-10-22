"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaDownload, FaGear, FaUser } from "react-icons/fa6";

// Custom styles for print-js to match the new design
const printStyles = `
  /* Global Print Settings for A4 */
  @page {
    size: A4;
    margin: 10mm; /* Minimal margins for a tight fit */
  }

  body { 
    font-family: 'Inter', sans-serif; 
    font-size: 12px; /* Reduced base font size */
    color: #1f2937; 
    margin: 0; 
    padding: 0; 
    line-height: 1.4; /* Tighter line height */
  }

  .invoice-container { 
    max-width: 100%; /* Use full width in print mode */
    margin: 0; 
    background: #ffffff; 
    padding: 20px; /* Reduced container padding */
    border-radius: 0; 
    border: none; 
  }
  
  /* Header/Logo */
  .logo-wrap { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    padding-bottom: 15px; /* Reduced padding */
    border-bottom: 3px solid #374151; 
    margin-bottom: 20px; /* Reduced margin */
  }
  .logo-wrap .brand { 
    display: flex; 
    align-items: center; 
    gap: 8px; 
  }
  .logo-wrap .gear { 
    height: 32px; /* Appropriately sized icon */
    width: 32px; 
    color: #f97316; 
  }
  .logo-wrap h1 { 
    font-size: 20px; 
    font-weight: 800; 
  }
  .logo-wrap .text-primary { color: #f97316; }
  .logo-wrap .invoice-label { 
    font-size: 11px; 
    color: #6b7280; 
  }
  .logo-wrap .invoice-date { 
    font-size: 11px; 
    color: #374151; 
  }

  .orange{
    color: var(--color-primary);
  }

  /* Success Badge - Icon is now visible and sized for print */
  .success-badge { 
    text-align: center; 
    margin: 20px 0; 
    padding: 15px; 
    border-radius: 8px; 
    background: #f0fdf4; 
    border: 1px solid #10b981; 
  }
  .success-icon { 
    display: block !important; /* Ensure icon is visible */
    width: 40px; /* Set a moderate size */
    height: 40px;
    color: #059669; 
    margin: 0 auto 8px auto; /* Center it with less margin */
  }
  .success-title { 
    font-size: 20px; 
    font-weight: 800; 
    color: #059669; 
    margin-bottom: 2px; 
  }
  .success-badge p {
    font-size: 12px;
    color: #047857;
  }

  /* Info Cards - Simplified layout, enforced stacking on print */
  .info-card-group { 
    margin-bottom: 20px; 
    border: 1px solid #d1d5db; 
    border-radius: 8px; 
    padding: 15px; 
  }
  .info-card-group h3 { 
    font-size: 15px; 
    font-weight: 700; 
    color: #1f2937; 
    margin-bottom: 10px; 
    padding-bottom: 5px; 
    border-bottom: 1px solid #e5e7eb; 
  }

  .info-row { 
    display: flex; 
    justify-content: space-between; 
    padding: 8px 0; 
    border-bottom: 1px dashed #e5e7eb; 
  }
  .info-row:last-child { border-bottom: none; }
  .info-label { 
    color: #6b7280; 
    font-weight: 500; 
    font-size: 12px; 
  }
  .info-value { 
    color: #111827; 
    font-weight: 600; 
    font-size: 12px; 
    text-align: right; 
  }
  
  /* Total */
  .total-row { 
    padding-top: 10px; 
    border-top: 3px solid #d1d5db; 
    margin-top: 10px; 
  }
  .info-value-total { 
    font-size: 26px; 
    font-weight: 800; 
    color: #059669; 
  }

  /* Footer */
  .footer-text { 
    text-align: center; 
    color: #9ca3af; 
    font-size: 10px; 
    margin-top: 20px; 
    padding-top: 15px; 
    border-top: 1px solid #e5e7eb; 
  }

  /* Ensures the grid stacks vertically for better A4 flow */
  .print-stack {
    display: block !important;
  }

  /* Ensures card groups take full width when stacked */
  .print-stack > div {
    width: 100%;
    margin-bottom: 15px;
  }
`;

export default function SuccessPage() {
  const params = useSearchParams();
  const shopID = params.get("shopID");
  const trxn = params.get("trxn");
  const [paymentInfo, setPaymentInfo] = useState({});
  const [printJS, setPrintJS] = useState(null);

  useEffect(() => {
    // Dynamically import print-js
    import("print-js").then((mod) => setPrintJS(() => mod.default));
  }, []);

  useEffect(() => {
    if (!shopID) return;

    // Fetch payment details
    fetch(`/api/payment/${shopID}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setPaymentInfo(data))
      .catch((err) => console.error("Payment fetch error:", err));
  }, [shopID]);

  const handleDownloadPDF = () => {
    if (!printJS) return;
    const content = document.getElementById("invoiceSection");
    if (!content) return;

    printJS({
      printable: content.innerHTML,
      type: "raw-html",
      style: printStyles, // Use the updated styles
      documentTitle: `Invoice-${paymentInfo.tran_id}`,
      // Add a small delay to ensure the DOM is ready for printing
      onPrintDialogClose: () => console.log("Print dialog closed"),
    });
  };

  // --- Loading State ---
  if (!shopID || !paymentInfo.tran_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 p-6">
        <div className="bg-white shadow-xl rounded-2xl p-12 text-center w-full max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-700">Processing Transaction...</h2>
          <p className="text-gray-500 mt-2">Please wait while we load your invoice details.</p>
        </div>
      </div>
    );
  }

  // --- Verification/Error State (Invalid Transaction) ---
  if (trxn !== paymentInfo.tran_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-xl border-t-8 border-red-600">
          <div className="text-center py-8">
            <div className="text-red-600 text-6xl mb-6">🛑</div>
            <h1 className="text-3xl font-extrabold text-red-700 mb-4">Access Denied!</h1>
            <p className="text-gray-600 text-lg mb-8">
              The provided transaction link is invalid or incomplete. You need a valid transaction ID to view this invoice.
            </p>
            <Link
              href="/dashboard/mechanic/profile"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <FaUser />
              Return to Profile Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Success & Invoice Page ---
  return (
    <div className="min-h-screen py-12 px-4 flex justify-center bg-base-100">
      <div className="invoice-container bg-base-200 shadow-2xl rounded-2xl p-8 lg:p-12 w-full max-w-4xl border-t-8 border-primary">

        {/* Invoice Section (PDF Content) */}
        <div id="invoiceSection">
          {/* Header & Logo */}
          <div className="logo-wrap flex items-center justify-between border-b-[3px] border-primary pb-6 mb-8">
            <div className="brand flex gap-3 items-center">
              <FaGear className="gear h-12 w-12 text-primary" />
              <h1 className="text-3xl lg:text-4xl font-extrabold text-base-content">
                Mecha<span className="text-primary orange">Link</span>
              </h1>
            </div>
            <div className="text-right">
              <p className="invoice-label text-md text-base-content/60 font-semibold uppercase tracking-wider">Invoice</p>
              <p className="invoice-date text-base-content/80 font-medium mt-1">
                Date: {new Date(paymentInfo.paymentDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Success Badge */}
          <div className="success-badge text-center py-8 bg-success/20 border border-success rounded-xl shadow-inner">
            <FaCheckCircle className="success-icon text-7xl text-success/80 mx-auto mb-4 animate-pulse-once" />
            <h2 className="success-title text-4xl font-extrabold text-success mb-2">
              Payment Successful!
            </h2>
            <p className="success-date text-base-content/80 text-lg">
              Transaction Completed: {new Date(paymentInfo.paymentDate).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="info-card-section flex flex-col md:flex-row gap-8 my-10">
            {/* Shop Information Card */}
            <div className="info-card info-card-shop flex-1 bg-warning/20 border border-warning rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-base-content mb-5 pb-3 border-b-2 border-warning flex items-center gap-3">
                <FaUser className="icon text-warning" />
                Shop Information
              </h3>
              <div className="space-y-3">
                <div className="info-row flex justify-between py-2">
                  <span className="info-label text-base-content/60">Shop Name:</span>
                  <span className="info-value font-semibold text-base-content">{paymentInfo?.shopName}</span>
                </div>
                <div className="info-row flex justify-between py-2">
                  <span className="info-label text-base-content/60">Owner Name:</span>
                  <span className="info-value font-semibold text-base-content">{paymentInfo?.ownerName}</span>
                </div>
                <div className="info-row flex justify-between py-2">
                  <span className="info-label text-base-content/60">Owner Email:</span>
                  <span className="info-value font-semibold text-base-content">{paymentInfo?.ownerEmail}</span>
                </div>
              </div>
            </div>

            {/* Transaction Key Details */}
            <div className="info-card info-card-trxn flex-1 bg-base-100 border border-neutral rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-base-content mb-5 pb-3 border-b-2 border-neutral flex items-center gap-3">
                <span className="icon text-info">#</span>
                Key Transaction Info
              </h3>
              <div className="space-y-3">
                <div className="info-row flex justify-between py-2 border-b-0">
                  <span className="info-label text-base-content/60">Card Type:</span>
                  <span className="info-value uppercase">{paymentInfo.card_type}</span>
                </div>
                <div className="info-row flex justify-between py-2 border-b-0">
                  <span className="info-label ext-base-content/60">Purpose:</span>
                  <span className="info-value">{paymentInfo.purpose}</span>
                </div>
                <div className="info-row flex justify-between py-2 border-b-0">
                  <span className="info-label ext-base-content/60">Status:</span>
                  <span className="info-value">
                    <span className="badge-success bg-success/20 text-success border border-success px-3 py-1 rounded-full text-xs font-bold">
                      {paymentInfo.status}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>


          {/* Detailed Transaction Section */}
          <div className="bg-base-100 border border-neutral rounded-xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-base-content mb-6 pb-4 border-b-4 border-neutral">
              Complete Transaction Record
            </h3>
            <div className="space-y-1">
              <div className="info-row flex justify-between py-3">
                <span className="info-label text-base-content/60">Transaction ID:</span>
                <span className="info-value font-mono text-base">{paymentInfo.tran_id}</span>
              </div>
              <div className="info-row flex justify-between py-3">
                <span className="info-label text-base-content/60">Bank Transaction ID:</span>
                <span className="info-value font-mono text-base">{paymentInfo.bank_tran_id}</span>
              </div>
              <div className="info-row flex justify-between py-3">
                <span className="info-label text-base-content/60">MechaLink Shop ID:</span>
                <span className="info-value font-mono text-base">{shopID}</span>
              </div>

              {/* Grand Total Row */}
              <div className="info-row flex justify-between items-center pt-8 border-t-4 border-dashed border-neutral">
                <span className="info-label text-base-content text-2xl font-bold">TOTAL AMOUNT PAID:</span>
                <span className="info-value-large text-4xl font-extrabold text-success">
                  ৳{paymentInfo.amount}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer-text text-center text-base-content/60 text-sm mt-12 pt-8 border-t border-neutral">
            <p className="font-bold mb-1 text-base-content/80">Thank you for trusting MechaLink with your services!</p>
            <p>This invoice is system-generated and serves as an official proof of payment.</p>
          </div>
        </div>

        {/* Action Buttons (Not for PDF) */}
        <div className="action-buttons flex flex-col sm:flex-row justify-center gap-6 mt-12 pt-8 border-t-2 border-neutral">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
            disabled={!printJS}
          >
            <FaDownload className="w-5 h-5" />
            Download Invoice PDF
          </button>
          <Link
            href="/dashboard/mechanic/profile"
            className="flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-800 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <FaUser className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}