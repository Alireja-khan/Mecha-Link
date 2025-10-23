"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Download, User, Info, Home, Tag } from "lucide-react";
import { FaGear } from "react-icons/fa6"; 

// --------------------------------------------------------------------------
// UPDATED printStyles FOR A CLEANER, PROFESSIONAL PDF/PRINT INVOICE LOOK
// --------------------------------------------------------------------------
const printStyles = `
  @page {
    size: A4;
    /* Reduced margin for more content space */
    margin: 10mm 15mm; 
  }

  :root {
    /* Define primary color for print (e.g., orange) */
    --color-primary: #f97316; 
  }

  body { 
    font-family: 'Inter', sans-serif; 
    font-size: 11pt; /* Slightly larger for A4 readability */
    color: #000000; /* Force black text */
    margin: 0; 
    padding: 0; 
    line-height: 1.5;
    background-color: #ffffff; /* Ensure white background */
  }

  .invoice-container { 
    max-width: 100%;
    margin: 0; 
    background: #ffffff; 
    padding: 0; /* Removed padding since it's covered by @page margin */
    border-radius: 0; 
    border: none; 
    box-shadow: none; /* Remove shadows */
  }
  
  /* --- Header / Logo --- */
  .logo-wrap { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    padding-bottom: 12px;
    border-bottom: 3px solid #374151; /* Darker, clearer line */
    margin-bottom: 25px;
  }
  .logo-wrap .brand { 
    display: flex; 
    align-items: center; 
    gap: 8px; 
  }
  .logo-wrap .gear { 
    height: 36px;
    width: 36px; 
    color: var(--color-primary); /* Use defined primary color */
  }
  .logo-wrap h1 { 
    font-size: 24px; /* Larger title */
    font-weight: 800; 
  }
  .logo-wrap .text-primary { 
    color: var(--color-primary); 
  }
  .logo-wrap .invoice-label { 
    font-size: 10px; 
    color: #374151; /* Dark grey for contrast */
  }
  .logo-wrap .invoice-date { 
    font-size: 11px; 
    color: #000000; 
    font-weight: 600;
  }

  /* --- Success Badge - Simplified for Print --- */
  .success-badge { 
    text-align: center; 
    margin: 20px 0 30px 0; 
    padding: 10px 15px; 
    border-radius: 6px; 
    /* High contrast background/border for print */
    background: #f0fdf4; 
    border: 1px solid #10b981; 
  }
  .success-icon { 
    display: none !important; /* Hide large icon for cleaner print */
  }
  .success-badge > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .success-title { 
    font-size: 18px; 
    font-weight: 800; 
    color: #047857; /* Dark green */
    margin-bottom: 0px; 
  }
  .success-date {
    font-size: 11px;
    color: #374151;
    margin-top: 2px;
  }

  /* --- Ad Title Section --- */
  .ad-title-box {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #eff6ff; /* Light blue background for emphasis */
    border: 1px solid #93c5fd; 
    padding: 10px 15px;
    border-radius: 6px;
    margin-bottom: 25px;
  }
  .ad-title-box .lucide {
    width: 16px;
    height: 16px;
    color: #1d4ed8; /* Blue icon */
  }
  .ad-title-box p {
    font-size: 12px;
    color: #1f2937;
  }
  .ad-title-box span {
    font-size: 13px;
    font-weight: 700;
  }

  /* --- Two Column Info Layout for Print --- */
  .print-cols-2 {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 25px;
  }
  .print-cols-2 > div {
    width: 48%; /* Allocate space for two columns */
  }

  .info-card { 
    border: 1px solid #cccccc; /* Neutral border */
    border-radius: 6px; 
    padding: 15px; 
    background-color: #ffffff; /* Ensure white background */
    box-shadow: none;
  }
  .info-card h3 { 
    font-size: 14px; 
    font-weight: 700; 
    color: #1f2937; 
    margin-bottom: 8px; 
    padding-bottom: 5px; 
    border-bottom: 1px solid #e5e7eb; 
  }
  .info-card .icon {
    width: 14px;
    height: 14px;
    color: #374151;
  }

  .info-row { 
    display: flex; 
    justify-content: space-between; 
    padding: 6px 0; 
    border-bottom: 1px dashed #e5e7eb; /* Lighter dashed line */
  }
  .info-row:last-of-type { border-bottom: none; }
  .info-label { 
    color: #4b5563; 
    font-weight: 500; 
    font-size: 11px; 
  }
  .info-value { 
    color: #000000; 
    font-weight: 600; 
    font-size: 11px; 
    text-align: right; 
  }

  /* --- Complete Transaction Record (Total Section) --- */
  .total-record {
    border: 1px solid #cccccc;
    border-radius: 6px;
    padding: 20px;
    box-shadow: none;
    background-color: #f9fafb; /* Slightly grey background for this section */
  }
  .total-record h3 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e5e7eb;
  }
  .total-row-main { 
    padding-top: 15px; 
    margin-top: 10px; 
    border-top: 3px solid var(--color-primary); /* Bold primary color line */
  }
  .info-label-total { 
    font-size: 18px; 
    font-weight: 700; 
    color: #1f2937;
  }
  .info-value-total { 
    font-size: 30px; 
    font-weight: 800; 
    color: #059669; /* Green for the total amount */
  }
  .badge-success {
    /* Simplify badge for print */
    background-color: transparent !important;
    border: 1px solid #059669 !important;
    color: #059669 !important;
    font-weight: bold;
    padding: 2px 5px;
    border-radius: 4px;
  }


  /* --- Footer and Controls --- */
  .footer-text { 
    text-align: center; 
    color: #6b7280; 
    font-size: 10px; 
    margin-top: 30px; 
    padding-top: 15px; 
    border-top: 1px solid #d1d5db; 
  }
  
  /* HIDE BUTTONS / CONTROLS ON PRINT */
  .action-buttons {
    display: none !important;
  }
`;

export default function SuccessPage() {
  const params = useSearchParams();
  const shopID = params.get("shopID");
  const trxn = params.get("trxn");
  const [paymentInfo, setPaymentInfo] = useState({});
  const [ad, setAd] = useState({});
  const [printJS, setPrintJS] = useState(null);

  useEffect(() => {
    import("print-js").then((mod) => setPrintJS(() => mod.default));
  }, []);

  useEffect(() => {
    if (paymentInfo?.adID) {
      fetch(`/api/ads/${paymentInfo.adID}`).then((res) => res.json()).then((data) => { setAd(data) }).catch((err) => console.error("Ad fetch error:", err));
    }
  }, [paymentInfo]);


  useEffect(() => {
    fetch(`/api/payment/${trxn}`).then((res) => res.json()).then((data) => { setPaymentInfo(data) }).catch((err) => console.error("Payment fetch error:", err));
  }, [trxn])

  const handleDownloadPDF = () => {
    if (!printJS) return;
    const content = document.getElementById("invoiceSection");
    if (!content) return;

    printJS({
      printable: content.innerHTML,
      type: "raw-html",
      // Use the refined printStyles here
      style: printStyles, 
      documentTitle: `Invoice-${paymentInfo.tran_id}`,
      onPrintDialogClose: () => {},
    });
  };

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
              <User />
              Return to Profile Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 flex justify-center bg-base-100">
      {/* Reduced outer padding for better alignment with print settings */}
      <div className="invoice-container bg-base-200 shadow-2xl rounded-2xl p-8 lg:p-10 w-full max-w-5xl border-t-8 border-primary">

        <div id="invoiceSection">
          <div className="logo-wrap flex items-center justify-between border-b-4 border-primary pb-4 mb-6">
            <div className="brand flex gap-2 items-center">
              <FaGear className="gear h-10 w-10 text-primary" />
              <h1 className="text-3xl font-extrabold text-base-content">
                Mecha<span className="text-primary orange">Link</span>
              </h1>
            </div>
            <div className="text-right">
              <p className="invoice-label text-base-content/60 font-semibold uppercase tracking-wider">Invoice</p>
              <p className="invoice-date text-base-content/80 font-medium mt-1 text-sm">
                Date: {new Date(paymentInfo.paymentDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="success-badge flex items-center gap-4 py-4 px-6 bg-success/10 border border-success/40 rounded-xl shadow-md mb-6">
            <CheckCircle className="success-icon text-5xl text-success flex-shrink-0" />
            <div>
              <h2 className="success-title text-2xl font-extrabold text-success leading-tight">
                Payment Successful!
              </h2>
              <p className="success-date text-base-content/70 text-sm mt-1">
                Transaction Completed at: {new Date(paymentInfo.paymentDate).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          {/* Ad Title Section - Added print-specific class `ad-title-box` */}
          {ad.title && (
            <div className="ad-title-box flex items-center gap-3 bg-info/10 border border-info/40 text-info px-5 py-3 rounded-lg shadow-sm mb-8">
              <Tag className="w-5 h-5 flex-shrink-0" />
              <p className="text-base-content font-semibold">
                Ad Title Purchased: <span className="font-bold text-base">{ad.title}</span>
              </p>
            </div>
          )}

          {/* Info Card Section - Added print-specific class `print-cols-2` */}
          <div className="info-card-section print-cols-2 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="info-card info-card-shop bg-warning/10 border border-warning/40 rounded-xl p-5 shadow-lg">
              <h3 className="text-lg font-bold text-base-content mb-3 pb-2 border-b border-warning/50 flex items-center gap-2">
                <Home className="icon text-warning w-4 h-4" />
                Shop Information
              </h3>
              <div className="space-y-1">
                <div className="info-row flex justify-between py-1 border-b-0">
                  <span className="info-label text-sm text-base-content/60">Shop Name:</span>
                  <span className="info-value font-semibold text-base-content text-sm">{paymentInfo?.shopName}</span>
                </div>
                <div className="info-row flex justify-between py-1 border-b-0">
                  <span className="info-label text-sm text-base-content/60">Owner Name:</span>
                  <span className="info-value font-semibold text-base-content text-sm">{paymentInfo?.ownerName}</span>
                </div>
                <div className="info-row flex justify-between py-1 border-b-0">
                  <span className="info-label text-sm text-base-content/60">Owner Email:</span>
                  <span className="info-value font-semibold text-base-content text-sm">{paymentInfo?.ownerEmail}</span>
                </div>
              </div>
            </div>

            <div className="info-card info-card-trxn bg-base-100 border border-neutral/40 rounded-xl p-5 shadow-lg">
              <h3 className="text-lg font-bold text-base-content mb-3 pb-2 border-b border-neutral/50 flex items-center gap-2">
                <Info className="icon text-info w-4 h-4" />
                Key Transaction Info
              </h3>
              <div className="space-y-1">
                <div className="info-row flex justify-between py-1 border-b-0">
                  <span className="info-label text-sm text-base-content/60">Card Type:</span>
                  <span className="info-value uppercase text-sm">{paymentInfo.card_type}</span>
                </div>
                <div className="info-row flex justify-between py-1 border-b-0">
                  <span className="info-label text-sm text-base-content/60">Purpose:</span>
                  <span className="info-value text-sm">{paymentInfo.purpose}</span>
                </div>
                <div className="info-row flex justify-between py-1 border-b-0">
                  <span className="info-label text-sm text-base-content/60">Status:</span>
                  <span className="info-value">
                    <span className="badge-success bg-success/20 text-success border border-success px-2 py-[2px] rounded-full text-xs font-bold">
                      {paymentInfo.status}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Complete Transaction Section - Added print-specific class `total-record` */}
          <div className="total-record bg-base-100 border border-neutral/40 rounded-xl p-6 shadow-xl mb-8">
            <h3 className="text-xl font-bold text-base-content mb-4 pb-3 border-b-2 border-neutral/50">
              Complete Transaction Record
            </h3>
            
            <div className="space-y-1">
              <div className="info-row flex justify-between py-2">
                <span className="info-label text-base-content/60">Transaction ID:</span>
                <span className="info-value font-mono text-sm">{paymentInfo.tran_id}</span>
              </div>
              <div className="info-row flex justify-between py-2">
                <span className="info-label text-base-content/60">Bank Transaction ID:</span>
                <span className="info-value font-mono text-sm">{paymentInfo.bank_tran_id}</span>
              </div>
              <div className="info-row flex justify-between py-2">
                <span className="info-label text-base-content/60">MechaLink Shop ID:</span>
                <span className="info-value font-mono text-sm">{shopID}</span>
              </div>

              {/* Total Row - Changed class for print specificity */}
              <div className="total-row total-row-main flex justify-between items-center pt-6 mt-4 border-t-4 border-primary/50">
                <span className="info-label info-label-total text-base-content text-xl font-bold">TOTAL AMOUNT PAID:</span>
                <span className="info-value-large info-value-total text-3xl font-extrabold text-success">
                  ৳{paymentInfo.amount}
                </span>
              </div>
            </div>
          </div>

          <div className="footer-text text-center text-base-content/60 text-xs mt-8 pt-6 border-t border-neutral/50">
            <p className="font-bold mb-1 text-base-content/80">Thank you for trusting MechaLink with your services!</p>
            <p>This invoice is system-generated and serves as an official proof of payment.</p>
          </div>
        </div>

        {/* Action buttons are outside the printable section and hidden by printStyles */}
        <div className="action-buttons flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t-2 border-neutral/50">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            disabled={!printJS}
          >
            <Download className="w-4 h-4" />
            Download Invoice PDF
          </button>
          <Link
            href="/dashboard/mechanic/profile"
            className="flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <User className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}