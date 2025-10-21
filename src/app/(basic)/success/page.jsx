"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
// import printJS from "print-js";
import { useEffect, useState } from "react";
import { FaGear } from "react-icons/fa6";

export default function SuccessPage() {
  const params = useSearchParams();
  const shopID = params.get("shopID");
  const trxn = params.get("trxn");
  const [paymentInfo, setPaymentInfo] = useState({});
  const [printJS, setPrintJS] = useState(null);

 useEffect(() => {
    import("print-js").then((mod) => setPrintJS(() => mod.default));
  }, []);

  useEffect(() => {
    fetch(`/api/payment/${shopID}`).then((res) => res.json()).then((data) => { setPaymentInfo(data) }).catch((err) => console.error("Payment fetch error:", err));
  }, [shopID]);

  const handleDownloadPDF = () => {
      if (!printJS) return;
    const content = document.getElementById('invoiceSection');
    if (!content) return;

    printJS({
      printable: content.innerHTML,
      type: 'raw-html',
      style: `
        body { font-family: sans-serif; font-size: 12px; color: #000; }
        .logo-wrap{display:flex;align-items:center;justify-content:space-between;}
        .logo-wrap img{height:48px;}
        .logo-wrap div{text-align:right;}
        .logo-wrap h2{font-size:30px;font-weight:700;color:green;}
        .logo-wrap p{color:#777;margin-top:4px;}
        p{color:#777;font-size:16px;}
        .details{margin-top:24px;border:1px solid #ddd;padding:12px;border-radius:4px;}
        .details h2{font-size:20px;font-weight:600;margin-bottom:12px;}
        .details p{margin:8px 0;}
        .shop p{font-size:18px;}
        .gear-wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;}
      .gear{height:48px;width:48px;color:#f97316;}
      h1{font-size:24px;font-weight:700;}
      h1 span{color:#f97316;}
      `
    });
  };


  if (!paymentInfo.tran_id) {
  return <p className="text-center mt-10 text-gray-600">Loading...</p>;
}
  if (!shopID || trxn !== paymentInfo.tran_id) {
    return (
      <div className="flex items-center justify-between border-b pb-4  shadow-lg rounded-xl p-8 w-full max-w-2xl mx-auto my-20">
        <div className="gear-wrap flex gap-2 lg:gap-3 items-center">
          <FaGear
            className={`gear h-6 w-6 lg:h-12 lg:w-12 text-primary`}
          />
          <h1 className="text-2xl lg:text-3xl font-bold">Mecha<span className="text-primary">Link</span></h1>
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-bold text-primary">Payment Please!</h1>
          <p className="text-gray-600 mt-1 text-sm">
            You need to pay first to see deatails
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">

        <div id="invoiceSection">

          <div className="logo-wrap flex items-center justify-between border-b pb-4 mb-6">

            <div className="gear-wrap flex gap-2 lg:gap-3 items-center">
              <FaGear
                className={`gear h-6 w-6 lg:h-12 lg:w-12 text-primary`}
              />
              <h1 className="text-2xl lg:text-3xl font-bold">Mecha<span className="text-primary">Link</span></h1>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-primary">Payment Successful!</h2>
              <p className="text-gray-600 mt-1 text-sm">
                Date: {paymentInfo.paymentDate}
              </p>
            </div>
          </div>
          <div className="shop text-lg">
            <p><strong>Shop Name:</strong> {paymentInfo?.shopName}</p>
            <p><strong>Owner Name:</strong> {paymentInfo?.ownerName}</p>
            <p><strong>Owner Email:</strong> {paymentInfo?.ownerEmail}</p>
          </div>


          <div className="details border rounded-lg p-6 bg-gray-100 mt-5">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Invoice Details</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Transaction ID:</strong> {paymentInfo.tran_id}</p>
              <p><strong>Bank Transaction ID:</strong> {paymentInfo.bank_tran_id}</p>
              <p><strong>Shop ID:</strong> {shopID}</p>
              <p><strong>Card Type:</strong> {paymentInfo.card_type}</p>
              <p><strong>Amount:</strong> ৳{paymentInfo.amount}</p>
              <p><strong>Status:</strong> {paymentInfo.status}</p>
              <p><strong>Purpose:</strong> {paymentInfo.purpose}</p>
              <p><strong>Payment Date:</strong> {new Date(paymentInfo.paymentDate).toLocaleString()}</p>
            </div>
          </div>


          <div className="text-center text-gray-500 text-sm mt-8">
            <p>Thank you for trusting us!</p>
            <p>This invoice is system-generated and valid without a signature.</p>
          </div>
        </div>


        <div className="text-center mt-8 flex justify-center gap-4">
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Download Invoice PDF
          </button>
          <Link
            href="/dashboard/mechanic/profile"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
          >
            Go to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
