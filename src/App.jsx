import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase.js'

const C = {
  navy: '#0B1628', navyMid: '#162344', navyLight: '#1E3260',
  gold: '#F5C842', green: '#28C76F', red: '#E84855',
  white: '#F0F4FF', muted: '#8898BB',
  hc: '#3B82F6', risk: '#F97316',
}

const TODAY = new Date().toISOString().slice(0, 10)
const ADMIN_CODE = 'aonhc2026'
const TEAMS = ['Human Capital', 'Risk Capital']

const GROUP_SCHEDULE = [
  { id: 'a1', date: '2026-06-11', group: 'A', teamA: 'Mexico', teamB: 'South Africa' },
  { id: 'a2', date: '2026-06-11', group: 'A', teamA: 'Korea Republic', teamB: 'Czechia' },
  { id: 'b1', date: '2026-06-12', group: 'B', teamA: 'Canada', teamB: 'Bosnia and Herzegovina' },
  { id: 'd1', date: '2026-06-12', group: 'D', teamA: 'United States', teamB: 'Paraguay' },
  { id: 'b2', date: '2026-06-13', group: 'B', teamA: 'Qatar', teamB: 'Switzerland' },
  { id: 'c1', date: '2026-06-13', group: 'C', teamA: 'Brazil', teamB: 'Morocco' },
  { id: 'c2', date: '2026-06-13', group: 'C', teamA: 'Haiti', teamB: 'Scotland' },
  { id: 'd2', date: '2026-06-13', group: 'D', teamA: 'Australia', teamB: 'Türkiye' },
  { id: 'e1', date: '2026-06-14', group: 'E', teamA: 'Germany', teamB: 'Curaçao' },
  { id: 'e2', date: '2026-06-14', group: 'E', teamA: 'Ivory Coast', teamB: 'Ecuador' },
  { id: 'f1', date: '2026-06-14', group: 'F', teamA: 'Netherlands', teamB: 'Japan' },
  { id: 'f2', date: '2026-06-14', group: 'F', teamA: 'Sweden', teamB: 'Tunisia' },
  { id: 'g1', date: '2026-06-15', group: 'G', teamA: 'Belgium', teamB: 'Egypt' },
  { id: 'g2', date: '2026-06-15', group: 'G', teamA: 'Iran', teamB: 'New Zealand' },
  { id: 'h1', date: '2026-06-15', group: 'H', teamA: 'Spain', teamB: 'Cape Verde' },
  { id: 'h2', date: '2026-06-15', group: 'H', teamA: 'Saudi Arabia', teamB: 'Uruguay' },
  { id: 'i1', date: '2026-06-16', group: 'I', teamA: 'France', teamB: 'Senegal' },
  { id: 'i2', date: '2026-06-16', group: 'I', teamA: 'Iraq', teamB: 'Norway' },
  { id: 'j1', date: '2026-06-16', group: 'J', teamA: 'Argentina', teamB: 'Algeria' },
  { id: 'j2', date: '2026-06-16', group: 'J', teamA: 'Austria', teamB: 'Jordan' },
  { id: 'k1', date: '2026-06-17', group: 'K', teamA: 'Portugal', teamB: 'DR Congo' },
  { id: 'k2', date: '2026-06-17', group: 'K', teamA: 'Uzbekistan', teamB: 'Colombia' },
  { id: 'l1', date: '2026-06-17', group: 'L', teamA: 'England', teamB: 'Croatia' },
  { id: 'l2', date: '2026-06-17', group: 'L', teamA: 'Ghana', teamB: 'Panama' },
  { id: 'a3', date: '2026-06-18', group: 'A', teamA: 'Czechia', teamB: 'South Africa' },
  { id: 'a4', date: '2026-06-18', group: 'A', teamA: 'Mexico', teamB: 'Korea Republic' },
  { id: 'b3', date: '2026-06-18', group: 'B', teamA: 'Switzerland', teamB: 'Bosnia and Herzegovina' },
  { id: 'b4', date: '2026-06-18', group: 'B', teamA: 'Canada', teamB: 'Qatar' },
  { id: 'c3', date: '2026-06-19', group: 'C', teamA: 'Scotland', teamB: 'Morocco' },
  { id: 'c4', date: '2026-06-19', group: 'C', teamA: 'Brazil', teamB: 'Haiti' },
  { id: 'd3', date: '2026-06-19', group: 'D', teamA: 'United States', teamB: 'Australia' },
  { id: 'd4', date: '2026-06-19', group: 'D', teamA: 'Türkiye', teamB: 'Paraguay' },
  { id: 'e3', date: '2026-06-20', group: 'E', teamA: 'Germany', teamB: 'Ivory Coast' },
  { id: 'e4', date: '2026-06-20', group: 'E', teamA: 'Ecuador', teamB: 'Curaçao' },
  { id: 'f3', date: '2026-06-20', group: 'F', teamA: 'Netherlands', teamB: 'Sweden' },
  { id: 'f4', date: '2026-06-20', group: 'F', teamA: 'Tunisia', teamB: 'Japan' },
  { id: 'g3', date: '2026-06-21', group: 'G', teamA: 'Belgium', teamB: 'Iran' },
  { id: 'g4', date: '2026-06-21', group: 'G', teamA: 'New Zealand', teamB: 'Egypt' },
  { id: 'h3', date: '2026-06-21', group: 'H', teamA: 'Spain', teamB: 'Saudi Arabia' },
  { id: 'h4', date: '2026-06-21', group: 'H', teamA: 'Uruguay', teamB: 'Cape Verde' },
  { id: 'i3', date: '2026-06-22', group: 'I', teamA: 'France', teamB: 'Iraq' },
  { id: 'i4', date: '2026-06-22', group: 'I', teamA: 'Norway', teamB: 'Senegal' },
  { id: 'j3', date: '2026-06-22', group: 'J', teamA: 'Argentina', teamB: 'Austria' },
  { id: 'j4', date: '2026-06-22', group: 'J', teamA: 'Jordan', teamB: 'Algeria' },
  { id: 'k3', date: '2026-06-23', group: 'K', teamA: 'Portugal', teamB: 'Uzbekistan' },
  { id: 'k4', date: '2026-06-23', group: 'K', teamA: 'Colombia', teamB: 'DR Congo' },
  { id: 'l3', date: '2026-06-23', group: 'L', teamA: 'England', teamB: 'Ghana' },
  { id: 'l4', date: '2026-06-23', group: 'L', teamA: 'Panama', teamB: 'Croatia' },
  { id: 'a5', date: '2026-06-24', group: 'A', teamA: 'Czechia', teamB: 'Mexico' },
  { id: 'a6', date: '2026-06-24', group: 'A', teamA: 'South Africa', teamB: 'Korea Republic' },
  { id: 'b5', date: '2026-06-24', group: 'B', teamA: 'Switzerland', teamB: 'Canada' },
  { id: 'b6', date: '2026-06-24', group: 'B', teamA: 'Bosnia and Herzegovina', teamB: 'Qatar' },
  { id: 'c5', date: '2026-06-24', group: 'C', teamA: 'Scotland', teamB: 'Brazil' },
  { id: 'c6', date: '2026-06-24', group: 'C', teamA: 'Morocco', teamB: 'Haiti' },
  { id: 'd5', date: '2026-06-25', group: 'D', teamA: 'Türkiye', teamB: 'United States' },
  { id: 'd6', date: '2026-06-25', group: 'D', teamA: 'Paraguay', teamB: 'Australia' },
  { id: 'e5', date: '2026-06-25', group: 'E', teamA: 'Curaçao', teamB: 'Ivory Coast' },
  { id: 'e6', date: '2026-06-25', group: 'E', teamA: 'Ecuador', teamB: 'Germany' },
  { id: 'f5', date: '2026-06-25', group: 'F', teamA: 'Japan', teamB: 'Sweden' },
  { id: 'f6', date: '2026-06-25', group: 'F', teamA: 'Tunisia', teamB: 'Netherlands' },
  { id: 'g5', date: '2026-06-26', group: 'G', teamA: 'Egypt', teamB: 'Iran' },
  { id: 'g6', date: '2026-06-26', group: 'G', teamA: 'New Zealand', teamB: 'Belgium' },
  { id: 'h5', date: '2026-06-26', group: 'H', teamA: 'Cape Verde', teamB: 'Saudi Arabia' },
  { id: 'h6', date: '2026-06-26', group: 'H', teamA: 'Uruguay', teamB: 'Spain' },
  { id: 'i5', date: '2026-06-26', group: 'I', teamA: 'Norway', teamB: 'France' },
  { id: 'i6', date: '2026-06-26', group: 'I', teamA: 'Senegal', teamB: 'Iraq' },
  { id: 'j5', date: '2026-06-27', group: 'J', teamA: 'Jordan', teamB: 'Argentina' },
  { id: 'j6', date: '2026-06-27', group: 'J', teamA: 'Algeria', teamB: 'Austria' },
  { id: 'k5', date: '2026-06-27', group: 'K', teamA: 'Colombia', teamB: 'Portugal' },
  { id: 'k6', date: '2026-06-27', group: 'K', teamA: 'DR Congo', teamB: 'Uzbekistan' },
  { id: 'l5', date: '2026-06-27', group: 'L', teamA: 'Panama', teamB: 'England' },
  { id: 'l6', date: '2026-06-27', group: 'L', teamA: 'Ghana', teamB: 'Croatia' },
]

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.navy}; color: ${C.white}; font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.navyMid}; }
  ::-webkit-scrollbar-thumb { background: ${C.navyLight}; border-radius: 2px; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .fade-in { animation: fadeIn .3s ease both; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
`

const teamColor = (team) => team === 'Human Capital' ? C.hc : C.risk

const Card = ({ children, style, gold }) => (
  <div style={{ background: C.navyMid, border: `1px solid ${gold ? C.gold + '55' : C.navyLight}`, borderRadius: 10, padding: 20, ...style }}>
    {children}
  </div>
)

const Tag = ({ children, color = C.gold }) => (
  <span style={{ background: color + '22', color, border: `1px solid ${color}44`, borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
    {children}
  </span>
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
  return <button style={{ ...base, ...variants[variant] }} onClick={disabled ? undefined : onClick}>{children}</button>
}

const Input = ({ value, onChange, placeholder, type = 'text', multiline }) => {
  const s = { background: C.navyLight, border: `1px solid ${C.navyLight}`, borderRadius: 6, padding: '9px 12px', color: C.white, fontFamily: "'DM Sans', sans-serif", fontSize: 14, width: '100%', outline: 'none', resize: multiline ? 'vertical' : undefined }
  return multiline
    ? <textarea style={{ ...s, minHeight: 80 }} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    : <input style={s} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
}

const Label = ({ children }) => (
  <p style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{children}</p>
)

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
async function getAllReveals() {
  const { data } = await supabase.from('reveals').select('*')
  const map = {}
  ;(data || []).forEach(r => { map[r.date] = r })
  return map
}
async function upsertReveal(date, hc_revealed, match_result, locked) {
  await supabase.from('reveals').upsert({ date, hc_revealed: hc_revealed || false, match_result: match_result || null, locked: locked || false })
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
async function registerPlayer(name, team) {
  const { error } = await supabase.from('players').insert({ name, team })
  return !error
}

async function isNameTaken(name) {
  const { data } = await supabase.from('players').select('name').eq('name', name).single()
  return !!data
}

async function getExtraMatches() {
  const { data } = await supabase.from('questions').select('date, data').order('date', { ascending: true })
  return (data || []).map(q => ({ ...q.data, id: q.date, isKnockout: true }))
}
async function upsertExtraMatch(match) {
  await supabase.from('questions').upsert({ date: match.id, data: match })
}
async function deleteExtraMatch(id) {
  await supabase.from('questions').delete().eq('date', id)
}

function calcMatchPts(sub, matchResult) {
  if (!matchResult) return null
  return sub.matchPick === matchResult ? 2 : 0
}
function calcHCPts(sub, question, revealed) {
  if (!revealed || !question) return null
  return sub.hcPick === question.answer ? 3 : 0
}

function top10DailyTotal(allSubs, allReveals, allQuestions) {
  const teamTotals = { 'Human Capital': 0, 'Risk Capital': 0 }
  const qMap = {}
  allQuestions.forEach(q => { qMap[q.date] = q.data })
  const dates = [...new Set(allSubs.map(s => s.date))]
  for (const date of dates) {
    const teamDayScores = { 'Human Capital': {}, 'Risk Capital': {} }
    for (const sub of allSubs) {
      if (sub.date !== date) continue
      const { player, data } = sub
      const team = data.team
      if (!team || !teamDayScores[team]) continue
      const rev = allReveals[date]
      let pts = 0
      const mp = calcMatchPts(data, rev?.match_result)
      const hp = calcHCPts(data, qMap[date], rev?.hc_revealed)
      if (mp !== null) pts += mp
      if (hp !== null) pts += hp
      if (!teamDayScores[team][player]) teamDayScores[team][player] = 0
      teamDayScores[team][player] += pts
    }
    for (const team of TEAMS) {
      const scores = Object.values(teamDayScores[team]).sort((a, b) => b - a)
      teamTotals[team] += scores.slice(0, 10).reduce((a, b) => a + b, 0)
    }
  }
  return teamTotals
}
function ScheduleTab({ isAdmin, reveals, extraMatches, onAddMatch, onDeleteExtra }) {
  const [openDate, setOpenDate] = useState(TODAY)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMatch, setNewMatch] = useState({ date: '', teamA: '', teamB: '', round: 'Round of 32' })
  const [saving, setSaving] = useState(false)

  const allMatches = [...GROUP_SCHEDULE, ...extraMatches].sort((a, b) => a.date.localeCompare(b.date))
  const dates = [...new Set(allMatches.map(m => m.date))]
  const rounds = ['Round of 32', 'Round of 16', 'Quarter-final', 'Semi-final', 'Third place', 'Final']

  const addMatch = async () => {
    if (!newMatch.date || !newMatch.teamA || !newMatch.teamB) return
    setSaving(true)
    const id = `ko_${newMatch.date}_${newMatch.teamA}_${newMatch.teamB}`.replace(/\s/g, '_').toLowerCase()
    await upsertExtraMatch({ ...newMatch, id, isKnockout: true })
    setNewMatch({ date: '', teamA: '', teamB: '', round: 'Round of 32' })
    setShowAddForm(false); setSaving(false)
    onAddMatch()
  }

  return (
    <div className="fade-in">
      {isAdmin && (
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Btn small variant={showAddForm ? 'danger' : 'green'} onClick={() => setShowAddForm(v => !v)}>
            {showAddForm ? 'Cancel' : '+ Add Knockout Match'}
          </Btn>
        </div>
      )}
      {showAddForm && isAdmin && (
        <Card style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: 2, color: C.gold, marginBottom: 12 }}>Add Knockout Match</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div><Label>Date</Label><Input type="date" value={newMatch.date} onChange={v => setNewMatch(m => ({ ...m, date: v }))} /></div>
            <div>
              <Label>Round</Label>
              <select value={newMatch.round} onChange={e => setNewMatch(m => ({ ...m, round: e.target.value }))}
                style={{ background: C.navyLight, border: `1px solid ${C.navyLight}`, borderRadius: 6, padding: '9px 12px', color: C.white, fontSize: 14, width: '100%' }}>
                {rounds.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div><Label>Team A</Label><Input value={newMatch.teamA} onChange={v => setNewMatch(m => ({ ...m, teamA: v }))} placeholder="e.g. Argentina" /></div>
            <div><Label>Team B</Label><Input value={newMatch.teamB} onChange={v => setNewMatch(m => ({ ...m, teamB: v }))} placeholder="e.g. France" /></div>
          </div>
          <Btn variant="primary" onClick={addMatch} disabled={!newMatch.date || !newMatch.teamA || !newMatch.teamB || saving}>
            {saving ? 'Saving...' : 'Save Match'}
          </Btn>
        </Card>
      )}
      {dates.map(date => {
        const matches = allMatches.filter(m => m.date === date)
        const isOpen = openDate === date
        const isToday = date === TODAY
        const isPast = date < TODAY
        return (
          <div key={date} style={{ marginBottom: 8 }}>
            <button onClick={() => setOpenDate(isOpen ? null : date)} style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', background: isToday ? C.gold + '11' : C.navyMid,
              border: `1px solid ${isToday ? C.gold + '44' : C.navyLight}`,
              borderRadius: 8, cursor: 'pointer', color: isPast ? C.muted : C.white
            }}>
              <span style={{ fontFamily: "'Bebas Neue'", fontSize: 16, letterSpacing: 2 }}>
                {isToday ? '📅 TODAY — ' : ''}{date}
              </span>
              <span style={{ fontSize: 12, color: C.muted }}>{matches.length} matches {isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div style={{ paddingTop: 8 }}>
                {matches.map(m => {
                  const rev = reveals[m.id || m.date]
                  return (
                    <div key={m.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 14px', background: C.navyMid, borderRadius: 8,
                      border: `1px solid ${C.navyLight}`, marginBottom: 6
                    }}>
                      <div>
                        <span style={{ fontSize: 11, color: C.muted, marginRight: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                          {m.isKnockout ? (m.round || 'KO') : `Grp ${m.group}`}
                        </span>
                        <span style={{ fontWeight: 600 }}>{m.teamA} vs {m.teamB}</span>
                        {rev?.locked && <span style={{ marginLeft: 8, fontSize: 11, color: C.red }}>🔒 Locked</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {rev?.match_result && <Tag color={C.green}>{rev.match_result}</Tag>}
                        {isAdmin && m.isKnockout && (
                          <Btn small variant="danger" onClick={() => { deleteExtraMatch(m.id); onDeleteExtra() }}>✕</Btn>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function AdminPanel({ onBack }) {
  const [questions, setQuestions] = useState([])
  const [reveals, setReveals] = useState({})
  const [extraMatches, setExtraMatches] = useState([])
  const [form, setForm] = useState({ date: TODAY, match: '', teamA: '', teamB: '', hcQ: '', opts: ['', '', '', ''], answer: 0, explainer: '' })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('questions')

  const load = useCallback(async () => {
    setLoading(true)
    const [qs, revs, extra] = await Promise.all([getAllQuestions(), getAllReveals(), getExtraMatches()])
    setQuestions(qs); setReveals(revs); setExtraMatches(extra); setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const save = async () => {
    await upsertQuestion(form.date, form)
    setSaved(true); setTimeout(() => setSaved(false), 2000); load()
  }
  const del = async (date) => { await deleteQuestion(date); load() }
  const loadDay = (q) => setForm(q.data)

  const setMatchResult = async (date, result) => {
    const existing = reveals[date] || {}
    await upsertReveal(date, existing.hc_revealed || false, result, existing.locked || false)
    load()
  }
  const toggleReveal = async (date) => {
    const existing = reveals[date] || {}
    await upsertReveal(date, !existing.hc_revealed, existing.match_result || null, existing.locked || false)
    load()
  }
  const toggleLock = async (date) => {
    const existing = reveals[date] || {}
    await upsertReveal(date, existing.hc_revealed || false, existing.match_result || null, !existing.locked)
    load()
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 24 }} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Btn variant="ghost" small onClick={onBack}>← Back</Btn>
        <span style={{ fontFamily: "'Bebas Neue'", fontSize: 26, letterSpacing: 2, color: C.gold }}>Admin</span>
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: C.navyMid, borderRadius: 8, padding: 4, border: `1px solid ${C.navyLight}` }}>
        {[['questions', 'Aon IQ Questions'], ['schedule', 'Schedule']].map(([v, label]) => (
          <button key={v} onClick={() => setActiveTab(v)} style={{
            flex: 1, padding: '7px 0', borderRadius: 6, border: 'none',
            background: activeTab === v ? C.gold : 'transparent',
            color: activeTab === v ? C.navy : C.muted,
            fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, cursor: 'pointer'
          }}>{label}</button>
        ))}
      </div>

      {activeTab === 'schedule' && (
        <ScheduleTab isAdmin reveals={reveals} extraMatches={extraMatches} onAddMatch={load} onDeleteExtra={load} />
      )}

      {activeTab === 'questions' && (
        <>
          <Card style={{ marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} /></div>
              <div><Label>Match Label</Label><Input value={form.match} onChange={v => setForm(f => ({ ...f, match: v }))} placeholder="Group A — Day 3" /></div>
              <div><Label>Team A</Label><Input value={form.teamA} onChange={v => setForm(f => ({ ...f, teamA: v }))} placeholder="Brazil" /></div>
              <div><Label>Team B</Label><Input value={form.teamB} onChange={v => setForm(f => ({ ...f, teamB: v }))} placeholder="Argentina" /></div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <Label>Aon IQ Question</Label>
              <Input value={form.hcQ} onChange={v => setForm(f => ({ ...f, hcQ: v }))} placeholder="Which country has the highest voluntary turnover?" />
            </div>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <div onClick={() => setForm(f => ({ ...f, answer: i }))} style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, cursor: 'pointer', border: `2px solid ${form.answer === i ? C.gold : C.navyLight}`, background: form.answer === i ? C.gold : 'transparent' }} />
                <Input value={form.opts[i]} onChange={v => setForm(f => { const o = [...f.opts]; o[i] = v; return { ...f, opts: o } })} placeholder={`Option ${i + 1}`} />
              </div>
            ))}
            <p style={{ fontSize: 11, color: C.muted, marginBottom: 14 }}>← Circle = correct answer</p>
            <div style={{ marginBottom: 16 }}>
              <Label>Answer Explainer</Label>
              <Input multiline value={form.explainer} onChange={v => setForm(f => ({ ...f, explainer: v }))} placeholder="The data behind the answer..." />
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Btn onClick={save}>Save Question</Btn>
              {saved && <Tag color={C.green}>Saved ✓</Tag>}
            </div>
          </Card>

          {!loading && questions.map(q => {
            const rev = reveals[q.date] || {}
            return (
              <Card key={q.date} style={{ marginBottom: 10, padding: '12px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontWeight: 600, marginRight: 10 }}>{q.date}</span>
                    <span style={{ color: C.muted, fontSize: 13 }}>{q.data.teamA} vs {q.data.teamB}</span>
                    {rev.locked && <span style={{ marginLeft: 8 }}><Tag color={C.red}>🔒 Locked</Tag></span>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn small variant="ghost" onClick={() => loadDay(q)}>Edit</Btn>
                    <Btn small variant="danger" onClick={() => del(q.date)}>Delete</Btn>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{q.data.hcQ}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Btn small variant={rev.locked ? 'danger' : 'ghost'} onClick={() => toggleLock(q.date)}>
                    {rev.locked ? '🔒 Locked — Unlock' : '🔓 Lock Predictions'}
                  </Btn>
                  {['A', 'Draw', 'B'].map(r => (
                    <Btn key={r} small variant={rev.match_result === r ? 'green' : 'ghost'} onClick={() => setMatchResult(q.date, r)}>
                      {r === 'A' ? q.data.teamA : r === 'B' ? q.data.teamB : 'Draw'}
                    </Btn>
                  ))}
                  <Btn small variant={rev.hc_revealed ? 'green' : 'ghost'} onClick={() => toggleReveal(q.date)}>
                    {rev.hc_revealed ? 'Aon IQ Revealed ✓' : 'Reveal Aon IQ'}
                  </Btn>
                </div>
              </Card>
            )
          })}
        </>
      )}
    </div>
  )
}

function PlayerView({ name, team }) {
  const [question, setQuestion] = useState(null)
  const [reveal, setReveal] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [matchPick, setMatchPick] = useState(null)
  const [hcPick, setHcPick] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const [allQs, revs] = await Promise.all([getAllQuestions(), getAllReveals()])
    const qForToday = allQs.find(q => q.date === TODAY)
    const sub = await getSubmission(TODAY, name)
    setQuestion(qForToday?.data || null)
    setReveal(revs[TODAY] || null)
    setSubmission(sub)
    setLoading(false)
  }, [name])

  useEffect(() => { load() }, [load])
  useEffect(() => { const t = setInterval(load, 15000); return () => clearInterval(t) }, [load])

  const submit = async () => {
    if (!matchPick || hcPick === null) return
    setSubmitting(true)
    await upsertSubmission(TODAY, name, { matchPick, hcPick, team, ts: Date.now() })
    setSubmission({ matchPick, hcPick, team, ts: Date.now() })
    setSubmitting(false)
  }

  if (loading) return <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>Loading...</p>

  if (!question) return (
    <Card style={{ textAlign: 'center', padding: 40 }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
      <p style={{ color: C.muted }}>No question set for today yet.</p>
    </Card>
  )

  const submitted = !!submission
  const locked = reveal?.locked
  const hcRevealed = reveal?.hc_revealed
  const matchResult = reveal?.match_result
  const correctMatch = submitted && matchResult && submission.matchPick === matchResult
  const correctHC = submitted && hcRevealed && submission.hcPick === question.answer
  const todayPts = (correctMatch ? 2 : 0) + (correctHC ? 3 : 0)
  const tColor = teamColor(team)

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
          <div style={{ display: 'flex', gap: 6, flexDirection: 'column', alignItems: 'flex-end' }}>
            <Tag>+2 pts</Tag>
            {locked && <Tag color={C.red}>🔒 Locked</Tag>}
          </div>
        </div>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Who wins?</p>
        <div style={{ display: 'flex', gap: 10 }}>
          {[['A', question.teamA], ['Draw', 'Draw'], ['B', question.teamB]].map(([val, label]) => {
            const picked = (submitted ? submission.matchPick : matchPick) === val
            const isResult = matchResult === val
            let border = picked ? C.gold : C.navyLight
            let bg = picked ? C.gold + '22' : 'transparent'
            if (matchResult) { border = isResult ? C.green : (picked && !isResult ? C.red : C.navyLight); bg = isResult ? C.green + '11' : bg }
            return (
              <button key={val} onClick={() => !submitted && !locked && setMatchPick(val)} style={{
                flex: 1, border: `2px solid ${border}`, background: bg, borderRadius: 8,
                padding: '12px 0', color: picked ? C.white : C.muted,
                fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 14,
                cursor: (submitted || locked) ? 'default' : 'pointer', transition: 'all .15s'
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
            <Tag color={C.green}>Aon IQ</Tag>
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
            if (hcRevealed) { border = isAnswer ? C.green : (picked && !isAnswer ? C.red : C.navyLight); bg = isAnswer ? C.green + '11' : bg }
            return (
              <button key={i} onClick={() => !submitted && !locked && setHcPick(i)} style={{
                border: `2px solid ${border}`, background: bg, borderRadius: 8,
                padding: '10px 14px', color: C.white, fontFamily: "'DM Sans'",
                fontWeight: 500, fontSize: 13, textAlign: 'left',
                cursor: (submitted || locked) ? 'default' : 'pointer', transition: 'all .15s'
              }}>
                {hcRevealed && isAnswer ? '✓ ' : ''}{opt}
              </button>
            )
          })}
        </div>
        {hcRevealed ? (
          <div style={{ background: C.navyLight, borderRadius: 8, padding: 14, borderLeft: `3px solid ${C.green}` }}>
            {submitted && <p style={{ fontSize: 13, color: correctHC ? C.green : C.red, marginBottom: 6 }}>{correctHC ? '✓ Correct — +3 pts' : '✗ Wrong — 0 pts'}</p>}
            <p style={{ fontSize: 13, color: C.muted }}>{question.explainer}</p>
          </div>
        ) : locked && !submitted ? (
          <p style={{ fontSize: 12, color: C.red }}>🔒 Predictions are locked for this match.</p>
        ) : submitted ? (
          <p style={{ fontSize: 12, color: C.muted }}>Aon IQ answer revealed after today's match.</p>
        ) : null}
      </Card>

      {!submitted && !locked ? (
        <Btn onClick={submit} disabled={!matchPick || hcPick === null || submitting}>
          {submitting ? 'Locking in...' : 'Lock In Predictions'}
        </Btn>
      ) : submitted ? (
        <Card gold={matchResult && hcRevealed} style={{ textAlign: 'center', padding: 16 }}>
          {matchResult && hcRevealed
            ? <p style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: C.gold, letterSpacing: 2 }}>Today: {todayPts} pts</p>
            : <p style={{ color: C.muted, fontSize: 13 }}>Predictions locked ✓ — points confirmed after results</p>
          }
        </Card>
      ) : null}
    </div>
  )
}

function Leaderboard() {
  const [board, setBoard] = useState([])
  const [teamTotals, setTeamTotals] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [allSubs, allRevs, allQs] = await Promise.all([getAllSubmissions(), getAllReveals(), getAllQuestions()])
      const qMap = {}
      allQs.forEach(q => { qMap[q.date] = q.data })
      const scores = {}
      for (const sub of allSubs) {
        const { date, player, data } = sub
        if (!scores[player]) scores[player] = { total: 0, matchPts: 0, hcPts: 0, entered: 0, team: data.team || null }
        scores[player].entered++
        if (data.team) scores[player].team = data.team
        const rev = allRevs[date]
        const q = qMap[date]
        const mp = calcMatchPts(data, rev?.match_result)
        const hp = calcHCPts(data, q, rev?.hc_revealed)
        if (mp !== null) { scores[player].matchPts += mp; scores[player].total += mp }
        if (hp !== null) { scores[player].hcPts += hp; scores[player].total += hp }
      }
      const sorted = Object.entries(scores).map(([name, s]) => ({ name, ...s })).sort((a, b) => b.total - a.total)
      setBoard(sorted)
      setTeamTotals(top10DailyTotal(allSubs, allRevs, allQs))
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>Loading...</p>

  const sortedTeams = [...TEAMS].sort((a, b) => (teamTotals[b] || 0) - (teamTotals[a] || 0))
  const hasScores = sortedTeams.some(t => (teamTotals[t] || 0) > 0)
  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="fade-in">
      <p style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Team Standings</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
        {sortedTeams.map((t, i) => {
          const score = teamTotals[t] || 0
          const color = teamColor(t)
          const isLeading = i === 0 && hasScores
          return (
            <div key={t} style={{
              background: isLeading ? color + '18' : C.navyMid,
              border: `2px solid ${isLeading ? color : C.navyLight}`,
              borderRadius: 10, padding: '16px 14px', textAlign: 'center', position: 'relative'
            }}>
              {isLeading && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: color, color: C.navy, fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, letterSpacing: 1, whiteSpace: 'nowrap' }}>LEADING</div>}
              <p style={{ fontSize: 11, color, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>{t}</p>
              <p style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: isLeading ? color : C.white, letterSpacing: 2 }}>{score}</p>
              <p style={{ fontSize: 10, color: C.muted }}>top 10 daily pts</p>
            </div>
          )
        })}
      </div>
      <p style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Individual</p>
      {!board.length ? (
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
          <p style={{ color: C.muted }}>No entries yet.</p>
        </Card>
      ) : board.map((p, i) => {
        const color = p.team ? teamColor(p.team) : C.muted
        return (
          <div key={p.name} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', marginBottom: 8, borderRadius: 8,
            background: i === 0 ? C.gold + '11' : C.navyMid,
            border: `1px solid ${i === 0 ? C.gold + '44' : C.navyLight}`,
            borderLeft: `3px solid ${color}`,
          }}>
            <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{medals[i] || i + 1}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</p>
              <p style={{ fontSize: 12, color: C.muted }}>
                <span style={{ color }}>{p.team || 'No team'}</span>
                {' · '}⚽ {p.matchPts}pts · 🧠 {p.hcPts}pts · {p.entered} days
              </p>
            </div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: i === 0 ? C.gold : C.white, letterSpacing: 1 }}>{p.total}</div>
          </div>
        )
      })}
    </div>
  )
}

export default function App() {
  const [view, setView] = useState('play')
  const [name, setName] = useState(() => localStorage.getItem('wc_name') || '')
  const [team, setTeam] = useState(() => localStorage.getItem('wc_team') || '')
  const [nameInput, setNameInput] = useState('')
  const [teamInput, setTeamInput] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [reveals, setReveals] = useState({})
  const [extraMatches, setExtraMatches] = useState([])
  const [step, setStep] = useState('register') // 'register' | 'confirm'
  const [checking, setChecking] = useState(false)
  const [nameTaken, setNameTaken] = useState(false)

  useEffect(() => {
    getAllReveals().then(setReveals)
    getExtraMatches().then(setExtraMatches)
  }, [])

  const goToConfirm = () => {
    if (!nameInput.trim() || !teamInput) return
    setNameTaken(false)
    setStep('confirm')
  }

  const confirm = async () => {
  setChecking(true)
  const taken = await isNameTaken(nameInput.trim())
  if (taken) { setNameTaken(true); setChecking(false); setStep('register'); return }
  const success = await registerPlayer(nameInput.trim(), teamInput)
  if (!success) { setNameTaken(true); setChecking(false); setStep('register'); return }
  localStorage.setItem('wc_name', nameInput.trim())
  localStorage.setItem('wc_team', teamInput)
  setName(nameInput.trim()); setTeam(teamInput)
  setChecking(false)
}


  const tryAdmin = () => {
    if (adminCode === ADMIN_CODE) { setAdminUnlocked(true); setShowAdmin(true) }
  }

  if (showAdmin && adminUnlocked) return (
    <>
      <style>{globalCSS}</style>
      <Header name={name} team={team} isAdmin />
      <AdminPanel onBack={() => setShowAdmin(false)} />
    </>
  )

  return (
    <>
      <style>{globalCSS}</style>
      <Header name={name} team={team} isAdmin={adminUnlocked} onAdminClick={() => setShowAdmin(true)} />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: 24 }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: C.navyMid, borderRadius: 8, padding: 4, border: `1px solid ${C.navyLight}` }}>
          {[['play', "Today's Challenge"], ['schedule', '📅 Schedule'], ['board', 'Leaderboard']].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{
              flex: 1, padding: '8px 0', borderRadius: 6, border: 'none',
              background: view === v ? C.gold : 'transparent',
              color: view === v ? C.navy : C.muted,
              fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all .15s'
            }}>{label}</button>
          ))}
        </div>

        {view === 'play' && (!name || !team) && step === 'register' && (
          <Card style={{ textAlign: 'center', padding: 40 }} className="fade-in">
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚽</div>
            <p style={{ fontFamily: "'Bebas Neue'", fontSize: 26, letterSpacing: 2, marginBottom: 6 }}>Join the Challenge</p>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Pick your team and enter your name</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, maxWidth: 340, margin: '0 auto 16px' }}>
              {TEAMS.map(t => (
                <button key={t} onClick={() => setTeamInput(t)} style={{
                  flex: 1, padding: '12px 8px', borderRadius: 8, cursor: 'pointer',
                  fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13,
                  border: `2px solid ${teamInput === t ? teamColor(t) : C.navyLight}`,
                  background: teamInput === t ? teamColor(t) + '22' : 'transparent',
                  color: teamInput === t ? teamColor(t) : C.muted, transition: 'all .15s'
                }}>{t}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, maxWidth: 300, margin: '0 auto 12px' }}>
              <Input value={nameInput} onChange={v => { setNameInput(v); setNameTaken(false) }} placeholder="Your name" />
              <Btn onClick={goToConfirm} disabled={!nameInput.trim() || !teamInput}>Go</Btn>
            </div>
            {nameTaken && (
              <p style={{ color: C.red, fontSize: 13, marginTop: 8 }}>
                That name is already taken — try adding your surname initial.
              </p>
            )}
          </Card>
        )}

        {view === 'play' && (!name || !team) && step === 'confirm' && (
          <Card style={{ textAlign: 'center', padding: 40 }} className="fade-in">
            <div style={{ fontSize: 36, marginBottom: 16 }}>👋</div>
            <p style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: 2, marginBottom: 8 }}>Confirm Your Details</p>
            <div style={{ background: C.navyLight, borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <p style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{nameInput}</p>
              <p style={{ color: teamColor(teamInput), fontWeight: 600, fontSize: 14 }}>{teamInput}</p>
            </div>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>
              ⚠️ Your name can't be changed once you join.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Btn variant="ghost" small onClick={() => setStep('register')}>← Back</Btn>
              <Btn onClick={confirm} disabled={checking}>
                {checking ? 'Checking...' : 'Confirm & Join'}
              </Btn>
            </div>
          </Card>
        )}

        {view === 'play' && name && team && <PlayerView name={name} team={team} />}
        {view === 'schedule' && <ScheduleTab isAdmin={false} reveals={reveals} extraMatches={extraMatches} onAddMatch={() => {}} onDeleteExtra={() => {}} />}
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


function Header({ name, team, isAdmin, onAdminClick }) {
  const color = team ? teamColor(team) : C.muted
  return (
    <div style={{ background: C.navyMid, borderBottom: `1px solid ${C.navyLight}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 24 }}>⚽</span>
        <div>
          <p style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 3, color: C.gold, lineHeight: 1 }}>Aon HC World Cup</p>
          <p style={{ fontSize: 11, color: C.muted, letterSpacing: 1 }}>PREDICTION CHALLENGE 2026</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {name && <Tag color={color}>{name}</Tag>}
        {isAdmin && <button onClick={onAdminClick} style={{ background: C.red + '22', color: C.red, border: `1px solid ${C.red}44`, borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer' }}>ADMIN</button>}
      </div>
    </div>
  )
}
