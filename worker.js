/**
 * 该脚本提供于cloudflre worker部署,用于实现简单的模版变量替换功能
 * config:
 *    suffix: 模板文件后缀
 * 
 *    baseURL: 自建github的文件访问地址
 *      例如 `https://github.com/bincooo/worker-laf/blob/main/tpl/question.txt`, 
 *      可转变为 `https://raw.githubusercontent.com/bincooo/worker-laf/main/tpl/question.txt`
 *      `tpl/question` 即是访问地址路径 `pathname`
 *      请求参数使用 `application/json` 格式, 每个key的value将被替换到模版文件中的`{{key}}`
 *          > `{a:1}` >>> `你好{{a}}!` >>>> `你好1!`
 * 
 * 返回请求结果: {result: 'xxxxx'}
 */

const config = {
  // 自建github的文件访问地址
  baseURL : "https://raw.githubusercontent.com/bincooo/worker-laf/main",
  // 模板文件后缀
  suffix: ".txt",
}

const Kv = {
  200: 'ok',
  302: 'Move temporarily',
  304: 'Not Modified',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error'
}

function _parseRrequest(request) {
  return new URL(request.url);
}

function _remoteUrl(pathname) {
  return config.baseURL + pathname + config.suffix;
}

function _newResponse(code, data) {
  var blob
  switch (typeof data) {
    case 'string':
    case 'number':
      blob = new Blob([data]);
      break
    case 'object':
      blob = new Blob([JSON.stringify(data, null, 2)], {type : 'application/json'});
    default:
      blob = new Blob();
  }
  var init = { status: code, statusText: Kv[code] ?? "" };
  return new Response(blob, init);
}

export default {
  /**
   * fetch
   * @param {Request} request
   * @param {*} env
   * @param {*} ctx
   * @returns
   */
  async fetch (request, env, ctx) {
    const { pathname } = _parseRrequest(request)
    if (pathname == "" || pathname == "/") {
        return _newResponse(200, {version: 'v1.0.0', description: 'github: bincooo/worker-laf'});
    }

    const data = await request.json();
    const modifiedRequest = new Request(_remoteUrl(pathname));
    const response = await fetch(modifiedRequest);


    const status = await response.status()
    if (status != 200) {
      return _newResponse(status)
    }

    let content = await response.text();
    for (let k in data) {
      content = content.replaceAll(`{{${k}}}`, data[k])
    }

    // console.log(content)
    const newResponse = _newResponse(200);
    newResponse.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin'));
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    newResponse.headers.set('Access-Control-Allow-Headers', '*');
    newResponse.headers.set('Content-Type', 'application/json');
    return Response.json({ result: content }, newResponse);
  },
};