useEffect(() => {
  if (!session?.user?.email) return; // prevent empty fetch

  fetch(`/api/users?email=${session.user.email}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched user:", data); // 👈 console log here
      setLoggedInUser(data);
    })
    .catch((err) => console.error("Error fetching user:", err));
}, [session?.user?.email]);

