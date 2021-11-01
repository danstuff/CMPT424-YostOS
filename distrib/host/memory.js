/* ------------
     Memory.ts

    The memory object is where the actual data is stored.
     ------------ */
var TSOS;
(function (TSOS) {
    TSOS.MEM_SEGMENT_SIZE = 256;
    TSOS.MEM_SEGMENT_COUNT = 3; //grant ability to load 3 programs 
    TSOS.MEMORY_SIZE = TSOS.MEM_SEGMENT_SIZE * TSOS.MEM_SEGMENT_COUNT;
    var Memory = /** @class */ (function () {
        function Memory() {
            this.data = new Array(TSOS.MEMORY_SIZE);
        }
        Memory.prototype.init = function () {
            //set all mem values to 0 (not always necessary)
            for (var i = 0; i < this.data.length; i++) {
                this.data[i] = 0;
            }
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
