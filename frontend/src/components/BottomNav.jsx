import { Home, Target, BarChart2 } from 'lucide-react'

function BottomNav() {
  const path = window.location.pathname

  function ir(rota) {
    window.location.href = rota
  }

  const itens = [
    { rota: '/dashboard', icone: Home, label: 'Início' },
    { rota: '/orcamentos', icone: Target, label: 'Orçamentos' },
    { rota: '/relatorios', icone: BarChart2, label: 'Relatórios' },
  ]

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #F7C8D3',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0',
      zIndex: 100
    }}>
      {itens.map(item => {
        const Icone = item.icone
        const ativo = path === item.rota
        return (
          <button
            key={item.rota}
            onClick={() => ir(item.rota)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              color: ativo ? '#B46A72' : '#A8B58A',
              fontSize: '0.65rem', fontWeight: ativo ? '700' : '400'
            }}
          >
            <Icone size={20} />
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default BottomNav