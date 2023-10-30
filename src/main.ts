import dotenv from 'dotenv-safe'
import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import { execSync } from 'child_process'
import fs from 'node:fs'

const
  script = 'script',
  tpl = 'tpl/',
  suffix = '.txt'

// dotenv.config()
async function execution(request: Request, response: Response) {
  if (request.path == '/') {
    response.json({
      version: 'v1.0.0',
      description: 'github: bincooo/worker-laf'
    })
    return
  }

  let t = request.query['t'] ?? ''

  try {
    if (t) {
       t = fs.readFileSync([tpl, t, suffix].join('')).toString()
    }

    const code = fs.readFileSync([script, request.path, '.js'].join(''))
    const callback = new Function(code.toString())
    callback(request, response, t)
  } catch(err) {
    response.status(500)
    response.json({
      error: err?.toString()
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
