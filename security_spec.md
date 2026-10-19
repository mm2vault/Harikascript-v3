# Security Specification

## 1. Data Invariants
- Scripts can be read by any visitor or authenticated user.
- Script creations/updates/deletions must be performed by the script author or an Admin (`huseynoveleddin87@gmail.com`).
- Games, Executors, MM2Items, and Tasks collections can be read by all users, and created/modified/deleted by Admins or authorized contributors.
- User profile data can be read by public (for social card, profile view) and written by the authenticated owner (`request.auth.uid == userId`) or Admin.
- The Admin email `huseynoveleddin87@gmail.com` has full administrative override rights.

## 2. The Dirty Dozen Payloads & Negative Tests
1. Unauthenticated user trying to delete a script.
2. Regular user attempting to edit another author's script without admin privileges.
3. User sending script payload with code exceeding maximum size (50,000 characters).
4. User attempting to spoof their coin count or role directly without authentication.
5. Injected ID with special characters like `/scripts/../../hack`.
6. User attempting to delete MM2 trading items without admin privilege.
7. User updating an executor with missing essential fields.
8. Non-owner attempting to modify someone else's user profile.
9. Malicious user injecting huge payload into title/description.
10. Anonymous user trying to write to admin-protected collections.
11. User attempting to grant themselves admin role in user profile.
12. Broken document keys or invalid datatypes in script objects.
