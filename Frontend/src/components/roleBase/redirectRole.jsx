// src/pages/redirectRole.js

const roleRoutes = {
  doctor: "/doctor",
  patient: "/patient",
};

export function getRedirectUrlForRole(role) {
  if (!role) return "/select-role";   // no role yet → force selection
  const normalized = role.toLowerCase();
  return roleRoutes[normalized] || "/select-role";
}
