import { DashboardNavbar } from "@/components/dashboard-navbar"
import { DashboardHero } from "@/components/dashboard-hero"
import { DashboardMain } from "@/components/dashboard-main"
import { ModeComparison } from "@/components/mode-comparison"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardNavbar />
      <DashboardHero />
      <DashboardMain />
      <ModeComparison />
    </div>
  )
}
