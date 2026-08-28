export const getUser = () => {
  const token = sessionStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { email: payload.sub, role: localStorage.getItem('role') };
  } catch {
    return null;
  }
};

export const logout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('role');
  window.location.href = '/login';
};
