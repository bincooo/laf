const 
    request  = arguments[0],
    response = arguments[1],
    template = arguments[2]


try {

    const buffer = request.body
    const func = new Function(buffer.toString())
    const result = func.apply(global, [request, template])
    response.json({
        result
    })

} catch(err) {
    console.error(err)
    response.status(500)
    response.json({
      error: err?.toString()
    })
}
