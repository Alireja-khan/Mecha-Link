export default async function getUserData(userEmail) {
    const res =await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users?email=${userEmail}`);
    const result = await res.json();
    return result;
}

