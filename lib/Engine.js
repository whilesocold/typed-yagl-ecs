var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { fastSplice } from './Utils';
import { EventEmitter } from 'events';
var Engine = (function (_super) {
    __extends(Engine, _super);
    function Engine() {
        var _this = _super.call(this) || this;
        _this.entities = [];
        _this.entitiesSystemsDirty = [];
        _this.systems = [];
        return _this;
    }
    Engine.prototype.getEntityById = function (id) {
        for (var i = 0, entity = void 0; entity = this.entities[i]; i += 1) {
            if (entity.id === id) {
                return entity;
            }
        }
        return null;
    };
    Engine.prototype.addEntity = function (entity) {
        this.entities.push(entity);
        entity.addToECS(this);
    };
    Engine.prototype.removeEntity = function (entity) {
        var index = this.entities.indexOf(entity);
        var entityRemoved = null;
        if (index !== -1) {
            entityRemoved = this.entities[index];
            entity.dispose();
            this.removeEntityIfDirty(entityRemoved);
            fastSplice(this.entities, index, 1);
        }
        return entityRemoved;
    };
    Engine.prototype.removeEntityById = function (entityId) {
        for (var i = 0, entity = void 0; entity = this.entities[i]; i += 1) {
            if (entity.id === entityId) {
                entity.dispose();
                this.removeEntityIfDirty(entity);
                fastSplice(this.entities, i, 1);
                return entity;
            }
        }
    };
    Engine.prototype.removeEntityIfDirty = function (entity) {
        var index = this.entitiesSystemsDirty.indexOf(entity);
        if (index !== -1) {
            fastSplice(this.entities, index, 1);
        }
    };
    Engine.prototype.addSystem = function (system) {
        this.systems.push(system);
        for (var i = 0, entity = void 0; entity = this.entities[i]; i += 1) {
            if (system.test(entity)) {
                system.addEntity(entity);
            }
        }
    };
    Engine.prototype.removeSystem = function (system) {
        var index = this.systems.indexOf(system);
        if (index !== -1) {
            fastSplice(this.systems, index, 1);
            system.dispose();
        }
    };
    Engine.prototype.cleanDirtyEntities = function () {
        for (var i = 0, entity = void 0; entity = this.entitiesSystemsDirty[i]; i += 1) {
            for (var s = 0, system = void 0; system = this.systems[s]; s += 1) {
                var index = entity.systems.indexOf(system);
                var entityTest = system.test(entity);
                if (index === -1 && entityTest) {
                    system.addEntity(entity);
                }
                else if (index !== -1 && !entityTest) {
                    system.removeEntity(entity);
                }
            }
            entity.systemsDirty = false;
        }
        this.entitiesSystemsDirty = [];
    };
    Engine.prototype.update = function (dt) {
        for (var i = 0, system = void 0; system = this.systems[i]; i += 1) {
            if (this.entitiesSystemsDirty.length) {
                this.cleanDirtyEntities();
            }
            system.updateAll(dt);
        }
    };
    return Engine;
}(EventEmitter));
export { Engine };
//# sourceMappingURL=Engine.js.map