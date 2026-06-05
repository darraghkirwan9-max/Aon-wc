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
}

const TODAY = new Date().toISOString().slice(0, 10)
const ADMIN_CODE = 'aonhc2026'

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
            <Input value={form.opts[i]}
              onChange={v => setForm(f => { const o = [...f.opts]; o[i] = v; return { ...f, opts: o } })}
              placeholder={`Option ${i + 1}`} />
          </div>
        ))}
        <p style={{ fontSize: 11, color: C.muted, marginBottom: 14 }}>← Circle = correct answer</p>
        <div style={{ marginBottom: 16 }}>
          <Label>Answer Explainer (shown after reveal)</Label>
          <Input multiline value={form.explainer} onChange={v => setForm(f => ({ ...f, explainer: v }))}
            placeholder="Ireland's voluntary turnover sits at 18% vs EU average of 14%..." />
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Btn onClick={save}>Save Question</Btn>
          {saved && <Tag color={C.green}>Saved ✓</Tag>}
        </div>
      </Card>
      {!loading && questions.length > 0 && (
        <div>
          <Label>Saved Questions + Results</Label>
          <div style={{ marginTop: 8 }}>
            {questions.map(q => {
              const rev = reveals[q.date] || {}
              return (
                <Card key={q.date} style={{ marginBottom: 10, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div>
                      <span style={{ fontWeight: 600, marginRight: 10 }}>{q.date}</span>
                      <span style={{ color: C.muted, fontSize: 13 }}>{q.data.teamA} vs {q.data.teamB}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Btn small variant="ghost" onClick={() => loadDay(q)}>Edit</Btn>
                      <Btn small variant="danger" onClick={() => del(q.date)}>Delete</Btn>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{q.data.hcQ}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['A', 'Draw', 'B'].map(r => (
                      <Btn key={r} small variant={rev.match_result === r ? 'green' : 'ghost'}
                        onClick={() => setMatchResult(q.date, r)}>
                        {r === 'A' ? q.data.teamA : r === 'B' ? q.data.teamB : 'Draw'}
                      </Btn>
                    ))}
                    <Btn small variant={rev.hc_revealed ? 'green' : 'ghost'} onClick={() => toggleHCReveal(q.date)}>
                      {rev.hc_revealed ? 'HC Revealed ✓' : 'Reveal HC Answer'}
                    </Btn>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function PlayerView({ name }) {
  const [question, setQuestion] = useState(null)
  const [reveal, setReveal] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [matchPick, setMatchPick] = useState(null)
  const [hcPick, setHcPick] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const [q, r, s] = await Promise.all([
      getQuestion(TODAY),
      getReveal(TODAY),
      getSubmission(TODAY, name),
    ])
    setQuestion(q)
    setReveal(r)
    setSubmission(s)
    setLoading(false)
  }, [name])

  useEffect(() => { load() }, [load])
  useEffect(() => { const t = setInterval(load, 15000); return () => clearInterval(t) }, [load])

  const submit = async () => {
    if (!matchPick || hcPick === null) return
    setSubmitting(true)
    const s = { matchPick, hcPick, ts: Date.now() }
    await upsertSubmission(TODAY, name, s)
    setSubmission(s)
    setSubmitting(false)
  }

  if (loading) return <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>Loading...</p>

  if (!question) return (
    <Card style={{ textAlign: 'center', padding: 40 }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>⏳</div>
      <p style={{ color: C.muted }}>No question set for today yet. Check back soon.</p>
    </Card>
  )

  const submitted = !!submission
  const hcRevealed = reveal?.hc_revealed
  const matchResult = reveal?.match_result
  const correctMatch = submitted && matchResult && submission.matchPick === matchResult
  const correctHC = submitted && hcRevealed && submission.hcPick === question.answer
  const todayPts = (correctMatch ? 2 : 0) + (correctHC ? 3 : 0)

  return (
    <div className="fade-in">
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{question.match}</p>
            <p style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: 2 }}>
              {question.teamA} <span style={{ color: C.muted }}>vs</span> {question.teamB}
            </p>
          </div>
          <Tag>+2 pts</Tag>
        </div>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Who wins?</p>
        <div style={{ display: 'flex', gap: 10 }}>
          {[['A', question.teamA], ['Draw', 'Draw'], ['B', question.teamB]].map(([val, label]) => {
            const picked = (submitted ? submission.matchPick : matchPick) === val
            const isResult = matchResult === val
            let border = picked ? C.gold : C.navyLight
            let bg = picked ? C.gold + '22' : 'transparent'
            if (matchResult) {
              border = isResult ? C.green : (picked && !isResult ? C.red : C.navyLight)
              bg = isResult ? C.green + '11' : bg
            }
            return (
              <button key={val} onClick={() => !submitted && setMatchPick(val)} style={{
                flex: 1, border: `2px solid ${border}`, background: bg, borderRadius: 8,
                padding: '12px 0', color: picked ? C.white : C.muted,
                fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 14,
                cursor: submitted ? 'default' : 'pointer', transition: 'all .15s'
              }}>
                {label}{matchResult && isResult ? ' ✓' : ''}
              </button>
            )
          })}
        </div>
        {matchResult && submitted && (
          <p style={{ marginTop: 10, fontSize: 13, color: correctMatch ? C.green : C.red }}>
            {correctMatch ? '✓ Correct — +2 pts' : '✗ Wrong — 0 pts'}
          </p>
        )}
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <Tag color={C.green}>HC IQ</Tag>
            <p style={{ marginTop: 8, fontWeight: 600, fontSize: 15, lineHeight: 1.4 }}>{question.hcQ}</p>
          </div>
          <Tag color={C.green}>+3 pts</Tag>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {question.opts.filter(Boolean).map((opt, i) => {
            const picked = (submitted ? submission.hcPick : hcPick) === i
            const isAnswer = question.answer === i
            let border = picked ? C.green : C.navyLight
            let bg = picked ? C.green + '22' : 'transparent'
            if (hcRevealed) {
              border = isAnswer ? C.green : (picked && !isAnswer ? C.red : C.navyLight)
              bg = isAnswer ? C.green + '11' : bg
            }
            return (
              <button key={i} onClick={() => !submitted && setHcPick(i)} style={{
                border: `2px solid ${border}`, background: bg, borderRadius: 8,
                padding: '10px 14px', color: C.white, fontFamily: "'DM Sans'",
                fontWeight: 500, fontSize: 13, textAlign: 'left',
                cursor: submitted ? 'default' : 'pointer', transition: 'all .15s'
              }}>
                {hcRevealed && isAnswer ? '✓ ' : ''}{opt}
              </button>
            )
          })}
        </div>
        {hcRevealed ? (
          <div style={{ background: C.navyLight, borderRadius: 8, padding: 14, borderLeft: `3px solid ${C.green}` }}>
            {submitted && (
              <p style={{ fontSize: 13, color: correctHC ? C.green : C.red, marginBottom: 6 }}>
                {correctHC ? '✓ Correct — +3 pts' : '✗ Wrong — 0 pts'}
              </p>
            )}
            <p style={{ fontSize: 13, color: C.muted }}>{question.explainer}</p>
          </div>
        ) : submitted && (
          <p style={{ fontSize: 12, color: C.muted }}>HC answer revealed after today's match.</p>
        )}
      </Card>
      {!submitted ? (
        <Btn onClick={submit} disabled={!matchPick || hcPick === null || submitting}>
          {submitting ? 'Locking in...' : 'Lock In Predictions'}
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

function Leaderboard() {
  const [board, setBoard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const allSubs = await getAllSubmissions()
      const allQs = await getAllQuestions()
      const qMap = {}
      allQs.forEach(q => { qMap[q.date] = q.data })
      const revs = {}
      for (const q of allQs) {
        const r = await getReveal(q.date)
        if (r) revs[q.date] = r
      }
      const scores = {}
      for (const sub of allSubs) {
        const { date, player, data } = sub
        if (!scores[player]) scores[player] = { total: 0, matchPts: 0, hcPts: 0, entered: 0 }
        scores[player].entered++
        const q = qMap[date]
        const rev = revs[date]
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

  if (loading) return <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>Loading leaderboard...</p>
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
        {view === 'play' && !name && (
          <Card style={{ textAlign: 'center', padding: 40 }} className="fade-in">
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚽</div>
            <p style={{ fontFamily: "'Bebas Neue'", fontSize: 26, letterSpacing: 2, marginBottom: 6 }}>Enter Your Name</p>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Your name appears on the leaderboard</p>
            <div style={{ display: 'flex', gap: 10, maxWidth: 300, margin: '0 auto' }}>
              <Input value={nameInput} onChange={setNameInput} placeholder="Your name" />
              <Btn onClick={enterName}>Go</Btn>
            </div>
          </Card>
        )}
        {view === 'play' && name && <PlayerView name={name} />}
        {view === 'board' && <Leaderboard />}
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
        {isAdmin && <Tag color={C.red} onClick={onAdminClick} style={{ cursor: 'pointer' }}>ADMIN</Tag>}
      </div>
    </div>
  )
}
