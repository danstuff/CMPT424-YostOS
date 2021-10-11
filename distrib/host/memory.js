/* ------------
     Memory.ts

    The memory object is where the actual data is stored.
     ------------ */
var TSOS;
(function (TSOS) {
    //could be anything. Project 2 says to use 256 bytes
    TSOS.MEMORY_SIZE = 256;
    var Memory = /** @class */ (function () {
        function Memory() {
            this.data = new Array(TSOS.MEMORY_SIZE);
        }
        Memory.prototype.init = function () {
            //set all mem values to 0 (not always necessary)
            for (var i = 0; i < TSOS.MEMORY_SIZE; i++) {
                this.data[i] = 0;
            }
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
