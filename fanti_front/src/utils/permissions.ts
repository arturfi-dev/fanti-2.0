/**
 * RBAC Permission System - Granular Action-Based Access Control
 * 
 * This module defines a flexible permission system where:
 * - Permissions are defined as "resource:action" strings (e.g., "periods:create", "projects:delete")
 * - Roles have specific sets of permissions
 * - Easy to extend with new roles and permissions
 */

// Define all possible actions
export type Action =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'manage' // full access (view + create + edit + delete)
  | 'export'
  | 'assign';

// Define all resources in the system
export type Resource =
  | 'periods'
  | 'projects'
  | 'sprints'
  | 'tasks'
  | 'teams'
  | 'users'
  | 'faq'

// Permission format: "resource:action"
export type Permission = `${Resource}:${Action}`;

// Role definitions with their permissions
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  // Administrator - Full access to everything
  Administrator: [
    'periods:manage',
    'projects:manage',
    'sprints:manage',
    'tasks:manage',
    'teams:manage',
    'users:manage',
    'faq:manage',
  ],

  // Product Owner - Manages projects, periods, and views reports
  'PO': [
    'sprints:view',
    'tasks:view',
    'projects:view',
    'periods:view',
    'teams:view'
  ],

  // Developer - Views work, edits assigned tasks, adds lessons learned
  Dev: [
    'periods:view',
    'projects:view',
    'sprints:view',
    'tasks:view',
    'teams:view',
  ],
};

// Helper to expand "manage" action into all CRUD actions
function expandPermissions(permissions: Permission[]): Set<Permission> {
  const expanded = new Set<Permission>();

  permissions.forEach(permission => {
    const [resource, action] = permission.split(':') as [Resource, Action];

    if (action === 'manage') {
      // Expand "manage" into view, create, edit, delete
      expanded.add(`${resource}:view`);
      expanded.add(`${resource}:create`);
      expanded.add(`${resource}:edit`);
      expanded.add(`${resource}:delete`);
    } else {
      expanded.add(permission);
    }
  });

  return expanded;
}

/**
 * Check if a user has permission to perform an action on a resource
 * @param userRole - User's role from JWT token
 * @param resource - The resource to check (e.g., "periods", "projects")
 * @param action - The action to perform (e.g., "view", "create", "edit")
 * @returns boolean - true if user has permission
 */
export function hasPermission(
  userRole: string | undefined,
  resource: Resource,
  action: Action
): boolean {
  if (!userRole) return false;

  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  const expandedPermissions = expandPermissions(rolePermissions);

  const permission: Permission = `${resource}:${action}`;
  return expandedPermissions.has(permission);
}

/**
 * Check if a user can access a specific page/route
 * Maps routes to required permissions
 */
export function canAccessRoute(userRole: string | undefined, route: string): boolean {
  if (!userRole) return false;

  // Public routes (accessible to all authenticated users)
  const publicRoutes = ['/faq'];
  if (publicRoutes.includes(route)) return true;

  // Map routes to required permissions
  const routePermissions: Record<string, { resource: Resource; action: Action }> = {
    '/': { resource: 'projects', action: 'view' }, // Home shows overview
    '/projects': { resource: 'projects', action: 'view' },
    '/sprints': { resource: 'sprints', action: 'view' },
    '/tasks': { resource: 'tasks', action: 'view' },
    '/periods': { resource: 'periods', action: 'view' },
    '/teams-staff': { resource: 'teams', action: 'view' },
    '/users': { resource: 'users', action: 'view' },
    '/settings': { resource: 'projects', action: 'view' }, // Accessible to all
  };

  const requiredPermission = routePermissions[route];
  if (!requiredPermission) return true; // Allow access if route not defined

  return hasPermission(userRole, requiredPermission.resource, requiredPermission.action);
}

/**
 * Get all permissions for a user role
 * Useful for debugging or displaying user capabilities
 */
export function getUserPermissions(userRole: string | undefined): Permission[] {
  if (!userRole) return [];
  return ROLE_PERMISSIONS[userRole] || [];
}

/**
 * Check if user has any of the specified permissions (OR logic)
 */
export function hasAnyPermission(
  userRole: string | undefined,
  permissions: Array<{ resource: Resource; action: Action }>
): boolean {
  return permissions.some(({ resource, action }) =>
    hasPermission(userRole, resource, action)
  );
}

/**
 * Check if user has all of the specified permissions (AND logic)
 */
export function hasAllPermissions(
  userRole: string | undefined,
  permissions: Array<{ resource: Resource; action: Action }>
): boolean {
  return permissions.every(({ resource, action }) =>
    hasPermission(userRole, resource, action)
  );
}
