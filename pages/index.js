import { useEffect, useState } from 'react'

function CandidateCard({c, onVote}) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <img src={c.image || '/default-avatar.png'} alt="" className="w-full h-48 object-cover rounded-md mb-3"/>
      <h3 className="text-lg font-semibold">{c.name}</h3>
      <p className="text-sm text-gray-600">{c.bio}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-700">Votes: <span className="font-bold">{c.votes}</span></div>
        <button onClick={()=>onVote(c.id)} className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700">Vote</button>
      </div>
    </div>
  )
}

export default function Home(){
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({name:'',bio:'',image:''})
  const [message, setMessage] = useState('')

  useEffect(()=>{ fetch('/api/candidates').then(r=>r.json()).then(d=>{ setCandidates(d); setLoading(false) }) },[])

  const submitCandidate = async (e) => {
    e.preventDefault()
    setMessage('')
    if(!form.name.trim()){ setMessage('请填写姓名'); return }
    const res = await fetch('/api/candidates', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(form)})
    const data = await res.json()
    if(res.ok){ setCandidates(prev=>[data, ...prev]); setForm({name:'',bio:'',image:''}); setMessage('候选人已添加') }
    else setMessage(data?.error || '添加失败')
  }

  const vote = async (id) => {
    // simple client-side double-vote prevention via localStorage
    const voted = JSON.parse(localStorage.getItem('voted')||'[]')
    if(voted.includes(id)){ setMessage('你已为该候选人投过票（本浏览器）'); return }
    const res = await fetch('/api/vote', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({id})})
    if(res.ok){
      const updated = await res.json()
      setCandidates(prev=>prev.map(p=>p.id===id?updated:p))
      voted.push(id)
      localStorage.setItem('voted', JSON.stringify(voted))
      setMessage('投票成功，感谢你的参与！')
    } else {
      const data = await res.json()
      setMessage(data?.error||'投票失败')
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">校园—校花/校草 评选</h1>
        <div className="text-sm text-gray-500">由同学推荐 & 投票产生</div>
      </header>

      <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">候选人</h2>
            <p className="text-sm text-gray-600">暂无初始候选人 — 由用户提交。</p>
          </div>

          {loading ? <div>加载中...</div> :
            candidates.length===0 ? <div className="p-6 bg-white rounded shadow">目前还没有候选人，快来推荐吧！</div> :
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {candidates.map(c=> <CandidateCard key={c.id} c={c} onVote={vote} />)}
            </div>
          }
        </div>

        <aside className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">推荐候选人</h3>
          <form onSubmit={submitCandidate} className="space-y-3">
            <div>
              <label className="block text-sm">姓名</label>
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm">简介（可选）</label>
              <textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm">图片 URL（可选）</label>
              <input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} className="w-full border rounded px-2 py-1" />
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="px-3 py-1 rounded bg-green-600 text-white">提交候选人</button>
              <div className="text-sm text-gray-600">{message}</div>
            </div>
          </form>
          <hr className="my-3"/>
          <div className="text-xs text-gray-500">注意：为防止刷票，网站在客户端使用浏览器存储做基础防护；若需更强防刷与持久化，请部署时连接数据库（例如 Supabase/Postgres 等）。</div>
        </aside>
      </section>

      <footer className="text-sm text-gray-500 mt-6">部署说明见项目 README。</footer>
    </div>
  )
}
