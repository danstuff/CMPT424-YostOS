/* ------------
     MemoryAccessor.ts

    MemoryAccessor handles storage access via the CPU.
     ------------ */

module TSOS {

    export class MemoryAccessor {

        public curSegStart: number = 0;
        public curSegEnd: number = 255;

        constructor(){
            //ensure memory exists
             if(!_Memory) {
                _Kernel.krnTrapError("Global _Memory is undefined");
            }
        }

        //ensure that any following access calls only occur within a certain memory range
        public useSegment(start: number, end: number) {
            curSegStart = start;
            curSegEnd = end;
        }

        public inSegment(index: number) {
            return curSegStart <= index && curSegEnd >= index;
        }

        //single-value setter and getter
        public setValue(index: number, value: number) {
            if(!inSegment(index)) return false;

            _Memory.data[index] = value;
            return true;
        }

        public getValue(index: number) {
            if(!inSegment(index)) return null;

            return _Memory.data[index];
        }

        //return a portion of memory as an array via slice()
        public getSegment(start: number, end: number) {
            if(!inSegment(start) || !inSegment(end)) return null;

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
