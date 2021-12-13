/* ----------------------------------
   DeviceDriverDisk.ts

   The Kernel Disk Device Driver.
   ---------------------------------- */

module TSOS {
    
    // Extends DeviceDriver
    export class DeviceDriverDisk extends DeviceDriver {

        public track: number = 0;
        public sector: number = 0;
        public block: number = 0;

        constructor() {
            // Override the base method pointers.
            super();
            this.driverEntry = this.krnDskDriverEntry;
            this.isr = this.krnDskMove;
        }

        private getDskKey() {
            return this.track.tostring() + ":" +
                this.sector.tostring() + ":" +
                this.block.tostring();
        }

        public krnDskDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
        }

        public krnDskMove(params) {
            if(params.length < 3) return;
            this.track = params[0];
            this.sector = params[1];
            this.block = params[2];
        }

        public krnDskRead() {
            return sessionStorage.getItem(
                this.getDskKey());
        }

        public krnDskWrite(block: string) {
            sessionStorage.setItem(
                this.getDskKey(), block);
        }
    }
}
