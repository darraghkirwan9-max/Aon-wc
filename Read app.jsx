import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase.js'

// ── Colours ────────────────────────────────────────────────────────────────
const C = {
  navy: '#0B1628',
  navyMid: '#162344',
  navyLight: '#1E3260',
  gold: '#F5C842',
  green: '#28C76F',
  red: '#E84855',
  white: '#F0F4FF',
  muted: '#8898BB',
}

const TODAY = new Date().toISOString().slice(0, 10)
const ADMIN_CODE = 'aonhc2026'

// ── Global styles ──────────────────────────────────────────────────────────
const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.navy}; color: ${C.white}; font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.navyMid}; }
  ::-webkit-scrollbar-thumb { background: ${C.navyLight}; border-radius: 2px; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .fade-in { animation: fadeIn .3s ease both; }
`

// ── Primitives ─────────────────────────────────────────────────────────────
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
}

const Label = ({ children }) => (
  <p style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
    {children}
  </p>
)

// ── Supabase helpers ───────────────────────────────────────────────────────
async function getQuestion(date) {
  const { data } = await supabase.from('questions').select('data').eq('date', date).single()
  return data?.data || null
}

async function getAllQuestions() {
  const { data } = await supabase.from('questions').select('date, data').order('date', { ascending: false })
  return data || []
}

async function upsertQuestion(date, qdata) {
  await supabase.from('questions').upsert({ date, data: qdata })
}

async function deleteQuestion(date) {
  await supabase.from('questions').delete().eq('date', date)
}

async function getReveal(date) {
  const { data } = await supabase.from('reveals').select('*').eq('date', date).single()
  return data || null
}

async function upsertReveal(date, hc_revealed, match_result) {
  await supabase.from('reveals').upsert({ date, hc_revealed, match_result })
}

async function getSubmission(date, player) {
  const id = `${date}::${player}`
  const { data } = await supabase.from('submissions').select('data').eq('id', id).single()
  return data?.data || null
}

async function upsertSubmission(date, player, sdata) {
  const id = `${date}::${player}`
  await supabase.from('submissions').upsert({ id, date, player, data: sdata })
}

async function getAllSubmissions() {
  const { data } = await supabase.from('submissions').select('date, player, data')
  return data || []
}

// ── Admin Panel ────────────────────────────────────────────────────────────
function AdminPanel({ onBack }) {
  const empty = { date: TODAY, match: '', teamA: '', teamB: '', hcQ: '', opts: ['', '', '', ''], answer: 0, explainer: '' }
  const [form, setForm] = useState(empty)
  const [questions, setQuestions] = useState([])
  const [reveals, setReveals] = useState({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const qs = await getAllQuestions()
    setQuestions(qs)
    const revMap = {}
    for (const q of qs) {
      const r = await getReveal(q.date)
      if (r) revMap[q.date] = r
    }
    setReveals(revMap)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const save = async () => {
    await upsertQuestion(form.date, form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    load()
  }

  const del = async (date) => {
    await deleteQuestion(date)
    load()
  }

  const loadDay = (q) => setForm(q.data)

  const setMatchResult = async (date, result) => {
    const existing = reveals[date] || {}
    await upsertReveal(date, existing.hc_revealed || false, result)
    load()
  }

  const toggleHCReveal = async (date) => {
    const existing = reveals[date] || {}
    await upsertReveal(date, !existing.hc_revealed, existing.match_result || null)
    load()
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 24 }} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Btn variant="ghost" small onClick={onBack}>← Back</Btn>
        <span style={{ fontFamily: "'Bebas Neue'", fontSize: 26, letterSpacing: 2, color: C.gold }}>
          Admin — Question Editor
        </span>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div><Label>Date</Label><Input type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} /></div>
          <div><Label>Match Label</Label><Input value={form.match} onChange={v => setForm(f => ({ ...f, match: v }))} placeholder="Group A — Day 3" /></div>
          <div><Label>Team A</Label><Input value={form.teamA} onChange={v => setForm(f => ({ ...f, teamA: v }))} placeholder="Brazil" /></div>
          <div><Label>Team B</Label><Input value={form.teamB} onChange={v => setForm(f => ({ ...f, teamB: v }))} placeholder="Argentina" /></div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <Label>HC IQ Question</Label>
          <Input value={form.hcQ} onChange={v => setForm(f => ({ ...f, hcQ: v }))}
            placeholder="Which country has the highest voluntary turnover rate?" />
        </div>

        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <div onClick={() => setForm(f => ({ ...f, answer: i }))} style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
              border: `2px solid ${form.answer === i ? C.gold : C.navyLight}`,
              background: form.answer === i ? C.gold : 'transparent',
            }} />
< truncated lines 208-401 >
        )}
      </Card>

      {!submitted ? (
        <Btn onClick={submit} disabled={!matchPick || hcPick === null || submitting}>
          {submitting ? 'Locking in…' : 'Lock In Predictions'}
        </Btn>
      ) : (
        <Card gold={matchResult && hcRevealed} style={{ textAlign: 'center', padding: 16 }}>
          {matchResult && hcRevealed
            ? <p style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: C.gold, letterSpacing: 2 }}>
                Today: {todayPts} pts
              </p>
            : <p style={{ color: C.muted, fontSize: 13 }}>Predictions locked ✓ — points confirmed after results</p>
          }
        </Card>
      )}
    </div>
  )
}

// ── Leaderboard ────────────────────────────────────────────────────────────
function Leaderboard() {
  const [board, setBoard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [allSubs, allQs, allRevs] = await Promise.all([
        getAllSubmissions(),
        getAllQuestions(),
        (async () => {
          const dates = (await getAllQuestions()).map(q => q.date)
          const revs = {}
          for (const d of dates) { const r = await getReveal(d); if (r) revs[d] = r }
          return revs
        })(),
      ])

      const qMap = {}
      allQs.forEach(q => { qMap[q.date] = q.data })

      const scores = {}
      for (const sub of allSubs) {
        const { date, player, data } = sub
        if (!scores[player]) scores[player] = { total: 0, matchPts: 0, hcPts: 0, entered: 0 }
        scores[player].entered++
        const q = qMap[date]
        const rev = allRevs[date]
        if (rev?.match_result && data.matchPick === rev.match_result) {
          scores[player].matchPts += 2; scores[player].total += 2
        }
        if (rev?.hc_revealed && q && data.hcPick === q.answer) {
          scores[player].hcPts += 3; scores[player].total += 3
        }
      }

      const sorted = Object.entries(scores)
        .map(([name, s]) => ({ name, ...s }))
        .sort((a, b) => b.total - a.total)
      setBoard(sorted)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>Loading leaderboard…</p>
  if (!board.length) return (
    <Card style={{ textAlign: 'center', padding: 40 }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>🏆</div>
      <p style={{ color: C.muted }}>No entries yet — be the first to play!</p>
    </Card>
  )

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="fade-in">
      {board.map((p, i) => (
        <div key={p.name} style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 16px', marginBottom: 8, borderRadius: 8,
          background: i === 0 ? C.gold + '11' : C.navyMid,
          border: `1px solid ${i === 0 ? C.gold + '44' : C.navyLight}`,
        }}>
          <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{medals[i] || i + 1}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</p>
            <p style={{ fontSize: 12, color: C.muted }}>
              ⚽ {p.matchPts}pts match · 🧠 {p.hcPts}pts HC · {p.entered} {p.entered === 1 ? 'day' : 'days'}
            </p>
          </div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 32, color: i === 0 ? C.gold : C.white, letterSpacing: 1 }}>
            {p.total}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Root ───────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('play')
  const [name, setName] = useState(() => localStorage.getItem('wc_name') || '')
  const [nameInput, setNameInput] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  const enterName = () => {
    if (!nameInput.trim()) return
    localStorage.setItem('wc_name', nameInput.trim())
    setName(nameInput.trim())
  }

  const tryAdmin = () => {
    if (adminCode === ADMIN_CODE) { setAdminUnlocked(true); setShowAdmin(true) }
  }

  if (showAdmin && adminUnlocked) return (
    <>
      <style>{globalCSS}</style>
      <Header name={name} isAdmin />
      <AdminPanel onBack={() => setShowAdmin(false)} />
    </>
  )

  return (
    <>
      <style>{globalCSS}</style>
      <Header name={name} isAdmin={adminUnlocked} onAdminClick={() => setShowAdmin(true)} />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: 24 }}>
        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 24,
          background: C.navyMid, borderRadius: 8, padding: 4,
          border: `1px solid ${C.navyLight}`
        }}>
          {[['play', "Today's Challenge"], ['board', 'Leaderboard']].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{
              flex: 1, padding: '8px 0', borderRadius: 6, border: 'none',
              background: view === v ? C.gold : 'transparent',
              color: view === v ? C.navy : C.muted,
              fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 14,
              cursor: 'pointer', transition: 'all .15s'
            }}>{label}</button>
          ))}
        </div>

        {/* Name gate */}
        {view === 'play' && !name && (
          <Card style={{ textAlign: 'center', padding: 40 }} className="fade-in">
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚽</div>
            <p style={{ fontFamily: "'Bebas Neue'", fontSize: 26, letterSpacing: 2, marginBottom: 6 }}>Enter Your Name</p>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Your name appears on the leaderboard</p>
            <div style={{ display: 'flex', gap: 10, maxWidth: 300, margin: '0 auto' }}>
              <Input value={nameInput} onChange={setNameInput} placeholder="Your name"
                onKeyDown={e => e.key === 'Enter' && enterName()} />
              <Btn onClick={enterName}>Go</Btn>
            </div>
          </Card>
        )}

        {view === 'play' && name && <PlayerView name={name} />}
        {view === 'board' && <Leaderboard />}

        {/* Admin unlock */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${C.navyLight}`, textAlign: 'center' }}>
          {!adminUnlocked ? (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', maxWidth: 240, margin: '0 auto' }}>
              <Input type="password" value={adminCode} onChange={setAdminCode} placeholder="Admin code" />
              <Btn small variant="ghost" onClick={tryAdmin}>→</Btn>
            </div>
          ) : (
            <Btn small variant="ghost" onClick={() => setShowAdmin(true)}>Admin Panel →</Btn>
          )}
        </div>
      </div>
    </>
  )
}

function Header({ name, isAdmin, onAdminClick }) {
  return (
    <div style={{
      background: C.navyMid, borderBottom: `1px solid ${C.navyLight}`,
      padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 24 }}>⚽</span>
        <div>
          <p style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 3, color: C.gold, lineHeight: 1 }}>
            Aon HC World Cup
          </p>
          <p style={{ fontSize: 11, color: C.muted, letterSpacing: 1 }}>PREDICTION CHALLENGE 2026</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {name && <Tag>{name}</Tag>}
        {isAdmin && <Tag color={C.red} style={{ cursor: 'pointer' }} onClick={onAdminClick}>ADMIN</Tag>}
      </div>
    </div>
  )
}
