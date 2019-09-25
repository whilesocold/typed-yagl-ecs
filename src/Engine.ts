import { Entity } from './Entity'
import { System } from './System'
import { fastSplice } from './Utils'

import { EventEmitter } from 'events'

/**
 * @class  Engine
 */
export class Engine extends EventEmitter {
  public entities: Array<Entity>
  public entitiesSystemsDirty: Array<Entity>
  public systems: Array<System>

  public constructor() {
    super()

    this.entities = []
    this.entitiesSystemsDirty = []
    this.systems = []
  }

  public getEntityById(id: number): Entity {
    for (let i = 0, entity; entity = this.entities[i]; i += 1) {
      if (entity.id === id) {
        return entity
      }
    }
    return null
  }

  public addEntity(entity: Entity): void {
    this.entities.push(entity)
    entity.addToECS(this)
  }

  public removeEntity(entity: Entity): Entity {
    let index = this.entities.indexOf(entity)
    let entityRemoved = null

    // if the entity is not found do nothing
    if (index !== -1) {
      entityRemoved = this.entities[index]

      entity.dispose()
      this.removeEntityIfDirty(entityRemoved)

      fastSplice(this.entities, index, 1)
    }

    return entityRemoved
  }

  public removeEntityById(entityId: number): Entity {
    for (let i = 0, entity; entity = this.entities[i]; i += 1) {
      if (entity.id === entityId) {
        entity.dispose()
        this.removeEntityIfDirty(entity)

        fastSplice(this.entities, i, 1)

        return entity
      }
    }
  }

  public removeEntityIfDirty(entity: Entity): void {
    let index = this.entitiesSystemsDirty.indexOf(entity)
    if (index !== -1) {
      fastSplice(this.entities, index, 1)
    }
  }

  public addSystem(system: System): void {
    this.systems.push(system)

    for (let i = 0, entity; entity = this.entities[i]; i += 1) {
      if (system.test(entity)) {
        system.addEntity(entity)
      }
    }
  }

  public removeSystem(system: System) {
    let index = this.systems.indexOf(system)
    if (index !== -1) {
      fastSplice(this.systems, index, 1)
      system.dispose()
    }
  }

  public cleanDirtyEntities(): void {
    for (let i = 0, entity; entity = this.entitiesSystemsDirty[i]; i += 1) {
      for (let s = 0, system; system = this.systems[s]; s += 1) {
        let index = entity.systems.indexOf(system)
        let entityTest = system.test(entity)

        if (index === -1 && entityTest) {
          system.addEntity(entity)

        } else if (index !== -1 && !entityTest) {
          system.removeEntity(entity)
        }
      }
      entity.systemsDirty = false
    }
    this.entitiesSystemsDirty = []
  }

  public update(dt: number): void {
    for (let i = 0, system; system = this.systems[i]; i += 1) {
      if (this.entitiesSystemsDirty.length) {
        this.cleanDirtyEntities()
      }

      system.updateAll(dt)
    }
  }
}