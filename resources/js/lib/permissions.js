export function hasPermission(permissions = [], permission) {
    return permissions.includes('*') || permissions.includes(permission);
}

export function hasAnyPermission(permissions = [], requiredPermissions = []) {
    if (permissions.includes('*')) {
        return true;
    }

    return requiredPermissions.some((permission) => permissions.includes(permission));
}
