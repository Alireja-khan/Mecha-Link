export async function POST(req) {
  const formData = await req.formData();
  const data = Object.fromEntries(formData);


  const query = new URLSearchParams({
    tran_id: data.tran_id || "",
    amount: data.amount || "",
    card_type: data.card_type || "",
    bank_tran_id: data.bank_tran_id || "",
    status: data.status || "",
    cus_name: data.cus_name || "",
  }).toString();

  return new Response(null, {
    status: 302,
    headers: {
      Location: `${process.env.NEXT_PUBLIC_BASE_URL}/success?${query}`,
    },
  });
}
