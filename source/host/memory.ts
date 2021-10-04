/* ------------
     Memory.ts

    The memory object is where the actual data is stored.
     ------------ */

module TSOS {

    export const MEMORY_SIZE = 1024;

    export class Memory {

        public data: Array<number>;

        constructor(){
            this.data = new Array<number>(MEMORY_SIZE);
        }

        public init() {
            for(var i = 0; i < MEMORY_SIZE; i++) {
                this.data[i] = 0;
            }
        }
    }
}
