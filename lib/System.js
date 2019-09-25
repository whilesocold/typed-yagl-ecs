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
var System = (function (_super) {
    __extends(System, _super);
    function System(frequency) {
        if (frequency === void 0) { frequency = 1; }
        var _this = _super.call(this) || this;
        _this.frequency = frequency;
        _this.entities = [];
        return _this;
    }
    System.prototype.addEntity = function (entity) {
        entity.addSystem(this);
        this.entities.push(entity);
        this.enter(entity);
    };
    System.prototype.removeEntity = function (entity) {
        var index = this.entities.indexOf(entity);
        if (index !== -1) {
            entity.removeSystem(this);
            fastSplice(this.entities, index, 1);
            this.exit(entity);
        }
    };
    System.prototype.updateAll = function (dt) {
        this.preUpdate();
        for (var i = 0, entity = void 0; entity = this.entities[i]; i += 1) {
            this.update(entity, dt);
        }
        this.postUpdate();
    };
    System.prototype.dispose = function () {
        for (var i = 0, entity = void 0; entity = this.entities[i]; i += 1) {
            entity.removeSystem(this);
            this.exit(entity);
        }
    };
    System.prototype.preUpdate = function () {
    };
    System.prototype.postUpdate = function () {
    };
    System.prototype.test = function (entity) {
        return false;
    };
    System.prototype.enter = function (entity) {
    };
    System.prototype.exit = function (entity) {
    };
    System.prototype.update = function (entity, dt) {
    };
    return System;
}(EventEmitter));
export { System };
//# sourceMappingURL=System.js.map