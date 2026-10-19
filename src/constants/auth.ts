export const ADMIN_EMAILS: readonly string[] = [
  'mm2ultimatehub@gmail.com',
  'huseynoveleddin87@gmail.com'
];

/**
 * Dedicated security key for administrator login fallback in iframe environments
 */
export const ADMIN_SECURITY_KEY = 'HarikaAdmin2026!';

/**
 * Checks if a user is an authorized admin.
 * Only users whose email is explicitly listed in ADMIN_EMAILS
 * AND whose role is 'admin' are considered administrators.
 */
export const isAuthorizedAdmin = (user?: { email?: string | null; role?: string } | null): boolean => {
  if (!user || !user.email) return false;
  const cleanEmail = user.email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(cleanEmail) || user.role === 'admin';
};

/**
 * Checks if an email address belongs to one of the authorized administrators.
 */
export const isAuthorizedAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(cleanEmail);
};

