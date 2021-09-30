/* ------------
     Memory.ts

    The memory object is where the actual data is stored.
     ------------ */
var TSOS;
(function (TSOS) {
    var MEMORY_SIZE = 1024;
    var Memory = /** @class */ (function () {
        function Memory() {
            this.data = Array(MEMORY_SIZE);
        }
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
