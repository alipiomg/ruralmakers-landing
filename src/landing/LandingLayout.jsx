import { Outlet } from 'react-router-dom'

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-[#2C2A25] landing-cursor">
      <Outlet />
    </div>
  )
}
