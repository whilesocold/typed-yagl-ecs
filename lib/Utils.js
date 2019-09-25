export function fastBind(thisArg, methodFunc) {
    return function () {
        methodFunc.apply(thisArg, arguments);
    };
}
export function fastSplice(array, startIndex, removeCount) {
    var len = array.length;
    var removeLen = 0;
    if (startIndex >= len || removeCount === 0) {
        return;
    }
    removeCount = startIndex + removeCount > len ? (len - startIndex) : removeCount;
    removeLen = len - removeCount;
    for (var i = startIndex; i < len; i += 1) {
        array[i] = array[i + removeCount];
    }
    array.length = removeLen;
}
//# sourceMappingURL=Utils.js.map