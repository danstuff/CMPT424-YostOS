/* ------------
     MemoryManager.ts

    MemoryManager handles OS-side reading and writing to memory.
     ------------ */
var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        MemoryManager.prototype.init = function () {
            // ensure memory accessor exists
            if (!_MemoryAccessor) {
                _Kernel.krnTrapError("Global _MemoryAccessor is undefined");
            }
        };
        MemoryManager.prototype.setValue = function (index, value) {
            // ensure index is within memory bounds
            if (index >= 0 && index < TSOS.MEMORY_SIZE) {
                _MemoryAccessor.setValue(index, value);
            }
            else {
                _Kernel.krnTrapError("Index " + index + " out of range");
            }
        };
        MemoryManager.prototype.clearSegment = function (clearValue, lo, hi) {
            if (clearValue === void 0) { clearValue = 0; }
            if (lo === void 0) { lo = 0; }
            if (hi === void 0) { hi = TSOS.MEMORY_SIZE; }
            // loop over the range, and set the memory values to clearValue
            for (var i = lo; i < hi; i++) {
                this.setValue(i, clearValue);
            }
        };
        MemoryManager.prototype.copyTo = function (start, data) {
            for (var i = 0; i < data.length; i++) {
                this.setValue(start + i, data[i]);
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
