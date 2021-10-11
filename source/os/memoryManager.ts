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

        public isValid(index: number) {
            if(index >= 0 && index < MEMORY_SIZE) {
                return true;
            } else {
                //TODO make this error not destroy everything
                _Kernel.krnTrapError("Index " + index + " out of range");
                return false;
            }
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

        public clearSegment(clearValue: number = 0,
                            start: number = 0,
                            end: number =  MEMORY_SIZE-1) {

            // loop over the range, and set the memory values to clearValue
            for(var i = start; i <= end; i++) {
                this.setValue(i, clearValue);
            }
        }

        public setSegment(start: number, data: Array<number>) {
            if(this.isValid(start) && this.isValid(start+data.length)) {
                _MemoryAccessor.setSegment(start, data);
                return true;
            } else {
                return false;
            }
        }

        public getSegment(start: number, end: number) {
            if(this.isValid(start) && this.isValid(end)) {
                return _MemoryAccessor.getSegment(start, end);
            }
        }
    }
}
