import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join } from 'path'

const file = join(process.cwd(), 'data', 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

async function init(){ await db.read(); db.data = db.data || { candidates: [] }; await db.write() }

export default async function handler(req, res){
  await init()
  if(req.method !== 'POST') return res.status(405).end('Method Not Allowed')
  const { id } = req.body
  if(!id) return res.status(400).json({error:'缺少候选人 id'})
  const idx = db.data.candidates.findIndex(c=>c.id===id)
  if(idx === -1) return res.status(404).json({error:'候选人不存在'})
  db.data.candidates[idx].votes = (db.data.candidates[idx].votes||0) + 1
  await db.write()
  return res.status(200).json(db.data.candidates[idx])
}
