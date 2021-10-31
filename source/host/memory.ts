/* ------------
     Memory.ts

    The memory object is where the actual data is stored.
     ------------ */

module TSOS {

    export const MEM_SEGMENT_SIZE = 256;
    export const MEM_SEGMENT_COUNT = 3; //grant ability to load 3 programs 

    export class Memory {

        public data: Array<number>;

        constructor(){
            this.data = new Array<number>(MEM_SEGMENT_SIZE*MEM_SEGMENT_COUNT);
        }

        public init() {
            //set all mem values to 0 (not always necessary)
            for(var i = 0; i < this.data.length; i++) {
                this.data[i] = 0;
            }
        }
    }
}
