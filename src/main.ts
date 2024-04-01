import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import { execSync } from 'child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'

const
  script = 'script',
  tpl = 'tpl/',
  suffix = '.txt';

// dotenv.config()
async function execution(request: Request, response: Response) {
  if (request.path == '/') {
    const index = fs.readFileSync('index.html').toString()
    response.writeHead(200, {'Content-Type':'text/html'})
    response.end(index)
    return
  }

  let t = request.query['t'] ?? ''

  try {
    if (t) {
       t = fs.readFileSync([tpl, t, suffix].join('')).toString()
    }

    const code = fs.readFileSync([script, request.path, '.js'].join(''))
    const func = new Function(code.toString())
    func.apply(global, [request, response, t, {
      crypto,
    }])
  } catch(err: any) {
    console.error(err)
    response.status(500)
    response.json({
      error: err.toString()
    })
    return
  }
}

async function update(_: Request, response: Response) {
  const buffer = execSync('git pull')
  response.send(buffer.toString())
}

async function main() {
  const app = express()
  app.use(morgan('dev'))
  app.use(bodyParser.raw({
    limit: '1mb',
    inflate: true,
    type: 'text/plain'
  }))
  app.use(bodyParser.json({ limit: '1mb' }))
  app.use(bodyParser.urlencoded({
      extended: true
    }))
  app.get('/update', update)
  app.all('*', execution)
  app.listen(3000)
  console.log('Start By: http://127.0.0.1:3000')
}

main()
.catch(err => console.log(err))

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason)
})
