### 说明

这是一个简易的api服务
内置了模版格式化接口

#### 使用：

更新: 修改代码后点击主页中的按钮**更新**即可


> script: 脚本
> 
> tpl: 模版

```text
http://127.0.0.1:300/[script]?t=[tpl]

```

内置实现:

```text
> 模版替换：

POST http://127.0.0.1:300/replace?t=question

Content-Type:	application/json
Content-Length:	18 bytes

{
  "question": "xxx"
}

----
以上会找到tpl目录下的question.txt模版，并替换{{question}}为"xxx"


```

```text
> 脚本执行：

POST http://127.0.0.1:300/eval

Content-Type:	text/plain
Content-Length:	18 bytes

return {
    "question": "xxx"
}

----
以上会执行"return"脚本，返回：
{
    "result":{
        "question": "xxx"
    }
}

```