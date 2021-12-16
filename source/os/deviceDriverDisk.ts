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

        public clearBlock: string = "";

        constructor() {
            // Override the base method pointers.
            super();
            this.driverEntry = this.krnDskDriverEntry;
            this.isr = this.krnDskMove;

            for(var i = 0; i < 64; i++) this.clearBlock += "\0";
        }

        static locStrToNum(str: string) : number {
            return 
                str.charCodeAt(0) + 
                str.charCodeAt(1) * 0x100 +
                str.charCodeAt(2) * 0x10000;
        }

        static locNumToStr(num: number) : string {
            return
                String.fromCharCode( num & 0x0000FF) +
                String.fromCharCode((num & 0x00FF00) / 0x100) +
                String.fromCharCode((num & 0xFF0000) / 0x10000);
        }

        public getLoc(track: number, sector: number, block: number) 
            : number {
            // compose a single location number from the track,
            // sector, and block.
            return (track  & 0xFF) +
                   (sector & 0xFF) * 0x100 +
                   (block  & 0xFF) * 0x10000;
        }

        public getDskLoc() { 
            return this.getLoc(this.track, this.sector, this.block);
        }

        public krnDskDriverEntry() {
            // Initialization routine for this, 
            // the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
        }

        public krnDskMove(loc) {
            // parse track, sector, and block from a single
            // location number
            this.track  = +loc & 0x0000FF;
            this.sector = +loc & 0x00FF00 / 0x100;
            this.block  = +loc & 0xFF0000 / 0x10000;
        }

        public krnDskRead() {
            return sessionStorage.getItem(this.getDskLoc().toString()) ||
                this.clearBlock;
        }

        public krnDskWrite(block) {
            sessionStorage.setItem(this.getDskLoc().toString(), block);
            Control.hostUpdateDiskTable();
        }

        public krnDskClear() {
            this.krnDskWrite(this.clearBlock);
        }
    }
}
