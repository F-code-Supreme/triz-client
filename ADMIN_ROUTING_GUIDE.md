# Admin Routing Guide

This guide explains how to add new routes to the admin panel in the TRIZ application.

## Overview

The admin routing system uses TanStack Router with a file-based routing structure. The admin section is protected by role-based access control and uses a consistent layout pattern.

## Current Admin Structure

### Route Files

- **Main admin route**: `/src/routes/admin/route.tsx` - Entry point for admin panel
- **Dashboard route**: `/src/routes/admin/dashboard/route.tsx` - Admin dashboard
- **Layouts**: `/src/layouts/admin-layout.tsx` - Layout wrapper for admin pages
- **Sidebar data**: `/src/components/layout/data/admin-sidebar-data.ts` - Navigation menu configuration

### Components

- **AdminSidebar**: `/src/components/layout/admin-sidebar.tsx` - Sidebar navigation
- **AdminLayout**: `/src/layouts/admin-layout.tsx` - Layout with role-based access control

## Step-by-Step: Adding a New Admin Route

### Step 1: Create the Page Component

Create your page component in `/src/pages/main/admin/[feature-name]/index.tsx`:

```tsx
// Example: /src/pages/main/admin/customers/index.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/layouts/admin-layout';

const AdminCustomersPage = () => {
  return (
    <AdminLayout meta={{ title: 'Manage Customers' }}>
      <div className="space-y-6 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage all customer accounts and subscriptions.
          </p>
        </div>
        {/* Your page content here */}
        <Card>
          <CardHeader>
            <CardTitle>Customers List</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Content */}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomersPage;
```

### Step 2: Create the Route File

Create a route file at `/src/routes/admin/[feature-name]/route.tsx`:

```tsx
// Example: /src/routes/admin/customers/route.tsx
import { createFileRoute } from '@tanstack/react-router';

import AdminCustomersPage from '@/pages/main/admin/customers';

export const Route = createFileRoute('/admin/customers')({
  component: AdminCustomersPage,
});
```

### Step 3: Update Sidebar Navigation

Add your route to the sidebar menu in `/src/components/layout/data/admin-sidebar-data.ts`:

```typescript
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Package,
  CreditCard,
  GraduationCap,
  Settings,  // Add your icon import
} from 'lucide-react';

export const adminSidebarData: AdminSidebarData = {
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/admin',
          icon: LayoutDashboard,
          isActive: true,
        },
      ],
    },
    {
      title: 'Management',
      items: [
        // ...existing items...
        {
          title: 'Customers',  // Your new menu item
          url: '/admin/customers',
          icon: Users,
        },
        // Add more items as needed
      ],
    },
  ],
  // ...existing code...
};
```

### Step 4: (Optional) Create Sub-routes

If your feature needs multiple pages (e.g., list, create, edit), create additional route files:

```tsx
// Example: /src/routes/admin/customers/$customerId/route.tsx
import { createFileRoute } from '@tanstack/react-router';

import AdminCustomerDetailPage from '@/pages/main/admin/customers/detail';

export const Route = createFileRoute('/admin/customers/$customerId')({
  component: AdminCustomerDetailPage,
});
```

## Important Details

### Role-Based Access Control

The admin layout automatically checks if the user has the `ADMIN` role:

```tsx
// From admin-layout.tsx
const { hasRole } = useAuth();

if (!hasRole(Role.ADMIN)) {
  return (
    <Navigate
      to="/unauthorized"
      search={{
        redirect: '/admin',
      }}
    />
  );
}
```

**No additional authentication checks needed** - the `AdminLayout` component handles this.

### Route Protection

The main admin route (`/src/routes/admin/route.tsx`) includes authentication checks:

```tsx
beforeLoad: ({ context, location }) => {
  if (!context.auth.isAuthenticated) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href,
      },
    });
  }
},
```

### Metadata

Always pass a `meta` object to the `AdminLayout` to set the page title:

```tsx
<AdminLayout meta={{ title: 'Page Title' }}>
  {/* content */}
</AdminLayout>
```

## File Structure Summary

```
/src/
├── pages/main/admin/
│   ├── dashboard/
│   │   └── index.tsx
│   ├── customers/
│   │   ├── index.tsx
│   │   └── detail.tsx
│   └── [new-feature]/
│       └── index.tsx
│
├── routes/admin/
│   ├── route.tsx (main admin entry)
│   ├── dashboard/
│   │   └── route.tsx
│   ├── customers/
│   │   ├── route.tsx
│   │   └── $customerId/
│   │       └── route.tsx
│   └── [new-feature]/
│       └── route.tsx
│
├── layouts/
│   └── admin-layout.tsx
│
└── components/layout/
    ├── admin-sidebar.tsx
    └── data/
        └── admin-sidebar-data.ts
```

## Available Icons

Icons from `lucide-react` available in sidebar:

- `LayoutDashboard` - Dashboard
- `Users` - Customers/Users
- `BookOpen` - Books
- `Package` - Packages
- `CreditCard` - Subscriptions/Billing
- `GraduationCap` - Courses
- `Settings` - Settings
- `BarChart3` - Analytics
- And many more...

## Example: Complete Customers Feature

### 1. Page Component

```tsx
// /src/pages/main/admin/customers/index.tsx
import { AdminLayout } from '@/layouts/admin-layout';

const AdminCustomersPage = () => {
  return (
    <AdminLayout meta={{ title: 'Customers' }}>
      <div className="space-y-6 p-4">
        <h1 className="text-3xl font-bold">Customers</h1>
        {/* Customer management UI */}
      </div>
    </AdminLayout>
  );
};

export default AdminCustomersPage;
```

### 2. Route File

```tsx
// /src/routes/admin/customers/route.tsx
import { createFileRoute } from '@tanstack/react-router';
import AdminCustomersPage from '@/pages/main/admin/customers';

export const Route = createFileRoute('/admin/customers')({
  component: AdminCustomersPage,
});
```

### 3. Update Sidebar

```typescript
// /src/components/layout/data/admin-sidebar-data.ts
{
  title: 'Customers',
  url: '/admin/customers',
  icon: Users,
}
```

That's it! The route will automatically be:

- ✅ Protected by admin role check
- ✅ Available in the sidebar navigation
- ✅ Styled with the admin layout
- ✅ Accessible via `/admin/customers`

## Debugging Tips

1. **Route not appearing in sidebar?** - Check that the URL in `admin-sidebar-data.ts` matches exactly with the route path
2. **Getting unauthorized error?** - Ensure your user has the `ADMIN` role
3. **Page not loading?** - Verify the component import path is correct and the file exists
4. **Sidebar not highlighting?** - The active state is handled automatically by TanStack Router based on the current URL

## Next Steps

- Use existing UI components from `/src/components/ui/` for consistency
- Follow the same pattern as the Dashboard page for content layout
- Consider creating reusable components for common admin features (tables, forms, etc.)
