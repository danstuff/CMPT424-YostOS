/* ------------
     MemoryManager.ts

    MemoryManager handles OS-side reading and writing to memory.
     ------------ */

module TSOS {

    export class MemoryManager {

        constructor(){}

        public init() {
            // ensure memory accessor exists
            if(!_MemoryAccessor) {
                _Kernel.krnTrapError("Global _MemoryAccessor is undefined");
            }
        }

        public isValid(index: number) {
            if(index + _MemoryAccessor.curBase <=
               _MemoryAccessor.curLimit) {
                return true;
            } else {
                _StdOut.putLine("Index " + index + 
                                " out of range. Ignoring.");
                return false;
            }
        }

        public usePCBSegment(pcb: PCB) {
            _MemoryAccessor.useSegment(pcb.processBase, pcb.processLimit);
        }

        public useAllMemory() {
            _MemoryAccessor.useSegment(0, MEMORY_SIZE);
        }

        public setValue(index: number, value: number) {
            // ensure index is within memory bounds
            if(this.isValid(index)) {
                _MemoryAccessor.setValue(index, value);
            }
        }

        public getValue(index: number) {
            // ensure index is within memory bounds
            if(this.isValid(index)) {
                return _MemoryAccessor.getValue(index);
            }
        }

        public clearArray(clearValue: number = 0,
                            start: number = 0,
                            end: number =  MEMORY_SIZE-1) {

            // loop over the range, and set the memory values to clearValue
            for(var i = start; i <= end; i++) {
                this.setValue(i, clearValue);
            }
        }

        public setArray(start: number, data: Array<number>) {
            if(this.isValid(start) && this.isValid(start+data.length-1)) {
                _MemoryAccessor.setArray(start, data);
                return true;
            } else {
                return false;
            }
        }

        public getArray(start: number, end: number) {
            if(this.isValid(start) && this.isValid(end)) {
                return _MemoryAccessor.getArray(start, end);
            }
        }
    }
}
