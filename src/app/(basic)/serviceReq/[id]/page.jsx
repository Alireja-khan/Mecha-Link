import ServiceReqCard from "../components/ServiceReqCard";

async function getRequest(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/service-request/${id}`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function ServiceRequestDetails({ params }) {
  const request = await getRequest(params.id);

  if (!request || request.error) {
    return <p className="text-center text-red-500">Request not found.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <ServiceReqCard request={request} mode="detail" />
    </div>
  );
}
