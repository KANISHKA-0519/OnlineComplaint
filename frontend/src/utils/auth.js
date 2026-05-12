export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const isAuthenticated = () => Boolean(getToken());

export const getUserRole = () => getUser()?.role || null;

export const getDefaultDashboardPath = () => {
  const role = getUserRole();
  if (role === "admin") return "/admin-dashboard";
  if (role === "citizen") return "/citizen-dashboard";
  return "/login";
};

