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
    console.log('data: ', data)
    let history = data['history'] ?? []
    if (data && typeof(data) == 'object') {
        let pre = request.query['pre']
        if (pre) {
            history = [
                {
                    "role": "assistant",
                    "content": pre
                },
                ...history
            ]
        }
    }
    response.json({ result: history })
} catch(err) {
    response.status(500)
    response.json({
      error: err?.toString()
    })
    return
}
