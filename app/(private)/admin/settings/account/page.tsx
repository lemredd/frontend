import { AdminPasswordForm } from "@/components/custom/admin/admin-password-form";

export default async function AccountSettings() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1>Account Settings</h1>
      <div className="min-h-[100vh] flex-1 p-4 rounded-xl bg-muted/50 md:min-h-min">
        <AdminPasswordForm />
      </div>
    </div>
  )
}
