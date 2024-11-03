'use client'

import { AdminSidebar } from '@/components/custom/sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import withAdminProtection from '@/hoc/withAdminProtection'

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

export default withAdminProtection(AdminLayout)
