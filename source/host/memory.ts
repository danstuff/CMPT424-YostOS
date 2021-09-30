/* ------------
     Memory.ts

    The memory object is where the actual data is stored.
     ------------ */

module TSOS {

    const MEMORY_SIZE = 1024;

    export class Memory {

        public data = Array<number>(MEMORY_SIZE);

        constructor(){
            
        }
    }
}
