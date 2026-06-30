import { useState, useEffect } from 'react'

const API = 'http://localhost:8000'

function Dashboard() {
  const [resumo, setResumo] = useState(null)
  const [transacoes, setTransacoes] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    buscarResumo()
    buscarTransacoes()
  }, [])

  async function buscarResumo() {
    const res = await fetch(`${API}/reports/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setResumo(data)
  }

  async function buscarTransacoes() {
    const res = await fetch(`${API}/transactions/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setTransacoes(data.slice(0, 5))
  }

  function logout() {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  return (
    <div style={{minHeight:'100vh', backgroundColor:'#FFF7E6'}}>

      {/* NAVBAR */}
      <div style={{backgroundColor:'#2D3A47', padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{color:'#F7C8D3', fontWeight:'700', fontSize:'1.1rem'}}>Flowly ꕥ</span>
        <button onClick={logout} style={{background:'none', border:'none', color:'#A8B58A', cursor:'pointer', fontSize:'0.85rem'}}>
          sair
        </button>
      </div>

      <div style={{padding:'20px', maxWidth:'480px', margin:'0 auto'}}>

        {/* SALDO */}
        {resumo && (
          <>
            <div style={{backgroundColor:'#B46A72', borderRadius:'16px', padding:'20px', marginBottom:'12px', color:'white'}}>
              <div style={{fontSize:'0.75rem', opacity:0.8, marginBottom:'4px'}}>Saldo do mês</div>
              <div style={{fontSize:'1.8rem', fontWeight:'700'}}>
                R$ {resumo.saldo.toFixed(2)}
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'20px'}}>
              <div style={{backgroundColor:'white', borderRadius:'14px', padding:'14px'}}>
                <div style={{fontSize:'0.7rem', color:'#A8B58A', marginBottom:'4px'}}>Receitas</div>
                <div style={{fontSize:'1rem', fontWeight:'700', color:'#A8B58A'}}>
                  R$ {resumo.receitas.toFixed(2)}
                </div>
              </div>
              <div style={{backgroundColor:'white', borderRadius:'14px', padding:'14px'}}>
                <div style={{fontSize:'0.7rem', color:'#A8B58A', marginBottom:'4px'}}>Gastos</div>
                <div style={{fontSize:'1rem', fontWeight:'700', color:'#B46A72'}}>
                  R$ {resumo.gastos.toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ÚLTIMAS TRANSAÇÕES */}
        <div style={{fontSize:'0.85rem', fontWeight:'700', color:'#2D3A47', marginBottom:'10px'}}>
          Últimas transações
        </div>

        {transacoes.length === 0 && (
          <div style={{textAlign:'center', color:'#A8B58A', fontSize:'0.8rem', padding:'20px'}}>
            Nenhuma transação ainda
          </div>
        )}

        {transacoes.map(t => (
          <div key={t.id} style={{backgroundColor:'white', borderRadius:'12px', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
            <div>
              <div style={{fontSize:'0.8rem', fontWeight:'600', color:'#2D3A47'}}>{t.descricao}</div>
              <div style={{fontSize:'0.65rem', color:'#A8B58A'}}>{t.categoria}</div>
            </div>
            <div style={{fontWeight:'700', fontSize:'0.85rem', color: t.tipo === 'receita' ? '#A8B58A' : '#B46A72'}}>
              {t.tipo === 'receita' ? '+' : '-'} R$ {t.valor.toFixed(2)}
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Dashboard