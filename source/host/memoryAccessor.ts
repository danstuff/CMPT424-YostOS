/* ------------
     MemoryAccessor.ts

    MemoryAccessor handles storage access via the CPU.
     ------------ */

module TSOS {

    export class MemoryAccessor {

        constructor(){
            //ensure memory exists
             if(!_Memory) {
                _Kernel.krnTrapError("Global _Memory is undefined");
            }
        }

        //single-value setter and getter
        public setValue(index: number, value: number) {
            _Memory.data[index] = value;
        }

        public getValue(index: number) {
            return _Memory.data[index];
        }

        //return a portion of memory as an array via slice()
        public getSegment(start: number, end: number) {
            return _Memory.data.slice(start, end);
        }

        //apply an array to a portion of memory
        public setSegment(start: number, data: Array<number>) {
            for(var i = 0; i < data.length; i++) {
                this.setValue(start+i, data[i]);
            }
        }
    }
}
