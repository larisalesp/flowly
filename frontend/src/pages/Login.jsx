cat > ~/flowly/frontend/src/pages/Login.jsx << 'EOF'
import { useState } from 'react'

const API = 'https://flowly-production-aef8.up.railway.app'

function Login() {
  const [modoCadastro, setModoCadastro] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  async function handleLogin() {
    setErro('')
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      })
      const data = await res.json()
      if (!res.ok) {
        setErro(data.detail || 'Erro ao fazer login')
        return
      }
      localStorage.setItem('token', data.access_token)
      window.location.href = '/dashboard'
    } catch (e) {
      setErro('Erro de conexão com o servidor')
    }
  }

  async function handleCadastro() {
    setErro('')
    setSucesso('')
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      })
      const data = await res.json()
      if (!res.ok) {
        setErro(data.detail || 'Erro ao cadastrar')
        return
      }
      setSucesso('Conta criada! Agora faça login.')
      setModoCadastro(false)
      setSenha('')
    } catch (e) {
      setErro('Erro de conexão com o servidor')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FFF7E6'}}>
      <div className="w-full max-w-md p-8 rounded-2xl shadow-md" style={{backgroundColor: '#fff'}}>

        <h1 className="text-3xl font-bold text-center mb-2" style={{color: '#B46A72'}}>
          Flowly 🌸
        </h1>
        <p className="text-center text-sm mb-8" style={{color: '#A8B58A'}}>
          controle seu dinheiro com leveza
        </p>

        {erro && (
          <p className="text-center text-sm mb-4 text-red-500">{erro}</p>
        )}
        {sucesso && (
          <p className="text-center text-sm mb-4" style={{color: '#A8B58A'}}>{sucesso}</p>
        )}

        {modoCadastro && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{color: '#2D3A47'}}>Nome</label>
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border outline-none"
              style={{borderColor: '#F7C8D3'}}
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" style={{color: '#2D3A47'}}>Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border outline-none"
            style={{borderColor: '#F7C8D3'}}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" style={{color: '#2D3A47'}}>Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border outline-none"
            style={{borderColor: '#F7C8D3'}}
          />
        </div>

        <button
          onClick={modoCadastro ? handleCadastro : handleLogin}
          className="w-full py-2 rounded-lg font-semibold text-white transition hover:opacity-90"
          style={{backgroundColor: '#B46A72'}}
        >
          {modoCadastro ? 'Cadastrar' : 'Entrar'}
        </button>

        <p className="text-center text-sm mt-4" style={{color: '#A8B58A'}}>
          {modoCadastro ? 'Já tem conta?' : 'Não tem conta?'}{' '}
          <span
            className="cursor-pointer font-medium"
            style={{color: '#B46A72'}}
            onClick={() => { setModoCadastro(!modoCadastro); setErro(''); setSucesso('') }}
          >
            {modoCadastro ? 'Entrar' : 'Cadastre-se'}
          </span>
        </p>

      </div>
    </div>
  )
}

export default Login
EOF