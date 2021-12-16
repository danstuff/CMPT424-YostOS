
module TSOS {

    export class Block {
        public in_use: boolean = false;
        public next_address: number = 0;

        public data: string;

        public address: number = 0;

        public loadBlock(loc) {
            _krnDiskDriver.krnDskMove(loc);

            this.address = loc;

            this.data = _krnDiskDriver.krnDskRead();

            //first 4 bytes are dirty flag and next address
            this.in_use = 
                (this.data.substr(0, 1) == "U") ? true : false;
            this.next_address = 
                DeviceDriverDisk.locStrToNum(this.data.substr(1, 3));
            
        }

        public saveBlock() {
            _krnDiskDriver.krnDskMove(this.address);

            this.data = 
                ((this.in_use) ? "U" : "\0") +
                DeviceDriverDisk.locNumToStr(this.next_address) +
                this.data.slice(3);
            
            _krnDiskDriver.krnDskWrite(this.data);
        }

        public deleteBlock() {
            this.in_use = false;
            this.next_address = 0;
            this.data = _krnDiskDriver.clearBlock;

            this.saveBlock();
        }
    }

    export class File extends Block {
        //FCBs are 64 bytes in length
        //in use - 1 byte
        //next block address - 3 bytes
        //name - 54 bytes/characters
        //file_location - 3 bytes
        //file_size - 3 bytes

        public name: string;
        public file_location: number = 0;
        public file_size: number = 0; // in blocks

        public current_block: Block;

        constructor() {}

        loadFCB(filename: string) {
            this.name = filename;

            //search the first sector for FCBs
            for(var loc = 0; loc < 256; loc++) {
                var b = new Block();
                b.loadBlock(loc);

                //center 50 bytes are name
                var name = b.data.substr(4, 54).trim();

                if(name === this.name) {
                    this.loadBlock(loc);

                    //final 6 bytes are location and size
                    this.file_location = 
                        DeviceDriverDisk.locStrToNum(
                        this.data.substr(58, 3));
                    this.file_size = 
                        DeviceDriverDisk.locStrToNum(
                        this.data.substr(61, 3));

                    return true;
                }
            }

            for(var loc = 0; loc < 256; loc++) {
                var b = new Block();
                b.loadBlock(loc):

                if(!b.in_use) {
                    this.file_location = loc;
                    this.file_size = 0;
                    return false;
                }
            }

            return false;
        }

        saveFCB() {
            var space_count = 54 - this.name.length;            
        
            if(space_count > 0) {
                this.name += Array(space_count).join("\0");
            } else if(space_count < 0) {
                this.name = this.name.substr(0, 54);
            }

            this.data = this.data.slice(0, 4) + this.name +
                DeviceDriverDisk.locNumToStr(this.file_location) +
                DeviceDriverDisk.locNumToStr(this.file_size);

            this.saveBlock();
        }

        getNextBlock() {
            if(this.file_location == 0) return null;
            this.current_block.loadBlock(this.file_location);
            return b;
        }
    }
}
