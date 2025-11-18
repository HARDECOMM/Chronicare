export function getRedirectUrlForRole(role) {
  switch (role?.toLowerCase()) {
    case 'doctor':
      return '/doctor/dashboard';
    case 'patient':
      return '/patient/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/select-role';
  }
}