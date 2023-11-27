const 
    request  = arguments[0],
    response = arguments[1]

const type = request.header('content-type') ?? ''
if (type.indexOf('application/json') < 0) {
  response.status(500)
  response.json({error: '请用json请求数据' })
  return
}

try {
    const data = request.body
    console.log('data: ', data)
    if (data && typeof(data) == 'object') {
        if (data.question == "/ping") {
            response.json({ result: true })
            return
        }
    }
    response.json({ result: false })
} catch(err) {
    response.status(500)
    response.json({
      error: err?.toString()
    })
    return
}
