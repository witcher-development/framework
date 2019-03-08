import { Permission } from '../Permission'
import { PermissionManager as AbstractPermissionManager } from '../PermissionManager'

export class PermissionManager extends AbstractPermissionManager {

  /**
   * {@inheritdoc}
   */
  public async contains (needle: Permission|Permission[]) : Promise<boolean> {
    if (!Array.isArray(needle)) {
      needle = [needle]
    }

    const permissions: string[] = await new Promise<string[]>(
      resolve => chrome.permissions.getAll(response => resolve(response.permissions)),
    )

    return needle.every((permission) => {
      if (permission === undefined) {
        return false
      }

      return permissions.find(p => p === permission) !== undefined
    })
  }

}
