import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase.js'

const C = {
  navy: '#0B1628',
  navyMid: '#162344',
  navyLight: '#1E3260',
  gold: '#F5C842',
  green: '#28C76F',
  red: '#E84855',
  white: '#F0F4FF',
  muted: '#8898BB',
  hc: '#3B82F6',
  risk: '#F97316',
}

const TODAY = new Date().toISOString().slice(0, 10)
const ADMIN_CODE = 'aonhc2026'
const TEAMS = ['Human Capital', 'Risk Capital']

const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.navy}; color: ${C.white}; font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.navyMid}; }
  ::-webkit-scrollbar-thumb { background: ${C.navyLight}; border-radius: 2px; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .fade-in { animation: fadeIn .3s ease both; }
`

const Card = ({ children, style, gold }) => (
  <div style={{
    background: C.navyMid,
    border: `1px solid ${gold ? C.gold + '55' : C.navyLight}`,
    borderRadius: 10, padding: 20, ...style
  }}>{children}</div>
)

const Tag = ({ children, color = C.gold }) => (
  <span style={{
    background: color + '22', color, border: `1px solid ${color}44`,
    borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 600,
    letterSpacing: 1, textTransform: 'uppercase'
  }}>{children}</span>
)

const Btn = ({ children, onClick, variant = 'primary', small, disabled }) => {
  const base = {
    cursor: disabled ? 'not-allowed' : 'pointer', border: 'none', borderRadius: 6,
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
    padding: small ? '6px 14px' : '10px 22px', fontSize: small ? 13 : 14,
    transition: 'all .15s', opacity: disabled ? .45 : 1,
  }
  const variants = {
    primary: { background: C.gold, color: C.navy },
    ghost: { background: 'transparent', color: C.muted, border: `1px solid ${C.navyLight}` },
    danger: { background: C.red + '22', color: C.red, border: `1px solid ${C.red}44` },
    green: { background: C.green + '22', color: C.green, border: `1px solid ${C.green}44` },
    hc: { background: C.hc + '22', color: C.hc, border: `1px solid ${C.hc}44` },
    risk: { background: C.risk + '22', color: C.risk, border: `1px solid ${C.risk}44` },
  }
  return (
    <button style={{ ...base, ...variants[variant] }} onClick={disabled ? undefined : onClick}>
      {children}
    </button>
  )
}

const Input = ({ value, onChange, placeholder, type = 'text', multiline }) => {
  const s = {
    background: C.navyLight, border: `1px solid ${C.navyLight}`, borderRadius: 6,
    padding: '9px 12px', color: C.white, fontFamily: "'DM Sans', sans-serif",
    fontSize: 14, width: '100%', outline: 'none', resize: multiline ? 'vertical' : undefined,
  }
  return multiline
    ? <textarea style={{ ...s, minHeight: 80 }} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    : <input style={s} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
