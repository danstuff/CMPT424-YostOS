/* ------------
     MemoryManager.ts

    MemoryManager handles OS-side reading and writing to memory.
     ------------ */

module TSOS {

    export class MemoryManager {

        constructor(){
            
        }

        public init() {
            // ensure memory accessor exists
            if(!_MemoryAccessor) {
                _Kernel.krnTrapError("Global _MemoryAccessor is undefined");
            }
        }

        public setValue(index: number, value: number) {
            // ensure index is within memory bounds
            if(index >= 0 && index < MEMORY_SIZE ) {
                _MemoryAccessor.setValue(index, value);

            } else {
                _Kernel.krnTrapError("Index " + index + " out of range");
            }
        }

        public clearSegment(clearValue: number = 0,
                            lo: number = 0,
                            hi: number =  MEMORY_SIZE) {

            // loop over the range, and set the memory values to clearValue
            for(var i = lo; i < hi; i++) {
                this.setValue(i, clearValue);
            }
        }

        public copyTo(start: number, data: Array<number>) {
            for(var i = 0; i < data.length; i++) {
                this.setValue(start+i, data[i]);
            }
        }
    }
}
