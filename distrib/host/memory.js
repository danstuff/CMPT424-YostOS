/* ------------
     Memory.ts

    The memory object is where the actual data is stored.
     ------------ */
var TSOS;
(function (TSOS) {
    TSOS.MEMORY_SIZE = 1024;
    var Memory = /** @class */ (function () {
        function Memory() {
            this.data = new Array(TSOS.MEMORY_SIZE);
        }
        Memory.prototype.init = function () {
            for (var i = 0; i < TSOS.MEMORY_SIZE; i++) {
                this.data[i] = 0;
            }
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
