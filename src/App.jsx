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
}
return <button style={{ ...base, ...variants[variant] }} onClick={disabled ? undefined : onClick}>{children}</button>
}

const Input = ({ value, onChange, placeholder, type = 'text', multiline }) => {
const s = { background: C.navyLight, border: `1px solid ${C.navyLight}`, borderRadius: 6, padding: '9px 12px', color: C.white, fontFamily: "'DM Sans', sans-serif", fontSize: 14, width: '100%', outline: 'none', resize: multiline ? 'vertical' : undefined }
return multiline
? <textarea style={{ ...s, minHeight: 80 }} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
: <input style={s} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
}

const ScoreInput = ({ value, onChange, disabled }) => (
<input type="number" min="0" max="20" value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
style={{ width: 56, height: 48, textAlign: 'center', fontSize: 24, fontFamily: "'Bebas Neue'", fontWeight: 700, background: C.navyLight, border: `2px solid ${C.navyLight}`, borderRadius: 8, color: C.white, outline: 'none' }} />
)

const Label = ({ children }) => (
<p style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{children}</p>
)

function calcMatchPts(sub, reveal) {
if (!reveal?.match_result) return null
const actualA = parseInt(reveal.actual_a)
const actualB = parseInt(reveal.actual_b)
const pickedA = parseInt(sub.scoreA)
const pickedB = parseInt(sub.scoreB)
if (isNaN(pickedA) || isNaN(pickedB)) return 0
if (pickedA === actualA && pickedB === actualB) return 5
const actualResult = actualA > actualB ? 'A' : actualB > actualA ? 'B' : 'Draw'
const pickedResult = pickedA > pickedB ? 'A' : pickedB > pickedA ? 'B' : 'Draw'
return actualResult === pickedResult ? 2 : 0
}

function calcAonPts(sub, question, revealed) {
if (!revealed || !question) return null
return sub.aonPick === question.answer ? 3 : 0
}

function top20DailyTotal(allSubs, allReveals, allQuestions) {
const teamTotals = { 'Human Capital': 0, 'Risk Capital': 0 }
const qMap = {}
allQuestions.forEach(q => { qMap[q.date] = q.data })
const dates = [...new Set(allSubs.map(s => {
const parts = s.date.split('_')
return parts.length >= 3 ? `${parts[0]}_${parts[1]}_${parts[2]}`.slice(0, 10) : s.date.slice(0, 10)
}))]
for (const date of dates) {
const teamDayScores = { 'Human Capital': {}, 'Risk Capital': {} }
for (const sub of allSubs) {
if (!sub.date.startsWith(date)) continue
const { player, data } = sub
const team = data.team
if (!team || !teamDayScores[team]) continue
const rev = allReveals[sub.matchId || sub.date]
const q = qMap[sub.matchId || sub.date]
let pts = 0
const mp = calcMatchPts(data, rev)
const ap = calcAonPts(data, q, rev?.hc_revealed)
if (mp !== null) pts += mp
if (ap !== null) pts += ap
if (!teamDayScores[team][player]) teamDayScores[team][player] = 0
teamDayScores[team][player] += pts
}
for (const team of TEAMS) {
const scores = Object.values(teamDayScores[team]).sort((a, b) => b - a)
teamTotals[team] += scores.slice(0, 20).reduce((a, b) => a + b, 0)
}
}
return teamTotals
}

async function getAllQuestions() {
const { data } = await supabase.from('questions').select('date, data').order('date', { ascending: true })
return data || []
}
async function upsertQuestion(id, qdata) {
await supabase.from('questions').upsert({ date: id, data: qdata })
}
async function deleteQuestion(id) {
await supabase.from('questions').delete().eq('date', id)
}
async function getAllReveals() {
const { data } = await supabase.from('reveals').select('*')
const map = {}
;(data || []).forEach(r => { map[r.date] = r })
return map
}
async function upsertReveal(id, hc_revealed, match_result, locked, actual_a, actual_b) {
await supabase.from('reveals').upsert({ date: id, hc_revealed: hc_revealed || false, match_result: match_result || null, locked: locked || false, actual_a: actual_a || null, actual_b: actual_b || null })
}
async function getSubmission(matchId, player) {
const id = `${matchId}::${player}`
const { data } = await supabase.from('submissions').select('data').eq('id', id).single()
return data?.data || null
}
async function upsertSubmission(matchId, player, sdata) {
const id = `${matchId}::${player}`
await supabase.from('submissions').upsert({ id, date: matchId, player, data: sdata })
}
async function getAllSubmissions() {
const { data } = await supabase.from('submissions').select('date, player, data')
return (data || []).map(s => ({ ...s, matchId: s.date }))
}
async function registerPlayer(name, team) {
const { error } = await supabase.from('players').insert({ name, team })
return !error
}
async function isNameTaken(name) {
const { data } = await supabase.from('players').select('name').eq('name', name).single()
return !!data
}
function PredictionCard({ matchId, question, reveal, submission, name, team, onSubmit, slotLabel }) {
const [scoreA, setScoreA] = useState('')
const [scoreB, setScoreB] = useState('')
const [aonPick, setAonPick] = useState(null)
const [submitting, setSubmitting] = useState(false)

const submitted = !!submission
const locked = reveal?.locked
const revealed = reveal?.hc_revealed
const matchResult = reveal?.match_result
const correctMatch = submitted && matchResult ? calcMatchPts(submission, reveal) : null
const correctAon = submitted && revealed ? calcAonPts(submission, question, revealed) : null
const totalPts = (correctMatch || 0) + (correctAon || 0)

const doSubmit = async () => {
if (scoreA === '' || scoreB === '' || aonPick === null) return
setSubmitting(true)
const s = { scoreA, scoreB, aonPick, team, ts: Date.now() }
await upsertSubmission(matchId, name, s)
onSubmit(s)
setSubmitting(false)
}

if (!question) return null

return (
<Card style={{ marginBottom: 16 }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
<div>
<Tag color={C.muted}>{slotLabel}</Tag>
<p style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: 2, marginTop: 6 }}>
{question.teamA} <span style={{ color: C.muted }}>vs</span> {question.teamB}
</p>
<p style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{question.match}</p>
</div>
{locked && !submitted && <Tag color={C.red}>🔒 Locked</Tag>}
</div>

<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
<p style={{ fontSize: 12, fontWeight: 600, flex: 1, textAlign: 'right', color: C.muted }}>{question.teamA}</p>
<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
<ScoreInput value={submitted ? submission.scoreA : scoreA} onChange={setScoreA} disabled={submitted || locked} />
<span style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: C.muted }}>–</span>
<ScoreInput value={submitted ? submission.scoreB : scoreB} onChange={setScoreB} disabled={submitted || locked} />
</div>
<p style={{ fontSize: 12, fontWeight: 600, flex: 1, color: C.muted }}>{question.teamB}</p>
</div>
<div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 14 }}>
<span style={{ fontSize: 11, color: C.muted }}>✓ correct result <strong style={{ color: C.white }}>+2</strong></span>
<span style={{ fontSize: 11, color: C.muted }}>🎯 exact score <strong style={{ color: C.white }}>+5</strong></span>
</div>
{matchResult && submitted && (
<p style={{ fontSize: 13, color: correctMatch > 0 ? C.green : C.red, marginBottom: 12 }}>
{correctMatch === 5 ? '🎯 Exact score! +5 pts' : correctMatch === 2 ? '✓ Correct result +2 pts' : `✗ Wrong — result was ${reveal.actual_a}–${reveal.actual_b}`}
</p>
)}

<div style={{ borderTop: `1px solid ${C.navyLight}`, paddingTop: 14 }}>
<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
<Tag color={C.green}>Aon IQ +3</Tag>
</div>
<p style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, marginBottom: 12 }}>{question.hcQ}</p>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
{question.opts.filter(Boolean).map((opt, i) => {
const picked = (submitted ? submission.aonPick : aonPick) === i
const isAnswer = question.answer === i
let border = picked ? C.green : C.navyLight
let bg = picked ? C.green + '22' : 'transparent'
if (revealed) { border = isAnswer ? C.green : (picked && !isAnswer ? C.red : C.navyLight); bg = isAnswer ? C.green + '11' : bg }
return (
<button key={i} onClick={() => !submitted && !locked && setAonPick(i)} style={{
border: `2px solid ${border}`, background: bg, borderRadius: 8,
padding: '9px 12px', color: C.white, fontFamily: "'DM Sans'",
fontWeight: 500, fontSize: 13, textAlign: 'left',
cursor: (submitted || locked) ? 'default' : 'pointer', transition: 'all .15s'
}}>
{revealed && isAnswer ? '✓ ' : ''}{opt}
</button>
)
})}
</div>
{revealed ? (
<div style={{ background: C.navyLight, borderRadius: 8, padding: 12, borderLeft: `3px solid ${C.green}` }}>
{submitted && <p style={{ fontSize: 13, color: correctAon > 0 ? C.green : C.red, marginBottom: 4 }}>{correctAon > 0 ? '✓ Correct — +3 pts' : '✗ Wrong — 0 pts'}</p>}
<p style={{ fontSize: 13, color: C.muted }}>{question.explainer}</p>
</div>
) : locked && !submitted ? (
<p style={{ fontSize: 12, color: C.red }}>🔒 Predictions locked.</p>
) : submitted ? (
<p style={{ fontSize: 12, color: C.muted }}>Answer revealed after the match.</p>
) : null}
</div>

{!submitted && !locked && (
<div style={{ marginTop: 14 }}>
<Btn onClick={doSubmit} disabled={scoreA === '' || scoreB === '' || aonPick === null || submitting}>
{submitting ? 'Locking in...' : 'Lock In'}
</Btn>
</div>
)}
{submitted && matchResult && revealed && (
<div style={{ marginTop: 12, background: C.navyLight, borderRadius: 8, padding: 12, textAlign: 'center' }}>
<p style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: C.gold, letterSpacing: 2 }}>+{totalPts} pts</p>
</div>
)}
</Card>
)
}

function PlayerView({ name, team }) {
const [questions, setQuestions] = useState({})
const [reveals, setReveals] = useState({})
const [submissions, setSubmissions] = useState({})
const [loading, setLoading] = useState(true)

const load = useCallback(async () => {
const [allQs, allRevs] = await Promise.all([getAllQuestions(), getAllReveals()])
const qMap = {}
allQs.forEach(q => { qMap[q.date] = q.data })
setQuestions(qMap)
setReveals(allRevs)
const s1 = await getSubmission(`${TODAY}_1`, name)
const s2 = await getSubmission(`${TODAY}_2`, name)
setSubmissions({ [`${TODAY}_1`]: s1, [`${TODAY}_2`]: s2 })
setLoading(false)
}, [name])

useEffect(() => { load() }, [load])
useEffect(() => { const t = setInterval(load, 15000); return () => clearInterval(t) }, [load])

if (loading) return <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>Loading...</p>

const q1 = questions[`${TODAY}_1`]
const q2 = questions[`${TODAY}_2`]

if (!q1 && !q2) return (
<Card style={{ textAlign: 'center', padding: 40 }}>
<div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
<p style={{ color: C.muted }}>No questions set for today yet.</p>
</Card>
)

return (
<div className="fade-in">
{q1 && (
<PredictionCard matchId={`${TODAY}_1`} question={q1} reveal={reveals[`${TODAY}_1`]}
submission={submissions[`${TODAY}_1`]} name={name} team={team} slotLabel="Match 1"
onSubmit={s => setSubmissions(prev => ({ ...prev, [`${TODAY}_1`]: s }))} />
)}
{q2 && (
<PredictionCard matchId={`${TODAY}_2`} question={q2} reveal={reveals[`${TODAY}_2`]}
submission={submissions[`${TODAY}_2`]} name={name} team={team} slotLabel="Match 2"
onSubmit={s => setSubmissions(prev => ({ ...prev, [`${TODAY}_2`]: s }))} />
)}
</div>
)
}

function ScheduleTab({ isAdmin, reveals, onReload }) {
const [openDate, setOpenDate] = useState(TODAY)
const [showAddForm, setShowAddForm] = useState(false)
const [newMatch, setNewMatch] = useState({ date: '', teamA: '', teamB: '', round: 'Round of 32' })
const [saving, setSaving] = useState(false)
const [extraMatches, setExtraMatches] = useState([])

useEffect(() => {
getAllQuestions().then(qs => {
const extras = qs.filter(q => q.date.startsWith('ko_')).map(q => ({ ...q.data, id: q.date }))
setExtraMatches(extras)
})
}, [reveals])

const rounds = ['Round of 32', 'Round of 16', 'Quarter-final', 'Semi-final', 'Third place', 'Final']

const addMatch = async () => {
if (!newMatch.date || !newMatch.teamA || !newMatch.teamB) return
setSaving(true)
const id = `ko_${newMatch.date}_${newMatch.teamA}_${newMatch.teamB}`.replace(/\s/g, '_').toLowerCase()
await upsertQuestion(id, { ...newMatch, id, isKnockout: true })
setNewMatch({ date: '', teamA: '', teamB: '', round: 'Round of 32' })
setShowAddForm(false); setSaving(false); onReload()
}

const allMatches = [...GROUP_SCHEDULE, ...extraMatches].sort((a, b) => a.date.localeCompare(b.date))
const dates = [...new Set(allMatches.map(m => m.date))]

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
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
<div><Label>Date</Label><Input type="date" value={newMatch.date} onChange={v => setNewMatch(m => ({ ...m, date: v }))} /></div>
<div>
<Label>Round</Label>
<select value={newMatch.round} onChange={e => setNewMatch(m => ({ ...m, round: e.target.value }))}
style={{ background: C.navyLight, border: `1px solid ${C.navyLight}`, borderRadius: 6, padding: '9px 12px', color: C.white, fontSize: 14, width: '100%' }}>
{rounds.map(r => <option key={r} value={r}>{r}</option>)}
</select>
</div>
<div><Label>Team A</Label><Input value={newMatch.teamA} onChange={v => setNewMatch(m => ({ ...m, teamA: v }))} placeholder="Argentina" /></div>
<div><Label>Team B</Label><Input value={newMatch.teamB} onChange={v => setNewMatch(m => ({ ...m, teamB: v }))} placeholder="France" /></div>
</div>
<Btn onClick={addMatch} disabled={!newMatch.date || !newMatch.teamA || !newMatch.teamB || saving}>
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
<span style={{ fontFamily: "'Bebas Neue'", fontSize: 16, letterSpacing: 2 }}>{isToday ? '📅 TODAY — ' : ''}{date}</span>
<span style={{ fontSize: 12, color: C.muted }}>{matches.length} matches {isOpen ? '▲' : '▼'}</span>
</button>
{isOpen && matches.map(m => (
<div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: C.navyMid, borderRadius: 8, border: `1px solid ${C.navyLight}`, marginTop: 6 }}>
<div>
<span style={{ fontSize: 11, color: C.muted, marginRight: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{m.isKnockout ? (m.round || 'KO') : `Grp ${m.group}`}</span>
<span style={{ fontWeight: 600 }}>{m.teamA} vs {m.teamB}</span>
</div>
<div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
{reveals[`${date}_1`]?.match_result && <Tag color={C.green}>{reveals[`${date}_1`].actual_a}–{reveals[`${date}_1`].actual_b}</Tag>}
</div>
</div>
))}
</div>
)
})}
</div>
)
}

function AdminPanel({ onBack }) {
const [questions, setQuestions] = useState({})
const [reveals, setReveals] = useState({})
const [saved, setSaved] = useState('')
const [loading, setLoading] = useState(true)
const [activeTab, setActiveTab] = useState('questions')
const [scoreInputs, setScoreInputs] = useState({})
const emptyForm = { date: TODAY, match: '', teamA: '', teamB: '', hcQ: '', opts: ['', '', '', ''], answer: 0, explainer: '' }
const [form1, setForm1] = useState(emptyForm)
const [form2, setForm2] = useState(emptyForm)

const load = useCallback(async () => {
setLoading(true)
const [qs, revs] = await Promise.all([getAllQuestions(), getAllReveals()])
const qMap = {}
qs.forEach(q => { qMap[q.date] = q.data })
setQuestions(qMap); setReveals(revs); setLoading(false)
}, [])

useEffect(() => { load() }, [load])

const saveQ = async (slot, form) => {
const id = `${form.date}_${slot}`
await upsertQuestion(id, form)
setSaved(slot); setTimeout(() => setSaved(''), 2000); load()
}
const delQ = async (id) => { await deleteQuestion(id); load() }
const toggleLock = async (id) => {
const existing = reveals[id] || {}
await upsertReveal(id, existing.hc_revealed || false, existing.match_result || null, !existing.locked, existing.actual_a, existing.actual_b)
load()
}
const toggleReveal = async (id) => {
const existing = reveals[id] || {}
await upsertReveal(id, !existing.hc_revealed, existing.match_result || null, existing.locked || false, existing.actual_a, existing.actual_b)
load()
}
const setResult = async (id, actualA, actualB) => {
const existing = reveals[id] || {}
const actualResult = parseInt(actualA) > parseInt(actualB) ? 'A' : parseInt(actualB) > parseInt(actualA) ? 'B' : 'Draw'
await upsertReveal(id, existing.hc_revealed || false, actualResult, existing.locked || false, actualA, actualB)
load()
}

const dates = [...new Set(Object.keys(questions).filter(k => k.match(/^\d{4}-\d{2}-\d{2}/)).map(k => k.slice(0, 10)))].sort().reverse()

const QuestionForm = ({ form, setForm, slot }) => (
<Card style={{ marginBottom: 16 }}>
<p style={{ fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: 2, color: C.gold, marginBottom: 14 }}>Match {slot}</p>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
<div><Label>Date</Label><Input type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} /></div>
<div><Label>Match Label</Label><Input value={form.match} onChange={v => setForm(f => ({ ...f, match: v }))} placeholder="Group A" /></div>
<div><Label>Team A</Label><Input value={form.teamA} onChange={v => setForm(f => ({ ...f, teamA: v }))} placeholder="Brazil" /></div>
<div><Label>Team B</Label><Input value={form.teamB} onChange={v => setForm(f => ({ ...f, teamB: v }))} placeholder="Argentina" /></div>
</div>
<div style={{ marginBottom: 12 }}>
<Label>Aon IQ Question</Label>
<Input value={form.hcQ} onChange={v => setForm(f => ({ ...f, hcQ: v }))} placeholder="Question..." />
</div>
{[0, 1, 2, 3].map(i => (
<div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
<div onClick={() => setForm(f => ({ ...f, answer: i }))} style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, cursor: 'pointer', border: `2px solid ${form.answer === i ? C.gold : C.navyLight}`, background: form.answer === i ? C.gold : 'transparent' }} />
<Input value={form.opts[i]} onChange={v => setForm(f => { const o = [...f.opts]; o[i] = v; return { ...f, opts: o } })} placeholder={`Option ${i + 1}`} />
</div>
))}
<p style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>← Circle = correct answer</p>
<div style={{ marginBottom: 14 }}>
<Label>Answer Explainer</Label>
<Input multiline value={form.explainer} onChange={v => setForm(f => ({ ...f, explainer: v }))} placeholder="The data behind the answer..." />
</div>
<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
<Btn small onClick={() => saveQ(slot, form)}>Save Match {slot}</Btn>
{saved === slot && <Tag color={C.green}>Saved ✓</Tag>}
</div>
</Card>
)

return (
<div style={{ maxWidth: 680, margin: '0 auto', padding: 24 }} className="fade-in">
<div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
<Btn variant="ghost" small onClick={onBack}>← Back</Btn>
<span style={{ fontFamily: "'Bebas Neue'", fontSize: 26, letterSpacing: 2, color: C.gold }}>Admin</span>
</div>
<div style={{ display: 'flex', gap: 4, marginBottom: 20, background: C.navyMid, borderRadius: 8, padding: 4, border: `1px solid ${C.navyLight}` }}>
{[['questions', 'Questions'], ['results', 'Results'], ['schedule', 'Schedule']].map(([v, label]) => (
<button key={v} onClick={() => setActiveTab(v)} style={{
flex: 1, padding: '7px 0', borderRadius: 6, border: 'none',
background: activeTab === v ? C.gold : 'transparent',
color: activeTab === v ? C.navy : C.muted,
fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, cursor: 'pointer'
}}>{label}</button>
))}
</div>

{activeTab === 'questions' && (
<>
<QuestionForm form={form1} setForm={setForm1} slot={1} />
<QuestionForm form={form2} setForm={setForm2} slot={2} />
</>
)}

{activeTab === 'results' && (
<div>
{dates.map(date => {
const slots = [1, 2].map(s => ({ slot: s, id: `${date}_${s}`, q: questions[`${date}_${s}`], rev: reveals[`${date}_${s}`] || {} })).filter(s => s.q)
if (!slots.length) return null
return (
<div key={date} style={{ marginBottom: 20 }}>
<p style={{ fontFamily: "'Bebas Neue'", fontSize: 16, letterSpacing: 2, color: C.gold, marginBottom: 10 }}>{date}</p>
{slots.map(({ slot, id, q, rev }) => (
<Card key={id} style={{ marginBottom: 10, padding: '14px 16px' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
<div>
<span style={{ fontSize: 11, color: C.muted, marginRight: 8 }}>Match {slot}</span>
<span style={{ fontWeight: 600 }}>{q.teamA} vs {q.teamB}</span>
{rev.locked && <span style={{ marginLeft: 8 }}><Tag color={C.red}>🔒</Tag></span>}
</div>
<Btn small variant="ghost" onClick={() => delQ(id)}>Delete</Btn>
</div>
<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
<Btn small variant={rev.locked ? 'danger' : 'ghost'} onClick={() => toggleLock(id)}>
{rev.locked ? '🔒 Unlock' : '🔓 Lock'}
</Btn>
{rev.match_result ? (
<Tag color={C.green}>Result: {rev.actual_a}–{rev.actual_b} ✓</Tag>
) : (
<>
<input type="number" min="0" max="20" value={scoreInputs[`${id}_a`] || ''} onChange={e => setScoreInputs(p => ({ ...p, [`${id}_a`]: e.target.value }))}
placeholder="0" style={{ width: 44, padding: '4px 6px', background: C.navyLight, border: `1px solid ${C.navyLight}`, borderRadius: 6, color: C.white, fontSize: 14, textAlign: 'center' }} />
<span style={{ color: C.muted }}>–</span>
<input type="number" min="0" max="20" value={scoreInputs[`${id}_b`] || ''} onChange={e => setScoreInputs(p => ({ ...p, [`${id}_b`]: e.target.value }))}
placeholder="0" style={{ width: 44, padding: '4px 6px', background: C.navyLight, border: `1px solid ${C.navyLight}`, borderRadius: 6, color: C.white, fontSize: 14, textAlign: 'center' }} />
<Btn small variant="green" onClick={() => setResult(id, scoreInputs[`${id}_a`], scoreInputs[`${id}_b`])}
disabled={scoreInputs[`${id}_a`] === undefined || scoreInputs[`${id}_b`] === undefined}>
Set Result
</Btn>
</>
)}
<Btn small variant={rev.hc_revealed ? 'green' : 'ghost'} onClick={() => toggleReveal(id)}>
{rev.hc_revealed ? 'Aon IQ Revealed ✓' : 'Reveal Aon IQ'}
</Btn>
</div>
</Card>
))}
</div>
)
})}
</div>
)}

{activeTab === 'schedule' && <ScheduleTab isAdmin reveals={reveals} onReload={load} />}
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
const { matchId, player, data } = sub
if (!scores[player]) scores[player] = { total: 0, matchPts: 0, aonPts: 0, entered: 0, team: data.team || null }
scores[player].entered++
if (data.team) scores[player].team = data.team
const rev = allRevs[matchId]
const q = qMap[matchId]
const mp = calcMatchPts(data, rev)
const ap = calcAonPts(data, q, rev?.hc_revealed)
if (mp !== null) { scores[player].matchPts += mp; scores[player].total += mp }
if (ap !== null) { scores[player].aonPts += ap; scores[player].total += ap }
}
const sorted = Object.entries(scores).map(([name, s]) => ({ name, ...s })).sort((a, b) => b.total - a.total)
setBoard(sorted)
setTeamTotals(top20DailyTotal(allSubs, allRevs, allQs))
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
<div key={t} style={{ background: isLeading ? color + '18' : C.navyMid, border: `2px solid ${isLeading ? color : C.navyLight}`, borderRadius: 10, padding: '16px 14px', textAlign: 'center', position: 'relative' }}>
{isLeading && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: color, color: C.navy, fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, letterSpacing: 1, whiteSpace: 'nowrap' }}>LEADING</div>}
<p style={{ fontSize: 11, color, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>{t}</p>
<p style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: isLeading ? color : C.white, letterSpacing: 2 }}>{score}</p>
<p style={{ fontSize: 10, color: C.muted }}>top 20 daily pts</p>
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
<div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', marginBottom: 8, borderRadius: 8, background: i === 0 ? C.gold + '11' : C.navyMid, border: `1px solid ${i === 0 ? C.gold + '44' : C.navyLight}`, borderLeft: `3px solid ${color}` }}>
<span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{medals[i] || i + 1}</span>
<div style={{ flex: 1 }}>
<p style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</p>
<p style={{ fontSize: 12, color: C.muted }}>
<span style={{ color }}>{p.team || 'No team'}</span>
{' · '}⚽ {p.matchPts}pts · 🧠 {p.aonPts}pts · {p.entered} entries
</p>
</div>
<div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: i === 0 ? C.gold : C.white, letterSpacing: 1 }}>{p.total}</div>
</div>
)
})}
</div>
)
}

function HelpTab() {
return (
<div className="fade-in">
<Card style={{ marginBottom: 12 }}>
<p style={{ fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 2, color: C.gold, marginBottom: 14 }}>⚽ Scoring</p>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
{[['🎯 +5', 'Exact score'], ['+2', 'Correct result'], ['+3', 'Aon IQ correct']].map(([pts, label]) => (
<div key={label} style={{ background: C.navyLight, borderRadius: 8, padding: 12, textAlign: 'center' }}>
<p style={{ fontFamily: "'Bebas Neue'", fontSize: 26, color: C.gold }}>{pts}</p>
<p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{label}</p>
</div>
))}
</div>
<p style={{ fontSize: 13, color: C.muted }}>Two matches per day, each with a score prediction and an Aon IQ question. Maximum <strong style={{ color: C.white }}>16 pts</strong> per day.</p>
</Card>
<Card style={{ marginBottom: 12 }}>
<p style={{ fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 2, color: C.gold, marginBottom: 10 }}>🏆 Team Leaderboard</p>
<p style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>Each day, the <strong style={{ color: C.white }}>top 20 scores</strong> from each team count toward that team's total.</p>
<p style={{ fontSize: 13, color: C.muted }}>Human Capital vs Risk Capital — accumulated across the whole tournament.</p>
</Card>
<Card style={{ marginBottom: 12 }}>
<p style={{ fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 2, color: C.gold, marginBottom: 10 }}>📅 Tournament Dates</p>
<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
{[['Group Stage', 'Jun 11 – Jun 27'], ['Round of 32', 'Jun 29 – Jul 2'], ['Round of 16', 'Jul 4 – Jul 6'], ['Quarter-finals', 'Jul 8 – Jul 9'], ['Semi-finals', 'Jul 14 – Jul 15'], ['Final', 'Jul 19']].map(([round, dates]) => (
<div key={round} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.navyLight}` }}>
<span style={{ fontSize: 13, fontWeight: 600 }}>{round}</span>
<span style={{ fontSize: 13, color: C.muted }}>{dates}</span>
</div>
))}
</div>
</Card>
<Card>
<p style={{ fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 2, color: C.gold, marginBottom: 10 }}>⏰ Daily Routine</p>
<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
{[['Morning', 'Two matches + Aon IQ questions go live'], ['Before kick-off', 'Predictions lock — no more entries'], ['After match', 'Results revealed, points calculated'], ['Next morning', 'Check your score, make today\'s predictions']].map(([time, desc]) => (
<div key={time} style={{ display: 'flex', gap: 12 }}>
<span style={{ fontSize: 12, color: C.gold, fontWeight: 600, minWidth: 100 }}>{time}</span>
<span style={{ fontSize: 13, color: C.muted }}>{desc}</span>
</div>
))}
</div>
</Card>
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
const [step, setStep] = useState('register')
const [checking, setChecking] = useState(false)
const [nameTaken, setNameTaken] = useState(false)
const [reveals, setReveals] = useState({})

useEffect(() => { getAllReveals().then(setReveals) }, [])

const goToConfirm = () => {
if (!nameInput.trim() || !teamInput) return
setNameTaken(false); setStep('confirm')
}

const confirm = async () => {
setChecking(true)
const taken = await isNameTaken(nameInput.trim())
if (taken) { setNameTaken(true); setChecking(false); setStep('register'); return }
const success = await registerPlayer(nameInput.trim(), teamInput)
if (!success) { setNameTaken(true); setChecking(false); setStep('register'); return }
localStorage.setItem('wc_name', nameInput.trim())
localStorage.setItem('wc_team', teamInput)
setName(nameInput.trim()); setTeam(teamInput); setChecking(false)
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
{[['play', 'Today'], ['schedule', '📅'], ['board', 'Leaderboard'], ['help', '❓']].map(([v, label]) => (
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
{nameTaken && <p style={{ color: C.red, fontSize: 13, marginTop: 8 }}>That name is already taken — try adding your surname initial.</p>}
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
<p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>⚠️ Your name cannot be changed once you join.</p>
<div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
<Btn variant="ghost" small onClick={() => setStep('register')}>← Back</Btn>
<Btn onClick={confirm} disabled={checking}>{checking ? 'Checking...' : 'Confirm & Join'}</Btn>
</div>
</Card>
)}

{view === 'play' && name && team && <PlayerView name={name} team={team} />}
{view === 'schedule' && <ScheduleTab isAdmin={false} reveals={reveals} onReload={() => getAllReveals().then(setReveals)} />}
{view === 'board' && <Leaderboard />}
{view === 'help' && <HelpTab />}

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
