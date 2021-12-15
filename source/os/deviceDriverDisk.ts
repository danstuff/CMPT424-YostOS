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

        public track_count: number = 0xFF;   // 256 tracks per disk
        public sector_count: number = 0xFF;  // 256 sectors per track
        public block_count: number = 0xFF;  // 256 blocks per sector

        constructor() {
            // Override the base method pointers.
            super();
            this.driverEntry = this.krnDskDriverEntry;
            this.isr = this.krnDskMove;
        }

        static locStrToNum(str: string) {
            return 
                str.charCodeAt(0) + 
                str.charCodeAt(1) * 0x100 +
                std.charCodeAt(2) * 0x10000;
        }

        static locNumToStr(num: number) {
            return
                String.fromCharCode( num & 0x0000FF) +
                String.fromCharCode((num & 0x00FF00) / 0x100) +
                String.fromCharCode((num & 0xFF0000) / 0x10000);
        }

        public getLoc(track: number, sector: number, block: number) {
            // compose a single location number from the track,
            // sector, and block.
            return (track & 0xFF) +
                   (sector & 0xFF) * 0x100 +
                   (block & 0xFF) * 0x10000;
        }

        public krnDskDriverEntry() {
            // Initialization routine for this, 
            // the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
        }

        public krnDskMove(loc) {
            if(params.length < 1) return;

            // parse track, sector, and block from a single
            // location number
            this.track  = +loc & 0xFF;
            this.sector = +loc & 0xFF00 / 0x100;
            this.block  = +loc & 0xFF0000 / 0x10000;
        }

        public krnDskRead() {
            return sessionStorage.getItem(this.getDskLoc());
        }

        public krnDskWrite(block) {
            sessionStorage.setItem(this.getDskLoc(), block);
        }
    }
}
