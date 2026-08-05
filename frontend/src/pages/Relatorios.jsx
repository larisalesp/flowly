import { useState, useEffect } from 'react'
import BottomNav from '../components/BottomNav'

const API = 'https://flowly-production-aef8.up.railway.app'

function Relatorios() {
  const [resumo, setResumo] = useState(null)
  const [porCategoria, setPorCategoria] = useState([])
  const [porMes, setPorMes] = useState([])
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [ano, setAno] = useState(new Date().getFullYear())
  const token = localStorage.getItem('token')

  useEffect(() => {
    buscarDados()
  }, [mes, ano])

  async function buscarDados() {
    const headers = { Authorization: `Bearer ${token}` }

    const [r1, r2, r3] = await Promise.all([
      fetch(`${API}/reports/summary?mes=${mes}&ano=${ano}`, { headers }),
      fetch(`${API}/reports/by-category?mes=${mes}&ano=${ano}`, { headers }),
      fetch(`${API}/reports/by-month?ano=${ano}`, { headers }),
    ])

    setResumo(await r1.json())
    setPorCategoria(await r2.json())
    setPorMes(await r3.json())
  }

  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

  const maxGasto = Math.max(...porMes.map(m => m.gastos), 1)
  const maxReceita = Math.max(...porMes.map(m => m.receitas), 1)
  const maxBar = Math.max(maxGasto, maxReceita)

  return (
    <div style={{minHeight:'100vh', backgroundColor:'#FFF7E6'}}>

      <div style={{backgroundColor:'#2D3A47', padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{color:'#F7C8D3', fontWeight:'700', fontSize:'1.1rem'}}>Flowly ꕥ</span>
        <button onClick={() => { localStorage.clear(); window.location.href='/' }} style={{background:'none', border:'none', color:'#A8B58A', cursor:'pointer'}}>
          sair
        </button>
      </div>

      <div style={{padding:'20px', maxWidth:'480px', margin:'0 auto', paddingBottom:'70px'}}>

        {/* SELETOR DE MÊS */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
          <button onClick={() => setMes(m => m === 1 ? 12 : m - 1)} style={{background:'white', border:'1.5px solid #F7C8D3', borderRadius:'8px', padding:'4px 12px', cursor:'pointer', color:'#2D3A47'}}>‹</button>
          <span style={{fontWeight:'700', color:'#2D3A47'}}>{meses[mes-1]} {ano}</span>
          <button onClick={() => setMes(m => m === 12 ? 1 : m + 1)} style={{background:'white', border:'1.5px solid #F7C8D3', borderRadius:'8px', padding:'4px 12px', cursor:'pointer', color:'#2D3A47'}}>›</button>
        </div>

        {/* RESUMO */}
        {resumo && (
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'20px'}}>
            <div style={{backgroundColor:'white', borderRadius:'14px', padding:'12px', textAlign:'center'}}>
              <div style={{fontSize:'0.6rem', color:'#A8B58A', marginBottom:'4px'}}>Receitas</div>
              <div style={{fontSize:'0.85rem', fontWeight:'700', color:'#A8B58A'}}>R$ {resumo.receitas.toFixed(0)}</div>
            </div>
            <div style={{backgroundColor:'#B46A72', borderRadius:'14px', padding:'12px', textAlign:'center'}}>
              <div style={{fontSize:'0.6rem', color:'rgba(255,255,255,0.8)', marginBottom:'4px'}}>Saldo</div>
              <div style={{fontSize:'0.85rem', fontWeight:'700', color:'white'}}>R$ {resumo.saldo.toFixed(0)}</div>
            </div>
            <div style={{backgroundColor:'white', borderRadius:'14px', padding:'12px', textAlign:'center'}}>
              <div style={{fontSize:'0.6rem', color:'#A8B58A', marginBottom:'4px'}}>Gastos</div>
              <div style={{fontSize:'0.85rem', fontWeight:'700', color:'#B46A72'}}>R$ {resumo.gastos.toFixed(0)}</div>
            </div>
          </div>
        )}

        {/* GRÁFICO POR MÊS */}
        <div style={{backgroundColor:'white', borderRadius:'14px', padding:'16px', marginBottom:'16px'}}>
          <div style={{fontSize:'0.8rem', fontWeight:'700', color:'#2D3A47', marginBottom:'12px'}}>Receitas vs Gastos</div>
          <div style={{display:'flex', alignItems:'flex-end', gap:'6px', height:'80px', justifyContent:'center'}}>
            {porMes.slice(-6).map((m, i) => (
              <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'2px'}}>
                <div style={{display:'flex', gap:'2px', alignItems:'flex-end'}}>
                  <div style={{width:'14px', backgroundColor:'#A8B58A', borderRadius:'3px 3px 0 0', height:`${(m.receitas/maxBar)*70}px`}}></div>
                  <div style={{width:'14px', backgroundColor:'#B46A72', borderRadius:'3px 3px 0 0', height:`${(m.gastos/maxBar)*70}px`}}></div>
                </div>
                <div style={{fontSize:'0.55rem', color:'#A8B58A'}}>{m.periodo.slice(5)}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex', gap:'12px', justifyContent:'center', marginTop:'8px'}}>
            <span style={{fontSize:'0.6rem', color:'#2D3A47', display:'flex', alignItems:'center', gap:'4px'}}>
              <span style={{width:'8px', height:'8px', backgroundColor:'#A8B58A', borderRadius:'50%', display:'inline-block'}}></span>Receitas
            </span>
            <span style={{fontSize:'0.6rem', color:'#2D3A47', display:'flex', alignItems:'center', gap:'4px'}}>
              <span style={{width:'8px', height:'8px', backgroundColor:'#B46A72', borderRadius:'50%', display:'inline-block'}}></span>Gastos
            </span>
          </div>
        </div>

        {/* POR CATEGORIA */}
        <div style={{fontSize:'0.85rem', fontWeight:'700', color:'#2D3A47', marginBottom:'10px'}}>Por categoria</div>

        {porCategoria.length === 0 && (
          <div style={{textAlign:'center', color:'#A8B58A', fontSize:'0.8rem', padding:'20px'}}>
            Nenhum gasto esse mês
          </div>
        )}

        {porCategoria.map((c, i) => {
          const total = porCategoria.reduce((acc, x) => acc + x.total, 0)
          const pct = total > 0 ? Math.round((c.total / total) * 100) : 0
          return (
            <div key={i} style={{backgroundColor:'white', borderRadius:'12px', padding:'12px 16px', marginBottom:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{flex:1}}>
                <div style={{fontSize:'0.78rem', fontWeight:'600', color:'#2D3A47', marginBottom:'4px'}}>{c.categoria}</div>
                <div style={{height:'4px', backgroundColor:'#F7C8D3', borderRadius:'4px', overflow:'hidden'}}>
                  <div style={{height:'100%', width:`${pct}%`, backgroundColor:'#B46A72', borderRadius:'4px'}}></div>
                </div>
              </div>
              <div style={{marginLeft:'12px', textAlign:'right'}}>
                <div style={{fontSize:'0.8rem', fontWeight:'700', color:'#B46A72'}}>R$ {c.total.toFixed(2)}</div>
                <div style={{fontSize:'0.6rem', color:'#A8B58A'}}>{pct}%</div>
              </div>
            </div>
          )
        })}

      </div>

      <BottomNav />
    </div>
  )
}

export default Relatorios