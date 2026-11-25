'use client';

import { Action, canAccessRoute, hasAllPermissions, hasAnyPermission, hasPermission, Resource } from '@/utils/permissions';
import { useAuthContext } from './useAuth';

/**
 * Hook for component-level permission checks
 * 
 * Usage:
 * const { can, canAccess, canAny, canAll } = usePermissions();
 * 
 * if (can('periods', 'create')) {
 *   // Show create button
 * }
 */
export function usePermissions() {
  const { user } = useAuthContext();
  const userRole = user?.role;

  /**
   * Check if user can perform an action on a resource
   * @param resource - The resource (e.g., 'periods', 'projects')
   * @param action - The action (e.g., 'view', 'create', 'edit', 'delete')
   */
  const can = (resource: Resource, action: Action): boolean => {
    return hasPermission(userRole, resource, action);
  };

  /**
   * Check if user can access a specific route/page
   * @param route - The route path (e.g., '/periods', '/projects')
   */
  const canAccess = (route: string): boolean => {
    return canAccessRoute(userRole, route);
  };

  /**
   * Check if user has any of the specified permissions (OR logic)
   * @param permissions - Array of {resource, action} objects
   */
  const canAny = (permissions: Array<{ resource: Resource; action: Action }>): boolean => {
    return hasAnyPermission(userRole, permissions);
  };

  /**
   * Check if user has all of the specified permissions (AND logic)
   * @param permissions - Array of {resource, action} objects
   */
  const canAll = (permissions: Array<{ resource: Resource; action: Action }>): boolean => {
    return hasAllPermissions(userRole, permissions);
  };

  /**
   * Check if user is an administrator
   */
  const isAdmin = (): boolean => {
    return userRole === 'Administrator';
  };

  /**
   * Get the current user's role
   */
  const getRole = (): string | undefined => {
    return userRole;
  };

  return {
    can,
    canAccess,
    canAny,
    canAll,
    isAdmin,
    getRole,
    user,
  };
}
