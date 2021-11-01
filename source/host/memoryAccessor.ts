/* ------------
     MemoryAccessor.ts

    MemoryAccessor handles storage access via the CPU.
     ------------ */

module TSOS {

    export class MemoryAccessor {

        public curBase: number = 0;
        public curLimit: number = 255;

        constructor(){
            //ensure memory exists
             if(!_Memory) {
                _Kernel.krnTrapError("Global _Memory is undefined");
            }
        }

        //ensure that any following access calls only occur within a certain memory range
        public useSegment(start: number, end: number) {
            this.curBase = start;
            this.curLimit = end;
        }

        public inSegment(index: number) {
            if(this.curBase+index > this.curLimit) {
                _Kernel.krnTrapError(
                    "Index " + index + 
                    " is out of the current segment bounds.");
            }
        }

        //single-value setter and getter
        public setValue(index: number, value: number) {
            this.inSegment(index);
            _Memory.data[index] = value;
        }

        public getValue(index: number) {
            this.inSegment(index);
            return _Memory.data[this.curBase+index];
        }

        //return a portion of memory as an array via slice()
        public getArray(start: number, end: number) {
            this.inSegment(start);
            this.inSegment(end);
            return _Memory.data.slice(this.curBase+start,
                                      this.curBase+end);
        }

        //apply an array to a portion of memory
        public setArray(start: number, data: Array<number>) {
            for(var i = 0; i < data.length; i++) {
                this.setValue(start+i, data[i]);
            }
        }
    }
}
