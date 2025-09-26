// Types are optional — remove them if you're in plain JS
type PermissionInput = { name?: string } | string;
type RoleInput = { permissions?: PermissionInput[] | null | undefined };

/**
 * Build a boolean map of permissions:
 * { "view-role": true, "add-role": true, ... }
 */
export const getPermissions = (role: RoleInput | null | undefined) => {
  const map: Record<string, true> = Object.create(null);
  const list = role?.permissions ?? [];
  for (const p of list) {
    const name = typeof p === "string" ? p : p?.name;
    if (name) map[name] = true;
  }
  return map;
};

/**
 * Convenience checker (accepts either the role or the boolean map).
 */
export const hasPermission = (
  perm: string,
  roleOrMap: RoleInput | Record<string, true> | null | undefined
): boolean => {
  if (!roleOrMap) return false;
  const map =
    typeof (roleOrMap as any).permissions !== "undefined"
      ? getPermissions(roleOrMap as RoleInput)
      : (roleOrMap as Record<string, true>);
  return !!map[perm];
};
