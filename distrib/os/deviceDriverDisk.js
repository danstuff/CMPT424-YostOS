/* ----------------------------------
   DeviceDriverDisk.ts

   The Kernel Disk Device Driver.
   ---------------------------------- */
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
    // Extends DeviceDriver
    var DeviceDriverDisk = /** @class */ (function (_super) {
        __extends(DeviceDriverDisk, _super);
        function DeviceDriverDisk() {
            var _this = 
            // Override the base method pointers.
            _super.call(this) || this;
            _this.track = 0;
            _this.sector = 0;
            _this.block = 0;
            _this.track_count = 0xFF; // 256 tracks per disk
            _this.sector_count = 0xFF; // 256 sectors per track
            _this.block_count = 0xFF; // 256 blocks per sector
            _this.driverEntry = _this.krnDskDriverEntry;
            _this.isr = _this.krnDskMove;
            return _this;
        }
        DeviceDriverDisk.locStrToNum = function (str) {
            return;
            str.charCodeAt(0) +
                str.charCodeAt(1) * 0x100 +
                str.charCodeAt(2) * 0x10000;
        };
        DeviceDriverDisk.locNumToStr = function (num) {
            return;
            String.fromCharCode(num & 0x0000FF) +
                String.fromCharCode((num & 0x00FF00) / 0x100) +
                String.fromCharCode((num & 0xFF0000) / 0x10000);
        };
        DeviceDriverDisk.prototype.getLoc = function (track, sector, block) {
            // compose a single location number from the track,
            // sector, and block.
            return (track & 0xFF) +
                (sector & 0xFF) * 0x100 +
                (block & 0xFF) * 0x10000;
        };
        DeviceDriverDisk.prototype.getDskLoc = function () {
            return this.getLoc(this.track, this.sector, this.block);
        };
        DeviceDriverDisk.prototype.krnDskDriverEntry = function () {
            // Initialization routine for this, 
            // the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
        };
        DeviceDriverDisk.prototype.krnDskMove = function (loc) {
            // parse track, sector, and block from a single
            // location number
            this.track = +loc & 0x0000FF;
            this.sector = +loc & 0x00FF00 / 0x100;
            this.block = +loc & 0xFF0000 / 0x10000;
        };
        DeviceDriverDisk.prototype.krnDskRead = function () {
            return sessionStorage.getItem(this.getDskLoc().toString());
        };
        DeviceDriverDisk.prototype.krnDskWrite = function (block) {
            sessionStorage.setItem(this.getDskLoc().toString(), block);
        };
        return DeviceDriverDisk;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
