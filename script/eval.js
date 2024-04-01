const response = arguments[1]


try {

    const buffer = arguments[0].body
    const func = new Function(buffer.toString())
    // [0] req, [1] tools = {}
    const result = func.apply(global, [arguments[0], arguments[3]])
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
