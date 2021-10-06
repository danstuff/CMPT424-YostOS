/* ------------
     MemoryAccessor.ts

    MemoryAccessor handles storage access via the CPU.
     ------------ */
var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
            if (!_Memory) {
                _Kernel.krnTrapError("Global _Memory is undefined");
            }
        }
        MemoryAccessor.prototype.setValue = function (index, value) {
            _Memory.data[index] = value;
        };
        MemoryAccessor.prototype.getValue = function (index) {
            return _Memory.data[index];
        };
        MemoryAccessor.prototype.getSegment = function (start, end) {
            return _Memory.data.slice(start, end);
        };
        MemoryAccessor.prototype.setSegment = function (start, data) {
            for (var i = 0; i < data.length; i++) {
                this.setValue(start + i, data[i]);
            }
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
