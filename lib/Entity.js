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
import { EventEmitter } from 'events';
import { fastSplice } from './Utils';
import { DefaultUIDGenerator, UIDGenerator } from './UID';
var Entity = (function (_super) {
    __extends(Entity, _super);
    function Entity(idOrUidGenerator, components) {
        if (components === void 0) { components = []; }
        var _this = _super.call(this) || this;
        _this.id = -1;
        if (typeof idOrUidGenerator === 'number') {
            _this.id = idOrUidGenerator;
        }
        else if (idOrUidGenerator instanceof UIDGenerator) {
            _this.id = idOrUidGenerator.next();
        }
        else {
            _this.id = DefaultUIDGenerator.next();
        }
        _this.systems = [];
        _this.systemsDirty = false;
        _this.components = {};
        for (var i = 0, component = void 0; component = components[i]; i += 1) {
            if ('getDefaults' in component) {
                _this.components[component.name] = component.getDefaults();
            }
            else {
                _this.components[component.name] = Object.assign({}, components[i].defaults);
            }
        }
        _this.ecs = null;
        return _this;
    }
    Entity.prototype.addToECS = function (ecs) {
        this.ecs = ecs;
        this.setSystemsDirty();
    };
    Entity.prototype.setSystemsDirty = function () {
        if (!this.systemsDirty && this.ecs) {
            this.systemsDirty = true;
            this.ecs.entitiesSystemsDirty.push(this);
        }
    };
    Entity.prototype.addSystem = function (system) {
        this.systems.push(system);
    };
    Entity.prototype.removeSystem = function (system) {
        var index = this.systems.indexOf(system);
        if (index !== -1) {
            fastSplice(this.systems, index, 1);
        }
    };
    Entity.prototype.addComponent = function (name, data) {
        this.components[name] = data || {};
        this.setSystemsDirty();
    };
    Entity.prototype.removeComponent = function (name) {
        if (!this.components[name]) {
            return;
        }
        this.components[name] = undefined;
        this.setSystemsDirty();
    };
    Entity.prototype.updateComponent = function (name, data) {
        var component = this.components[name];
        if (!component) {
            this.addComponent(name, data);
        }
        else {
            var keys = Object.keys(data);
            for (var i = 0, key = void 0; key = keys[i]; i += 1) {
                component[key] = data[key];
            }
        }
    };
    Entity.prototype.updateComponents = function (componentsData) {
        var components = Object.keys(componentsData);
        for (var i = 0, component = void 0; component = components[i]; i += 1) {
            this.updateComponent(component, componentsData[component]);
        }
    };
    Entity.prototype.dispose = function () {
        for (var i = 0, system = void 0; system = this.systems[0]; i += 1) {
            system.removeEntity(this);
        }
    };
    return Entity;
}(EventEmitter));
export { Entity };
//# sourceMappingURL=Entity.js.map