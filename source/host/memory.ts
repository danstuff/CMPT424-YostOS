/* ------------
     Memory.ts

    The memory object is where the actual data is stored.
     ------------ */

module TSOS {

    //could be anything. Project 2 says to use 256 bytes
    export const MEMORY_SIZE = 256;

    export class Memory {

        public data: Array<number>;

        constructor(){
            this.data = new Array<number>(MEMORY_SIZE);
        }

        public init() {
            //set all mem values to 0 (not always necessary)
            for(var i = 0; i < MEMORY_SIZE; i++) {
                this.data[i] = 0;
            }
        }
    }
}
