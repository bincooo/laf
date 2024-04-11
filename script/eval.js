const response = arguments[1];

// 制作一个简单的沙箱
createSandbox = (global) => {
    const context = Object.create(null);
    const proxy = new Proxy(context, {
        has: () => true,
        get: (target, prop) => {
            switch (prop) {
                case "globalThis":
                case "window":
                case "parent":
                case "self":
                    return proxy;
                case "eval":
                case "function":
                    return undefined;
                default:
                    if (prop in target) {
                        return target[prop];
                    }
                    const value = global[prop];
                    if (typeof value === "function" && !value.prototype) {
                        return value.bind(global);
                    }

                    return value;
            }
        }
    });
    const sandbox = (code, ...args) => {
        return Function("tools", `with(tools) { ${code} }`).bind(proxy)(...args);
    };
    sandbox.context = context;
    return sandbox;
};


try {

    const buffer = arguments[0].body
    console.log("======================== START EVAL ========================")
    console.log(buffer.toString())
    console.log("========================= END EVAL =========================")
    const vmSandbox = createSandbox(global)
    const result = vmSandbox(buffer.toString(), arguments[3])
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
