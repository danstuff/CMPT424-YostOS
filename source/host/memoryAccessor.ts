/* ------------
     MemoryAccessor.ts

    MemoryAccessor handles storage access via the CPU.
     ------------ */

module TSOS {

    export class MemoryAccessor {

        constructor(){
             if(!_Memory) {
                _Kernel.krnTrapError("Global _Memory is undefined");
            }
        }

        public setValue(index: number, value: number) {
            _Memory.data[index] = value;
        }

        public getValue(index: number) {
            return _Memory.data[index];
        }

        public getSegment(start: number, end: number) {
            return _Memory.data.slice(start, end);
        }

        public setSegment(start: number, data: Array<number>) {
            for(var i = 0; i < data.length; i++) {
                this.setValue(start+i, data[i]);
            }
        }
    }
}
