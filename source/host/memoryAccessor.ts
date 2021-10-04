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
    }
}
