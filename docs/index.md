### Simple Vue

install from `npm`

```shell
npm i @sppk/vue
```

Usage in code:
```ts
import { reactive, effect } from '@sppk/vue'
const state = reactive({ a:1 })

effect(() => {
  console.log(state.a)
})

state.a = 2
```
