## Simple Vue

implement simple vue3 for study purpose

### Support Feature

* create reactive data with following api:
  * reactive
  * ref
  * toRef
  * unref
  * computed
* mount root component
* update root component state
* onMounted lifecycle hook


### Getting Started
install from `npm`

```shell
npm i @sppk/vue
```

Usage in code:
```ts
import { createApp, reactive, h } from '@sppk/vue'
const App = {
  setup() {
    const count = ref(0)
    return {
      count
    }
  },
  render() {
    return h('h2',{},this.count)
  }
}

createApp(App).mount('#app')
```
