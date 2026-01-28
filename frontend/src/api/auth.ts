export const checkAuth = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  const response = await fetch('/api/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    localStorage.removeItem('token');
    throw new Error('Unauthorized');
  }

  return await response.json(); // { userId, username }
};