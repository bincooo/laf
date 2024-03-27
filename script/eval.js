const 
    request  = arguments[0],
    response = arguments[1],
    template = arguments[2]


try {

    const obj = request.body
    debugger
    const func = new Function(obj.str)
    const result = func.apply(global, [request, template])
    response.json({
        result
    })

} catch(err) {
    response.status(500)
    response.json({
      error: err?.toString()
    })
}
