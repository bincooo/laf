const 
    request  = arguments[0],
    response = arguments[1],
    template = arguments[2]

const type = request.header('content-type') ?? ''
if (type.indexOf('application/json') < 0) {
  response.status(500)
  response.json({error: '请用json请求数据' })
  return
}

try {
    const data = request.body
    let content = template
    console.log('data: ', data)
    if (data && typeof(data) == 'object') {
        for (let k in data) {
            content = content.replaceAll(`{{${k}}}`, data[k])
        }
    }
    response.json({ result: content })
} catch(err) {
    response.status(500)
    response.json({
      error: err?.toString()
    })
    return
}
