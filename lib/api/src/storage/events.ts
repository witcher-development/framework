import { Event } from '@exteranto/core'

export class StorageChangedEvent extends Event {
  /**
   * @param type Whether it was sync or local
   * @param storable What has chagend
   */
  constructor (public type: string, public storable: any) {
    super()
  }
}
