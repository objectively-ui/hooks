import { isSSR } from './utils/ssr'

export const useSSR = () => {
  return isSSR
}
