import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate();

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

  const handleLoginClick = () => {
    navigate('/login');
  }

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <h2>Farmacia</h2>
        <button id="closeSidebar">&times;</button>
      </div>
      <nav>
        <ul>
          <li>
            <button 
              onClick={handleLoginClick}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#70589a', 
                textDecoration: 'none', 
                fontWeight: '100', 
                fontSize: '18px',
                cursor: 'pointer',
                padding: 0
              }}
            >
              Login Administrativo
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
