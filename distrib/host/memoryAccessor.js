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
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
