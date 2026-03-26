# Smart Ladies Hub

## Current State
Admin panel at `/admin` with Internet Identity login. After login, it calls `isCallerAdmin()` which internally calls `getUserRole()` -- this traps (crashes) for any user not yet registered in the system. Result: admin panel shows an error or access denied for the store owner on first login.

No "first-run setup" flow exists to assign admin role to the store owner.

## Requested Changes (Diff)

### Add
- `claimFirstAdmin()` backend function: if no admin has been assigned yet (`adminAssigned == false`), the caller becomes admin. Works only once.
- Safe `isCallerRegistered()` backend query that returns false instead of trapping for unregistered users.
- In AdminPage: after login, use a safe check; if user is not admin and no admin is assigned yet, show "Claim Admin" button that calls `claimFirstAdmin()`. After claiming, reload admin access.

### Modify
- `isCallerAdmin()` in access-control should not trap for unregistered users (return false safely).

### Remove
- Nothing

## Implementation Plan
1. Modify `access-control.mo` to add a safe `isAdminSafe` function that returns false for unregistered principals.
2. Modify `MixinAuthorization.mo` to use safe version in `isCallerAdmin`.
3. Add `claimFirstAdmin` to `main.mo` backend.
4. Add `isAdminAssigned` query to `main.mo` to let frontend check if any admin exists.
5. Update `AdminPage.tsx` to handle first-run setup: show Claim Admin button if no admin assigned.
