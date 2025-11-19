
export async function POST(req) {
  const formData = await req.formData();
  const data = Object.fromEntries(formData);

  const query = new URLSearchParams({
    tran_id: data.tran_id || "",
    message: data.cancel_reason || "Payment cancelled by user",
  }).toString();

  return new Response(null, {
    status: 302,
    headers: {
      Location: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel?${query}`,
    },
  });
}
