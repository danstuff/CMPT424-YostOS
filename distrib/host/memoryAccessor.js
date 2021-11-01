/* ------------
     MemoryAccessor.ts

    MemoryAccessor handles storage access via the CPU.
     ------------ */
var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
            this.curBase = 0;
            this.curLimit = 255;
            //ensure memory exists
            if (!_Memory) {
                _Kernel.krnTrapError("Global _Memory is undefined");
            }
        }
        //ensure that any following access calls only occur within a certain memory range
        MemoryAccessor.prototype.useSegment = function (start, end) {
            this.curBase = start;
            this.curLimit = end;
        };
        MemoryAccessor.prototype.inSegment = function (index) {
            if (this.curBase + index > this.curLimit) {
                _Kernel.krnTrapError("Index " + index +
                    " is out of the current segment bounds.");
            }
        };
        //single-value setter and getter
        MemoryAccessor.prototype.setValue = function (index, value) {
            this.inSegment(index);
            _Memory.data[index] = value;
        };
        MemoryAccessor.prototype.getValue = function (index) {
            this.inSegment(index);
            return _Memory.data[this.curBase + index];
        };
        //return a portion of memory as an array via slice()
        MemoryAccessor.prototype.getArray = function (start, end) {
            this.inSegment(start);
            this.inSegment(end);
            return _Memory.data.slice(this.curBase + start, this.curBase + end);
        };
        //apply an array to a portion of memory
        MemoryAccessor.prototype.setArray = function (start, data) {
            for (var i = 0; i < data.length; i++) {
                this.setValue(start + i, data[i]);
            }
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
