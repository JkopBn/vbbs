import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join } from 'path'
import { nanoid } from 'nanoid'

const file = join(process.cwd(), 'data', 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

async function init(){
  await db.read()
  db.data = db.data || { candidates: [] }
  await db.write()
}

export default async function handler(req, res){
  await init()
  if(req.method === 'GET'){
    const list = db.data.candidates.sort((a,b)=>b.votes - a.votes)
    return res.status(200).json(list)
  } else if(req.method === 'POST'){
    const { name, bio, image } = req.body
    if(!name || !name.trim()) return res.status(400).json({error:'姓名不能为空'})
    const candidate = { id: nanoid(8), name: name.trim(), bio: bio||'', image: image||'', votes: 0, createdAt: Date.now() }
    db.data.candidates.unshift(candidate)
    await db.write()
    return res.status(201).json(candidate)
  } else {
    res.setHeader('Allow', ['GET','POST'])
    res.status(405).end('Method Not Allowed')
  }
}
