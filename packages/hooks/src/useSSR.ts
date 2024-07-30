import { isSSR } from './utils/ssr'

export const useSSR = (): boolean => {
  return isSSR
}
