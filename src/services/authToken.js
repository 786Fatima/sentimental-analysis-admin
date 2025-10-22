export function setAdminToken(token) {
  if (token) localStorage.setItem("adminToken", token);
  else localStorage.removeItem("adminToken");
}

export function getAdminToken() {
  return localStorage.getItem("adminToken");
}
