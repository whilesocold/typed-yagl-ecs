import { EventEmitter } from 'events'
import { Engine } from './Engine'

import { fastSplice } from './Utils'
import { DefaultUIDGenerator, UIDGenerator } from './UID'
import { System } from './System'
import { Component } from './Component'

export class Entity extends EventEmitter {
  public id: number

  protected systems: Array<System>
  protected systemsDirty: boolean

  protected components: any
  protected ecs: Engine

  public constructor(idOrUidGenerator?: number | UIDGenerator /*, components = [] */) {
    super()

    this.id = -1

    if (typeof idOrUidGenerator === 'number') {
      this.id = idOrUidGenerator

    } else if (idOrUidGenerator instanceof UIDGenerator) {
      this.id = idOrUidGenerator.next()

    } else {
      this.id = DefaultUIDGenerator.next()
    }

    this.systems = []
    this.systemsDirty = false

    this.components = {}

    /*
    for (let i = 0, component; component = components[i]; i += 1) {
      if ('getDefaults' in component) {
        this.components[component.name] = component.getDefaults()

      } else {
        this.components[component.name] = Object.assign({}, components[i].defaults)
      }
    }
     */

    this.ecs = null
  }

  public addToECS(ecs: Engine): void {
    this.ecs = ecs
    this.setSystemsDirty()
  }

  public setSystemsDirty(): void {
    if (!this.systemsDirty && this.ecs) {
      this.systemsDirty = true
      this.ecs.entitiesSystemsDirty.push(this)
    }
  }

  public addSystem(system: System): void {
    this.systems.push(system)
  }

  public removeSystem(system: System): void {
    let index = this.systems.indexOf(system)
    if (index !== -1) {
      fastSplice(this.systems, index, 1)
    }
  }

  public addComponent(component: Component, data: any): void {
    let name = component.constructor.toString().match(/\w+/g)[1]
    let keys = Object.keys(data)

    for (let i = 0, key; key = keys[i]; i += 1) {
      component[key] = data[key]
    }

    this.components[name] = component
    this.setSystemsDirty()
  }

  public removeComponent(componentClass: any): void {
    let name =  componentClass.constructor.toString().match(/\w+/g)[1]

    if (!this.components[name]) {
      return
    }

    this.components[name] = undefined
    this.setSystemsDirty()
  }

  public updateComponent(componentClass: any, data: any): void {
    let name =  componentClass.constructor.toString().match(/\w+/g)[1]
    let component = this.components[name]

    if (!component) {
      this.addComponent(name, data)

    } else {

      let keys = Object.keys(data)

      for (let i = 0, key; key = keys[i]; i += 1) {
        component[key] = data[key]
      }
    }
  }

  /*
  public updateComponents(componentsData: any): void {
    let components = Object.keys(componentsData)
    for (let i = 0, component; component = components[i]; i += 1) {
      this.updateComponent(component, componentsData[component])
    }
  }
   */

  public dispose(): void {
    for (let i = 0, system; system = this.systems[0]; i += 1) {
      system.removeEntity(this)
    }
  }
}