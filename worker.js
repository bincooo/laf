const baseUrl = "https://raw.githubusercontent.com/bincooo/worker-laf/main";
const suffix = ".txt";
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

function _newResponse(code, data) {
  var blob = new Blob();
  var init = { status: code, statusText: Kv[code] };
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
        return _newResponse(200);
    }

    const data = await request.json();
    const url = baseUrl + pathname + suffix
    const modifiedRequest = new Request(url);
    const response = await fetch(modifiedRequest);
    let content = await response.text();
    for (let k in data) {
      content = content.replaceAll(`{{${k}}}`, data[k])
    }

    console.log(content)
    const newResponse = _newResponse(200);
    newResponse.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin'));
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    newResponse.headers.set('Access-Control-Allow-Headers', '*');
    newResponse.headers.set('Content-Type', 'application/json');
    // return newResponse;
    return Response.json({ result: content }, newResponse);
  },
};