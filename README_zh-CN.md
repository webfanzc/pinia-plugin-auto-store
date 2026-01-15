# pinia-plugin-auto-store

一个 Vite 插件，自动从 Pinia store 目录生成统一的 `useStore` 辅助函数，支持完整的 TypeScript 类型和热更新。

## 特性

- 🚀 **自动生成** - 自动扫描 store 目录并生成带类型的 `useStore` 辅助函数
- 🔥 **热更新** - 开发模式下监听文件变化并自动重新生成
- 📦 **类型安全** - 完整的 TypeScript 支持，正确推断 state、getters 和 actions 的类型
- 🎯 **灵活配置** - 支持 glob 模式排除文件
- ⚡ **零运行时** - 仅在构建时运行，无运行时开销

## 安装

```bash
npm install pinia-plugin-auto-store -D
# 或
pnpm add pinia-plugin-auto-store -D
# 或
yarn add pinia-plugin-auto-store -D
```

## 使用方法

### 1. 在 Vite 配置中添加插件

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import piniaAutoStore from 'pinia-plugin-auto-store'

export default defineConfig({
  plugins: [
    vue(),
    piniaAutoStore({
      storeDir: 'src/store',
      output: 'src/helper/use-store.ts',
      exclude: '**/index.ts',
    }),
  ],
})
```

### 2. 创建 Pinia stores

```ts
// src/store/index.ts
import { createPinia } from 'pinia'

const store = createPinia()

export default store
```

```ts
// src/store/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export default defineStore('user', () => {
  const name = ref('Guest')
  const age = ref(0)

  function setName(newName: string) {
    name.value = newName
  }

  return { name, age, setName }
})
```

```ts
// src/store/counter.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export default defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, double, increment }
})
```

### 3. 在组件中使用生成的辅助函数

```vue
<script setup lang="ts">
import { useStore } from '@/helper/use-store'

// store 名称有完整的类型推断
const user = useStore('user')
const counter = useStore('counter')

// 访问 state、getters 和 actions，带完整类型
console.log(user.name)       // Ref<string>
console.log(counter.double)  // ComputedRef<number>
counter.increment()          // () => void
</script>

<template>
  <div>
    <p>用户: {{ user.name }}</p>
    <p>计数: {{ counter.count }} (双倍: {{ counter.double }})</p>
    <button @click="counter.increment">+1</button>
  </div>
</template>
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `storeDir` | `string` | `'src/store'` | 包含 Pinia stores 的目录 |
| `output` | `string` | `'src/helper/use-store.ts'` | 生成的辅助函数输出路径 |
| `exclude` | `string \| string[]` | `'**/index.ts'` | 排除文件的 glob 模式 |
| `watch` | `boolean` | `undefined` | 是否启用文件监听，开发模式下默认为 `true` |

## 生成的代码

插件生成的 `useStore` 辅助函数会：

1. **导入所有 stores** - 从 store 目录导入（排除匹配的模式）
2. **导出带类型的 `useStore` 函数** - 接受 store 名称，返回带 refs 的 store 实例

生成代码示例：

```ts
/* eslint-disable */
// @ts-nocheck
import type { ToRef, UnwrapRef } from 'vue'
import type { StoreDefinition } from 'pinia'
import { storeToRefs } from 'pinia'

import counterStore from './store/counter'
import userStore from './store/user'

import store from './store'

type StoreToRefs<T extends StoreDefinition> = {
  [K in keyof ReturnType<T>]: ReturnType<T>[K] extends (...args: any[]) => any
    ? ReturnType<T>[K]
    : ToRef<UnwrapRef<ReturnType<T>[K]>>
}

export function useStore<T extends keyof typeof storeExports>(storeName: T) {
  const storeExports = {
    counter: counterStore,
    user: userStore,
  }

  const targetStore = storeExports[storeName](store)
  const storeRefs = storeToRefs(targetStore)

  return { ...targetStore, ...storeRefs } as StoreToRefs<(typeof storeExports)[T]>
}
```

## 环境要求

- Vite 7.x
- Vue 3.x
- Pinia 3.x

## Store 文件规范

- 每个 store 文件应该**默认导出** `defineStore` 的结果
- store 目录应该有一个 `index.ts` 导出 Pinia 实例（默认被排除）
- Store 文件应该是 `.ts` 文件

## 许可证

MIT

## 作者

[skelanimals](https://github.com/webfanzc)
