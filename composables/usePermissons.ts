export const usePermissions = () => {
    const permissions = [
      // Dashboard
      { label: 'Dashboard', value: 'view_dashboard' },
  
      // Members section
      { label: 'Members', value: 'manage_members' },
      { label: 'List Members', value: 'view_members' },
      { label: 'Pending Members', value: 'view_pending_members' },
  
      // Reports section
      { label: 'Reports', value: 'view_reports' },
      { label: 'Transactions', value: 'view_transactions' },
  
      // Settings section
      { label: 'Settings', value: 'manage_settings' },
      { label: 'Admins', value: 'view_admins' },
      { label: 'Roles', value: 'view_roles' },
      { label: 'Countries', value: 'view_countries' }
    ]
  
    return {
      permissions
    }
  }
  