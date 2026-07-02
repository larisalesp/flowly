import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Orcamentos from './pages/Orcamentos'
import Relatorios from './pages/Relatorios'

function App() {
  const token = localStorage.getItem('token')
  if (!token) return <Login />

  const path = window.location.pathname
  if (path === '/orcamentos') return <Orcamentos />
  if (path === '/relatorios') return <Relatorios />
  return <Dashboard />
}

export default App