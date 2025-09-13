function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <h2 className="text-xl text-red-600">Вы не авторизованы!</h2>;
  }

  return (
    <div className="bg-white p-6 rounded shadow-md w-96">
      <h2 className="text-2xl font-bold mb-4">Мой профиль</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Имя:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}

export default Profile;
