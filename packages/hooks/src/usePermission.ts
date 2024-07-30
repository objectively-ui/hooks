import { useEffect, useState } from 'react'
import { navigator } from './utils/globals'

interface UsePermissionsReturn  {
  granted: boolean;
  state: PermissionState
}

export const usePermission = (permissionName: PermissionName): UsePermissionsReturn => {
  const [state, setState] = useState<PermissionState>('prompt')

  useEffect(() => {
    let permissionStatus: PermissionStatus

    const handleChange = () => {
      setState(permissionStatus.state)
    }

    (async () => {
      permissionStatus = await navigator.permissions.query({name: permissionName})
      permissionStatus?.addEventListener('change', handleChange)
      handleChange()
    })();

    return () => {
      permissionStatus?.removeEventListener('change', handleChange)
    }
  }, [permissionName])

  return {
    state: state,
    granted: state === 'granted'
  }
}
