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