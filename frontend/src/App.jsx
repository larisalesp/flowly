import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Orcamentos from './pages/Orcamentos'
import Relatorios from './pages/Relatorios'
import Transacoes from './pages/Transacoes'

function App() {
  const token = localStorage.getItem('token')
  if (!token) return <Login />

  const path = window.location.pathname
  if (path === '/orcamentos') return <Orcamentos />
  if (path === '/relatorios') return <Relatorios />
  if (path === '/transacoes') return <Transacoes />
  return <Dashboard />
}

export default App