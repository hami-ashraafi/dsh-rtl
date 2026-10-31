# @deepseek-ai/dsh-client-ui-rtl

为波斯语和阿拉伯语提供从右到左的聊天文本。

聊天以 LTR 基准方向渲染助手 Markdown 和用户气泡，RTL 书写系统的句末标点和列表标记因此
位置错误。本插件在其生命周期内挂载一个样式表，销毁时移除：不读取任何服务、不注册插槽，
也不触碰聊天自身拥有的 DOM。

## 变更范围

| 区域 | 之前 | 之后 |
| --- | --- | --- |
| 助手 Markdown | 从左到右、左对齐 | 从右到左、右对齐 |
| 用户气泡 | 从左到右、左对齐 | 从右到左、右对齐 |
| 消息内列表 | 标记在左、缩进在左 | 标记在右、缩进镜像 |
| 代码、行内代码、KaTeX | 从左到右 | 从左到右且 `unicode-bidi: isolate` |
| 输入框 | 从左到右 | 从右到左 |

侧边栏、标签栏、工具栏和设置不受影响：选择器限定在 `data-slot="conversation.chat.flow"`、
`data-chat-turn` 和 `data-conversation-scroll` 之内。

## 挂载

Web 组合的补丁在 `ui-chat` 旁挂载本包：

```yaml
    - id: ui-rtl
      name: '@deepseek-ai/dsh-client-ui-rtl'
```

## 限制

- 整个聊天区强制 RTL。纯英文回答也会右对齐，但行内顺序正确；按段落自动判定方向是后续工作。
- 本包没有设置项。方向偏好属于 Chat 的设置命名空间，届时再注入。
