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
        MemoryManager.prototype.isValid = function (index) {
            if (index >= 0 && index < TSOS.MEMORY_SIZE) {
                return true;
            }
            else {
                //TODO make this error not destroy everything
                _Kernel.krnTrapError("Index " + index + " out of range");
                return false;
            }
        };
        MemoryManager.prototype.setValue = function (index, value) {
            // ensure index is within memory bounds
            if (this.isValid(index)) {
                _MemoryAccessor.setValue(index, value);
            }
        };
        MemoryManager.prototype.getValue = function (index) {
            // ensure index is within memory bounds
            if (this.isValid(index)) {
                return _MemoryAccessor.getValue(index);
            }
        };
        MemoryManager.prototype.clearSegment = function (clearValue, start, end) {
            if (clearValue === void 0) { clearValue = 0; }
            if (start === void 0) { start = 0; }
            if (end === void 0) { end = TSOS.MEMORY_SIZE - 1; }
            // loop over the range, and set the memory values to clearValue
            for (var i = start; i <= end; i++) {
                this.setValue(i, clearValue);
            }
        };
        MemoryManager.prototype.setSegment = function (start, data) {
            if (this.isValid(start) && this.isValid(start + data.length)) {
                _MemoryAccessor.setSegment(start, data);
                return true;
            }
            else {
                return false;
            }
        };
        MemoryManager.prototype.getSegment = function (start, end) {
            if (this.isValid(start) && this.isValid(end)) {
                return _MemoryAccessor.getSegment(start, end);
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
