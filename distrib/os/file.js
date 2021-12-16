var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TSOS;
(function (TSOS) {
    var Block = /** @class */ (function () {
        function Block() {
            this.in_use = false;
            this.next_address = 0;
            this.address = 0;
        }
        Block.prototype.loadBlock = function (loc) {
            _krnDiskDriver.krnDskMove(loc);
            this.address = loc;
            this.data = _krnDiskDriver.krnDskRead();
            //first 4 bytes are dirty flag and next address
            this.in_use =
                (this.data.substr(0, 1) == "U") ? true : false;
            this.next_address =
                TSOS.DeviceDriverDisk.locStrToNum(this.data.substr(1, 3));
        };
        Block.prototype.saveBlock = function () {
            _krnDiskDriver.krnDskMove(this.address);
            this.data =
                ((this.in_use) ? "U" : "\0") +
                    TSOS.DeviceDriverDisk.locNumToStr(this.next_address) +
                    this.data.slice(3);
            _krnDiskDriver.krnDskWrite(this.data);
        };
        return Block;
    }());
    TSOS.Block = Block;
    var File = /** @class */ (function (_super) {
        __extends(File, _super);
        function File() {
            //FCBs are 64 bytes in length
            //in use - 1 byte
            //next block address - 3 bytes
            //name - 54 bytes/characters
            //file_location - 3 bytes
            //file_size - 3 bytes
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.file_location = 0;
            _this.file_size = 0; // in blocks
            return _this;
        }
        File.prototype.loadFCB = function (filename) {
            this.name = filename;
            //search the first sector for FCBs
            for (var loc = 0; loc < 256; loc++) {
                var b = new Block();
                b.loadBlock(loc);
                //center 50 bytes are name
                var name = b.data.substr(4, 54).trim();
                if (name === this.name) {
                    this.loadBlock(loc);
                    //final 6 bytes are location and size
                    this.file_location =
                        TSOS.DeviceDriverDisk.locStrToNum(this.data.substr(58, 3));
                    this.file_size =
                        TSOS.DeviceDriverDisk.locStrToNum(this.data.substr(61, 3));
                    return true;
                }
                else if (name === "") {
                    this.file_location = loc;
                    this.file_size = 0;
                    return false;
                }
            }
            return false;
        };
        File.prototype.saveFCB = function () {
            var space_count = 54 - this.name.length;
            if (space_count > 0) {
                this.name += Array(space_count).join("\0");
            }
            else if (space_count < 0) {
                this.name = this.name.substr(0, 54);
            }
            this.data = this.data.slice(0, 4) + this.name +
                TSOS.DeviceDriverDisk.locNumToStr(this.file_location) +
                TSOS.DeviceDriverDisk.locNumToStr(this.file_size);
            this.saveBlock();
        };
        return File;
    }(Block));
    TSOS.File = File;
})(TSOS || (TSOS = {}));
