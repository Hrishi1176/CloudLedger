export function hasPermission(permissions: string[], requiredAction: string): boolean {
  return permissions.some(action => {
    if (action === requiredAction) return true;
    if (action.endsWith('*')) {
      const prefix = action.slice(0, -1); // e.g. "read:" from "read:*"
      return requiredAction.startsWith(prefix);
    }
    return false;
  });
}

// Built-in Roles configuration helper
export const DEFAULT_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  AUDITOR: 'AUDITOR'
};
