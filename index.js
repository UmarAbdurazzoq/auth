const express = require('express')
const parser = require('co-body')
const { sign } = require('./JWT')
const { fetchAll } = require('./pg')
const PORT = process.env.PORT || 4001
const cors = require('cors')

const app = express()
app.use(cors({origin:"*"}))

app.get('/', async(_, res)=> {res.send(await fetchAll(`select * from users `))})
app.get('/pin', async(_, res)=> {res.send(`pon`)})

app.post('/login', async(req, res)=> {
  const {username, password } = await parser.json(req) 
  const SQL = `
    select * from users where user_username = '${username}' AND user_password = crypt('${password}', user_password);
  `

  try {
    
    const user = (await fetchAll(SQL))[0]
    if (user) {
      
      res.send(({
        token: sign({username : user.user_username, id : user.user_id }),
        user: { id: user.user_id, username: user.user_username, gender: user.user_gender }
      }))
    } else {
      res.send(({status: 401, message: "unAuth"}))
    }
  } catch (error) {
    console.log(error);
  }

})

app.post('/createuser', async(req, res)=> {
  const user = await parser.json(req) 
  const SQL = `
    insert into users(user_username, user_password, user_gender) values('${user.username}', crypt('${user.password}', gen_salt('bf')), '${user.gender}')
  `

  try {
    await fetchAll(SQL)
    res.send({status: 200, message: 'ok'})
  } catch (error) {
    
    res.send({status: error.code,  message: error.message })
  }

})

app.listen(PORT, ()=> console.log("http://localhost:" + PORT))
