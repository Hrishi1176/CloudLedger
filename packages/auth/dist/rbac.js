"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ROLES = void 0;
exports.hasPermission = hasPermission;
function hasPermission(permissions, requiredAction) {
    return permissions.some(action => {
        if (action === requiredAction)
            return true;
        if (action.endsWith('*')) {
            const prefix = action.slice(0, -1); // e.g. "read:" from "read:*"
            return requiredAction.startsWith(prefix);
        }
        return false;
    });
}
// Built-in Roles configuration helper
exports.DEFAULT_ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    AUDITOR: 'AUDITOR'
};
