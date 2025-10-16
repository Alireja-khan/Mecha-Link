"use client";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();

  const paymentInfo = {
    tran_id: params.get("tran_id"),
    amount: params.get("amount"),
    card_type: params.get("card_type"),
    bank_tran_id: params.get("bank_tran_id"),
    status: params.get("status"),
    cus_name: params.get("cus_name"),
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
          <p className="text-gray-600 mt-2">Thank you for your purchase, {paymentInfo.cus_name}.</p>
        </div>

        <div className="printable  border rounded-lg p-6 bg-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Invoice Details</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Transaction ID:</strong> {paymentInfo.tran_id}</p>
            <p><strong>Bank Transaction ID:</strong> {paymentInfo.bank_tran_id}</p>
            <p><strong>Card Type:</strong> {paymentInfo.card_type}</p>
            <p><strong>Amount:</strong> ৳{paymentInfo.amount}</p>
            <p><strong>Status:</strong> {paymentInfo.status}</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
