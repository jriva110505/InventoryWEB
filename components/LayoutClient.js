'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

export default function LayoutClient({ children }) {

  const pathname = usePathname()

  const hideSidebar =
    pathname === '/' ||
    pathname === '/login'

  return (
    <div style={{ display: 'flex' }}>

      {!hideSidebar && <Sidebar />}

      <div
        className="main"
        style={{
          marginLeft: hideSidebar ? 0 : 250,  // 👈 FIX HERE
          width: '100%',
        }}
      >
        {children}
      </div>

    </div>
  )
}