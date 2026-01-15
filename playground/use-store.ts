
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
