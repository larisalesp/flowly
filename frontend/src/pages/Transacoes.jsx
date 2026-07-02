import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import BottomNav from '../components/BottomNav'

const API = 'http://192.168.0.20:8000'

function Transacoes() {
  const [transacoes, setTransacoes] = useState([])
  const [filtroTipo, setFiltroTipo] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState({
    tipo: 'gasto', valor: '', descricao: '', categoria: '', nota: ''
  })
  const token = localStorage.getItem('token')

  useEffect(() => {
    buscarTransacoes()
  }, [filtroTipo])

  async function buscarTransacoes() {
    let url = `${API}/transactions/`
    if (filtroTipo) url += `?tipo=${filtroTipo}`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setTransacoes(Array.isArray(data) ? data : [])
  }

  async function criarTransacao() {
    if (!form.valor || !form.descricao || !form.categoria) return
    await fetch(`${API}/transactions/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, valor: parseFloat(form.valor) })
    })
    setForm({ tipo: 'gasto', valor: '', descricao: '', categoria: '', nota: '' })
    setMostrarForm(false)
    buscarTransacoes()
  }

  async function deletarTransacao(id) {
    await fetch(`${API}/transactions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    buscarTransacoes()
  }

  return (
    <div style={{minHeight:'100vh', backgroundColor:'#FFF7E6'}}>

      <div style={{backgroundColor:'#2D3A47', padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{color:'#F7C8D3', fontWeight:'700', fontSize:'1.1rem'}}>Flowly ꕥ</span>
        <button onClick={() => { localStorage.clear(); window.location.href='/' }} style={{background:'none', border:'none', color:'#A8B58A', cursor:'pointer'}}>
          sair
        </button>
      </div>

      <div style={{padding:'20px', maxWidth:'480px', margin:'0 auto', paddingBottom:'80px'}}>

        {/* FILTROS */}
        <div style={{display:'flex', gap:'8px', marginBottom:'16px', overflowX:'auto'}}>
          {['', 'gasto', 'receita'].map(tipo => (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              style={{
                border: '1.5px solid #F7C8D3', borderRadius:'20px', padding:'4px 14px',
                fontSize:'0.72rem', cursor:'pointer', whiteSpace:'nowrap',
                backgroundColor: filtroTipo === tipo ? '#B46A72' : 'white',
                color: filtroTipo === tipo ? 'white' : '#2D3A47',
                fontWeight: filtroTipo === tipo ? '600' : '400'
              }}
            >
              {tipo === '' ? 'Todos' : tipo === 'gasto' ? 'Gastos' : 'Receitas'}
            </button>
          ))}
        </div>

        {/* FORMULÁRIO */}
        {mostrarForm && (
          <div style={{backgroundColor:'white', borderRadius:'16px', padding:'16px', marginBottom:'16px'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
              <span style={{fontWeight:'700', color:'#2D3A47', fontSize:'0.85rem'}}>Nova transação</span>
              <button onClick={() => setMostrarForm(false)} style={{background:'none', border:'none', cursor:'pointer', color:'#A8B58A'}}>
                <X size={18} />
              </button>
            </div>

            <div style={{display:'flex', gap:'8px', marginBottom:'10px'}}>
              {['gasto', 'receita'].map(t => (
                <button key={t} onClick={() => setForm(f => ({...f, tipo: t}))}
                  style={{flex:1, padding:'6px', borderRadius:'8px', border:'1.5px solid #F7C8D3', cursor:'pointer', fontSize:'0.75rem',
                    backgroundColor: form.tipo === t ? '#B46A72' : 'white',
                    color: form.tipo === t ? 'white' : '#2D3A47', fontWeight: form.tipo === t ? '600' : '400'
                  }}>
                  {t === 'gasto' ? 'Gasto' : 'Receita'}
                </button>
              ))}
            </div>

            {[
              {key:'descricao', placeholder:'Descrição', type:'text'},
              {key:'valor', placeholder:'Valor (ex: 50.00)', type:'number'},
              {key:'categoria', placeholder:'Categoria', type:'text'},
              {key:'nota', placeholder:'Nota (opcional)', type:'text'},
            ].map(field => (
              <input key={field.key} type={field.type} placeholder={field.placeholder}
                value={form[field.key]}
                onChange={e => setForm(f => ({...f, [field.key]: e.target.value}))}
                style={{width:'100%', border:'1.5px solid #F7C8D3', borderRadius:'10px', padding:'8px 12px',
                  fontSize:'0.8rem', outline:'none', marginBottom:'8px', boxSizing:'border-box'}}
              />
            ))}

            <button onClick={criarTransacao}
              style={{width:'100%', backgroundColor:'#B46A72', color:'white', border:'none',
                borderRadius:'10px', padding:'10px', fontWeight:'600', cursor:'pointer', fontSize:'0.85rem'}}>
              Salvar
            </button>
          </div>
        )}

        {/* LISTA */}
        {transacoes.length === 0 && (
          <div style={{textAlign:'center', color:'#A8B58A', fontSize:'0.8rem', padding:'30px'}}>
            Nenhuma transação encontrada
          </div>
        )}

        {transacoes.map(t => (
          <div key={t.id} style={{backgroundColor:'white', borderRadius:'12px', padding:'12px 16px',
            display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
            <div style={{flex:1}}>
              <div style={{fontSize:'0.8rem', fontWeight:'600', color:'#2D3A47'}}>{t.descricao}</div>
              <div style={{fontSize:'0.65rem', color:'#A8B58A'}}>{t.categoria}</div>
              {t.nota && <div style={{fontSize:'0.62rem', color:'#A8B58A', fontStyle:'italic', marginTop:'2px'}}>{t.nota}</div>}
            </div>
            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
              <span style={{fontWeight:'700', fontSize:'0.85rem', color: t.tipo === 'receita' ? '#A8B58A' : '#B46A72'}}>
                {t.tipo === 'receita' ? '+' : '-'} R$ {t.valor.toFixed(2)}
              </span>
              <button onClick={() => deletarTransacao(t.id)}
                style={{background:'none', border:'none', cursor:'pointer', color:'#F7C8D3', padding:'2px'}}>
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOTÃO ADICIONAR */}
      <button onClick={() => setMostrarForm(true)}
        style={{position:'fixed', bottom:'70px', right:'20px', width:'48px', height:'48px',
          backgroundColor:'#B46A72', borderRadius:'50%', border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 4px 12px rgba(180,106,114,0.4)', zIndex:99}}>
        <Plus size={22} color="white" />
      </button>

      <BottomNav />
    </div>
  )
}

export default Transacoes