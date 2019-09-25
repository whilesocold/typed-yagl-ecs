var MAX_SALTS = 10000;
var MAX_ENTITY_PER_GENERATOR = Math.floor(Number.MAX_VALUE / MAX_SALTS) - 1;
var currentSalt = 0;
var UIDGenerator = (function () {
    function UIDGenerator(salt) {
        if (salt === void 0) { salt = 0; }
        this.salt = salt;
        this.uidCounter = 0;
    }
    UIDGenerator.prototype.next = function () {
        var nextUid = this.salt + this.uidCounter * MAX_SALTS;
        if (++this.uidCounter >= MAX_ENTITY_PER_GENERATOR) {
            this.uidCounter = 0;
        }
        return nextUid;
    };
    return UIDGenerator;
}());
var DefaultUIDGenerator = new UIDGenerator(currentSalt++);
var isSaltedBy = function (entityId, salt) {
    return entityId % MAX_SALTS === salt;
};
var nextSalt = function () {
    var salt = currentSalt;
    if (++currentSalt > MAX_SALTS - 1) {
        currentSalt = 1;
    }
    return salt;
};
var nextGenerator = function () {
    return new UIDGenerator(nextSalt());
};
export { UIDGenerator, DefaultUIDGenerator, isSaltedBy, nextGenerator, };
//# sourceMappingURL=UID.js.map