<<<<<<< HEAD


=======
>>>>>>> 33088b2b3f824cb282715d8d26246c423e1d4133
export default async function getUserData(userEmail) {
    const res =await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users?email=${userEmail}`);
    const result = await res.json();
    return result;
<<<<<<< HEAD
}
=======
}

>>>>>>> 33088b2b3f824cb282715d8d26246c423e1d4133
