import { Entity } from './Entity'
import { EventEmitter } from 'events'
import { fastSplice } from './Utils'

export class System extends EventEmitter {
  protected frequency: number
  protected entities: Array<Entity>

  public constructor(frequency: number = 1) {
    super()

    this.frequency = frequency
    this.entities = []
  }

  public addEntity(entity: Entity): void {
    entity.addSystem(this)
    this.entities.push(entity)

    this.enter(entity)
  }

  public removeEntity(entity: Entity): void {
    let index = this.entities.indexOf(entity)

    if (index !== -1) {
      entity.removeSystem(this)
      fastSplice(this.entities, index, 1)

      this.exit(entity)
    }
  }

  public updateAll(dt: number): void {
    this.preUpdate()

    for (let i = 0, entity; entity = this.entities[i]; i += 1) {
      this.update(entity, dt)
    }

    this.postUpdate()
  }

  public dispose(): void {
    for (let i = 0, entity; entity = this.entities[i]; i += 1) {
      entity.removeSystem(this)
      this.exit(entity)
    }
  }

  public preUpdate(): void {
  }

  public postUpdate(): void {
  }

  public test(entity: Entity): boolean {
    return false
  }

  public enter(entity: Entity): void {
  }

  public exit(entity: Entity): void {
  }

  public update(entity: Entity, dt: number): void {
  }
}
