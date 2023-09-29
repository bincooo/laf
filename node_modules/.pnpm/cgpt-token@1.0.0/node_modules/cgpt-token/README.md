# OpenAIAuth for Node.js
OpenAI Authentication Library for ChatGPT.

### Usage
```js
import Authenticator from 'cgpt-token'

const auth = new Authenticator('my@email.com', 'myPassword')
// proxy server [ip]:[port]
// const auth = new Authenticator('my@email.com', 'myPassword', '127.0.0.1:7890')
await auth.begin()
const token = await auth.getAccessToken()
```

Credits
Thank you to:

- https://github.com/acheong08/OpenAIAuth original python implementation
- [rawandahmad698] for the reverse engineering of the protocol