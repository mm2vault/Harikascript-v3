export const ADMIN_EMAILS: readonly string[] = [
  'mm2ultimatehub@gmail.com',
  'huseynoveleddin87@gmail.com'
];

/**
 * Checks if a user is an authorized admin.
 * The UI role is not sufficient on its own; the email must be allowlisted too.
 * Callers must additionally ensure the role came from a verified Firebase session.
 */
export const isAuthorizedAdmin = (user?: { email?: string | null; role?: string } | null): boolean => {
  if (!user || !user.email) return false;
  const cleanEmail = user.email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(cleanEmail) && user.role === 'admin';
};

/**
 * Checks if an email address belongs to one of the authorized administrators.
 */
export const isAuthorizedAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(cleanEmail);
};

