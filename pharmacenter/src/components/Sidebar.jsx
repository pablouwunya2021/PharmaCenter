import React, { useEffect } from 'react'

function Sidebar() {
  useEffect(() => {
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    const openSidebar = document.getElementById('openSidebar')
    const closeSidebar = document.getElementById('closeSidebar')

    openSidebar?.addEventListener('click', () => {
      sidebar.classList.add('open')
      overlay.classList.add('active')
    })

    closeSidebar?.addEventListener('click', () => {
      sidebar.classList.remove('open')
      overlay.classList.remove('active')
    })

    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open')
      overlay.classList.remove('active')
    })
  }, [])

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <h2>Farmacia</h2>
        <button id="closeSidebar">&times;</button>
      </div>
      <nav>
        <ul>
          <li><a href="/login.html">Login Administrativo</a></li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
