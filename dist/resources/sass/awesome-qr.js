"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @fileoverview
 * Awesome-qr.js
 *
 * @author Makito <sumimakito@hotmail.com>
 * @see <a href="https://www.keep.moe/" target="_blank">https://www.keep.moe/</a>
 * @see <a href="https://github.com/SumiMakito/Awesome-qr.js" target="_blank">https://github.com/SumiMakito/Awesome-qr.js</a>
 */
/**
 * @fileoverview
 * - Using the 'QRCode for Javascript library'
 * - Fixed dataset of 'QRCode for Javascript library' for support full-spec.
 * - this library has no dependencies.
 *
 * @author davidshimjs
 * @see <a href="http://www.d-project.com/" target="_blank">http://www.d-project.com/</a>
 * @see <a href="http://jeromeetienne.github.com/jquery-qrcode/" target="_blank">http://jeromeetienne.github.com/jquery-qrcode/</a>
 */
var AwesomeQRCode;

(function () {
    //---------------------------------------------------------------------
    // QRCode for JavaScript
    //
    // Copyright (c) 2009 Kazuhiko Arase
    //
    // URL: http://www.d-project.com/
    //
    // Licensed under the MIT license:
    //   http://www.opensource.org/licenses/mit-license.php
    //
    // The word "QR Code" is registered trademark of
    // DENSO WAVE INCORPORATED
    //   http://www.denso-wave.com/qrcode/faqpatent-e.html
    //
    //---------------------------------------------------------------------
    function QR8bitByte(data) {
        this.mode = QRMode.MODE_8BIT_BYTE;
        this.data = data;
        this.parsedData = [];
        for (var i = 0, l = this.data.length; i < l; i++) {
            var byteArray = [];
            var code = this.data.charCodeAt(i);
            if (code > 0x10000) {
                byteArray[0] = 0xF0 | (code & 0x1C0000) >>> 18;
                byteArray[1] = 0x80 | (code & 0x3F000) >>> 12;
                byteArray[2] = 0x80 | (code & 0xFC0) >>> 6;
                byteArray[3] = 0x80 | code & 0x3F;
            } else if (code > 0x800) {
                byteArray[0] = 0xE0 | (code & 0xF000) >>> 12;
                byteArray[1] = 0x80 | (code & 0xFC0) >>> 6;
                byteArray[2] = 0x80 | code & 0x3F;
            } else if (code > 0x80) {
                byteArray[0] = 0xC0 | (code & 0x7C0) >>> 6;
                byteArray[1] = 0x80 | code & 0x3F;
            } else {
                byteArray[0] = code;
            }
            this.parsedData.push(byteArray);
        }
        this.parsedData = Array.prototype.concat.apply([], this.parsedData);
        if (this.parsedData.length != this.data.length) {
            this.parsedData.unshift(191);
            this.parsedData.unshift(187);
            this.parsedData.unshift(239);
        }
    }

    QR8bitByte.prototype = {
        getLength: function getLength(buffer) {
            return this.parsedData.length;
        }, write: function write(buffer) {
            for (var i = 0, l = this.parsedData.length; i < l; i++) {
                buffer.put(this.parsedData[i], 8);
            }
        }
    };
    function QRCodeModel(typeNumber, errorCorrectLevel) {
        this.typeNumber = typeNumber;
        this.errorCorrectLevel = errorCorrectLevel;
        this.modules = null;
        this.moduleCount = 0;
        this.dataCache = null;
        this.dataList = [];
    }

    QRCodeModel.prototype = {
        addData: function addData(data) {
            var newData = new QR8bitByte(data);
            this.dataList.push(newData);
            this.dataCache = null;
        }, isDark: function isDark(row, col) {
            if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
                throw new Error(row + "," + col);
            }
            return this.modules[row][col];
        }, getModuleCount: function getModuleCount() {
            return this.moduleCount;
        }, make: function make() {
            this.makeImpl(!1, this.getBestMaskPattern());
        }, makeImpl: function makeImpl(test, maskPattern) {
            this.moduleCount = this.typeNumber * 4 + 17;
            this.modules = new Array(this.moduleCount);
            for (var row = 0; row < this.moduleCount; row++) {
                this.modules[row] = new Array(this.moduleCount);
                for (var col = 0; col < this.moduleCount; col++) {
                    this.modules[row][col] = null;
                }
            }
            this.setupPositionProbePattern(0, 0);
            this.setupPositionProbePattern(this.moduleCount - 7, 0);
            this.setupPositionProbePattern(0, this.moduleCount - 7);
            this.setupPositionAdjustPattern();
            this.setupTimingPattern();
            this.setupTypeInfo(test, maskPattern);
            if (this.typeNumber >= 7) {
                this.setupTypeNumber(test);
            }
            if (this.dataCache == null) {
                this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
            }
            this.mapData(this.dataCache, maskPattern);
        }, setupPositionProbePattern: function setupPositionProbePattern(row, col) {
            for (var r = -1; r <= 7; r++) {
                if (row + r <= -1 || this.moduleCount <= row + r) continue;
                for (var c = -1; c <= 7; c++) {
                    if (col + c <= -1 || this.moduleCount <= col + c) continue;
                    if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
                        this.modules[row + r][col + c] = !0;
                    } else {
                        this.modules[row + r][col + c] = !1;
                    }
                }
            }
        }, getBestMaskPattern: function getBestMaskPattern() {
            var minLostPoint = 0;
            var pattern = 0;
            for (var i = 0; i < 8; i++) {
                this.makeImpl(!0, i);
                var lostPoint = QRUtil.getLostPoint(this);
                if (i == 0 || minLostPoint > lostPoint) {
                    minLostPoint = lostPoint;
                    pattern = i;
                }
            }
            return pattern;
        }, createMovieClip: function createMovieClip(target_mc, instance_name, depth) {
            var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
            var cs = 1;
            this.make();
            for (var row = 0; row < this.modules.length; row++) {
                var y = row * cs;
                for (var col = 0; col < this.modules[row].length; col++) {
                    var x = col * cs;
                    var dark = this.modules[row][col];
                    if (dark) {
                        qr_mc.beginFill(0, 100);
                        qr_mc.moveTo(x, y);
                        qr_mc.lineTo(x + cs, y);
                        qr_mc.lineTo(x + cs, y + cs);
                        qr_mc.lineTo(x, y + cs);
                        qr_mc.endFill();
                    }
                }
            }
            return qr_mc;
        }, setupTimingPattern: function setupTimingPattern() {
            for (var r = 8; r < this.moduleCount - 8; r++) {
                if (this.modules[r][6] != null) {
                    continue;
                }
                this.modules[r][6] = r % 2 == 0;
            }
            for (var c = 8; c < this.moduleCount - 8; c++) {
                if (this.modules[6][c] != null) {
                    continue;
                }
                this.modules[6][c] = c % 2 == 0;
            }
        }, setupPositionAdjustPattern: function setupPositionAdjustPattern() {
            var pos = QRUtil.getPatternPosition(this.typeNumber);
            for (var i = 0; i < pos.length; i++) {
                for (var j = 0; j < pos.length; j++) {
                    var row = pos[i];
                    var col = pos[j];
                    if (this.modules[row][col] != null) {
                        continue;
                    }
                    for (var r = -2; r <= 2; r++) {
                        for (var c = -2; c <= 2; c++) {
                            if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
                                this.modules[row + r][col + c] = !0;
                            } else {
                                this.modules[row + r][col + c] = !1;
                            }
                        }
                    }
                }
            }
        }, setupTypeNumber: function setupTypeNumber(test) {
            var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
            for (var i = 0; i < 18; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
            }
            for (var i = 0; i < 18; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
            }
        }, setupTypeInfo: function setupTypeInfo(test, maskPattern) {
            var data = this.errorCorrectLevel << 3 | maskPattern;
            var bits = QRUtil.getBCHTypeInfo(data);
            for (var i = 0; i < 15; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                if (i < 6) {
                    this.modules[i][8] = mod;
                } else if (i < 8) {
                    this.modules[i + 1][8] = mod;
                } else {
                    this.modules[this.moduleCount - 15 + i][8] = mod;
                }
            }
            for (var i = 0; i < 15; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                if (i < 8) {
                    this.modules[8][this.moduleCount - i - 1] = mod;
                } else if (i < 9) {
                    this.modules[8][15 - i - 1 + 1] = mod;
                } else {
                    this.modules[8][15 - i - 1] = mod;
                }
            }
            this.modules[this.moduleCount - 8][8] = !test;
        }, mapData: function mapData(data, maskPattern) {
            var inc = -1;
            var row = this.moduleCount - 1;
            var bitIndex = 7;
            var byteIndex = 0;
            for (var col = this.moduleCount - 1; col > 0; col -= 2) {
                if (col == 6) col--;
                while (!0) {
                    for (var c = 0; c < 2; c++) {
                        if (this.modules[row][col - c] == null) {
                            var dark = !1;
                            if (byteIndex < data.length) {
                                dark = (data[byteIndex] >>> bitIndex & 1) == 1;
                            }
                            var mask = QRUtil.getMask(maskPattern, row, col - c);
                            if (mask) {
                                dark = !dark;
                            }
                            this.modules[row][col - c] = dark;
                            bitIndex--;
                            if (bitIndex == -1) {
                                byteIndex++;
                                bitIndex = 7;
                            }
                        }
                    }
                    row += inc;
                    if (row < 0 || this.moduleCount <= row) {
                        row -= inc;
                        inc = -inc;
                        break;
                    }
                }
            }
        }
    };
    QRCodeModel.PAD0 = 0xEC;
    QRCodeModel.PAD1 = 0x11;
    QRCodeModel.createData = function (typeNumber, errorCorrectLevel, dataList) {
        var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
        var buffer = new QRBitBuffer();
        for (var i = 0; i < dataList.length; i++) {
            var data = dataList[i];
            buffer.put(data.mode, 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
            data.write(buffer);
        }
        var totalDataCount = 0;
        for (var i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
        }
        if (buffer.getLengthInBits() > totalDataCount * 8) {
            throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")");
        }
        if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
            buffer.put(0, 4);
        }
        while (buffer.getLengthInBits() % 8 != 0) {
            buffer.putBit(!1);
        }
        while (!0) {
            if (buffer.getLengthInBits() >= totalDataCount * 8) {
                break;
            }
            buffer.put(QRCodeModel.PAD0, 8);
            if (buffer.getLengthInBits() >= totalDataCount * 8) {
                break;
            }
            buffer.put(QRCodeModel.PAD1, 8);
        }
        return QRCodeModel.createBytes(buffer, rsBlocks);
    };
    QRCodeModel.createBytes = function (buffer, rsBlocks) {
        var offset = 0;
        var maxDcCount = 0;
        var maxEcCount = 0;
        var dcdata = new Array(rsBlocks.length);
        var ecdata = new Array(rsBlocks.length);
        for (var r = 0; r < rsBlocks.length; r++) {
            var dcCount = rsBlocks[r].dataCount;
            var ecCount = rsBlocks[r].totalCount - dcCount;
            maxDcCount = Math.max(maxDcCount, dcCount);
            maxEcCount = Math.max(maxEcCount, ecCount);
            dcdata[r] = new Array(dcCount);
            for (var i = 0; i < dcdata[r].length; i++) {
                dcdata[r][i] = 0xff & buffer.buffer[i + offset];
            }
            offset += dcCount;
            var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
            var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
            var modPoly = rawPoly.mod(rsPoly);
            ecdata[r] = new Array(rsPoly.getLength() - 1);
            for (var i = 0; i < ecdata[r].length; i++) {
                var modIndex = i + modPoly.getLength() - ecdata[r].length;
                ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
            }
        }
        var totalCodeCount = 0;
        for (var i = 0; i < rsBlocks.length; i++) {
            totalCodeCount += rsBlocks[i].totalCount;
        }
        var data = new Array(totalCodeCount);
        var index = 0;
        for (var i = 0; i < maxDcCount; i++) {
            for (var r = 0; r < rsBlocks.length; r++) {
                if (i < dcdata[r].length) {
                    data[index++] = dcdata[r][i];
                }
            }
        }
        for (var i = 0; i < maxEcCount; i++) {
            for (var r = 0; r < rsBlocks.length; r++) {
                if (i < ecdata[r].length) {
                    data[index++] = ecdata[r][i];
                }
            }
        }
        return data;
    };
    var QRMode = { MODE_NUMBER: 1 << 0, MODE_ALPHA_NUM: 1 << 1, MODE_8BIT_BYTE: 1 << 2, MODE_KANJI: 1 << 3 };
    var QRErrorCorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };
    var QRMaskPattern = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
    };
    var QRUtil = {
        PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
        G15: 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0,
        G18: 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0,
        G15_MASK: 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1,
        getBCHTypeInfo: function getBCHTypeInfo(data) {
            var d = data << 10;
            while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
                d ^= QRUtil.G15 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15);
            }
            return (data << 10 | d) ^ QRUtil.G15_MASK;
        },
        getBCHTypeNumber: function getBCHTypeNumber(data) {
            var d = data << 12;
            while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
                d ^= QRUtil.G18 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18);
            }
            return data << 12 | d;
        },
        getBCHDigit: function getBCHDigit(data) {
            var digit = 0;
            while (data != 0) {
                digit++;
                data >>>= 1;
            }
            return digit;
        },
        getPatternPosition: function getPatternPosition(typeNumber) {
            return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
        },
        getMask: function getMask(maskPattern, i, j) {
            switch (maskPattern) {
                case QRMaskPattern.PATTERN000:
                    return (i + j) % 2 == 0;
                case QRMaskPattern.PATTERN001:
                    return i % 2 == 0;
                case QRMaskPattern.PATTERN010:
                    return j % 3 == 0;
                case QRMaskPattern.PATTERN011:
                    return (i + j) % 3 == 0;
                case QRMaskPattern.PATTERN100:
                    return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
                case QRMaskPattern.PATTERN101:
                    return i * j % 2 + i * j % 3 == 0;
                case QRMaskPattern.PATTERN110:
                    return (i * j % 2 + i * j % 3) % 2 == 0;
                case QRMaskPattern.PATTERN111:
                    return (i * j % 3 + (i + j) % 2) % 2 == 0;
                default:
                    throw new Error("bad maskPattern:" + maskPattern);
            }
        },
        getErrorCorrectPolynomial: function getErrorCorrectPolynomial(errorCorrectLength) {
            var a = new QRPolynomial([1], 0);
            for (var i = 0; i < errorCorrectLength; i++) {
                a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
            }
            return a;
        },
        getLengthInBits: function getLengthInBits(mode, type) {
            if (1 <= type && type < 10) {
                switch (mode) {
                    case QRMode.MODE_NUMBER:
                        return 10;
                    case QRMode.MODE_ALPHA_NUM:
                        return 9;
                    case QRMode.MODE_8BIT_BYTE:
                        return 8;
                    case QRMode.MODE_KANJI:
                        return 8;
                    default:
                        throw new Error("mode:" + mode);
                }
            } else if (type < 27) {
                switch (mode) {
                    case QRMode.MODE_NUMBER:
                        return 12;
                    case QRMode.MODE_ALPHA_NUM:
                        return 11;
                    case QRMode.MODE_8BIT_BYTE:
                        return 16;
                    case QRMode.MODE_KANJI:
                        return 10;
                    default:
                        throw new Error("mode:" + mode);
                }
            } else if (type < 41) {
                switch (mode) {
                    case QRMode.MODE_NUMBER:
                        return 14;
                    case QRMode.MODE_ALPHA_NUM:
                        return 13;
                    case QRMode.MODE_8BIT_BYTE:
                        return 16;
                    case QRMode.MODE_KANJI:
                        return 12;
                    default:
                        throw new Error("mode:" + mode);
                }
            } else {
                throw new Error("type:" + type);
            }
        },
        getLostPoint: function getLostPoint(qrCode) {
            var moduleCount = qrCode.getModuleCount();
            var lostPoint = 0;
            for (var row = 0; row < moduleCount; row++) {
                for (var col = 0; col < moduleCount; col++) {
                    var sameCount = 0;
                    var dark = qrCode.isDark(row, col);
                    for (var r = -1; r <= 1; r++) {
                        if (row + r < 0 || moduleCount <= row + r) {
                            continue;
                        }
                        for (var c = -1; c <= 1; c++) {
                            if (col + c < 0 || moduleCount <= col + c) {
                                continue;
                            }
                            if (r == 0 && c == 0) {
                                continue;
                            }
                            if (dark == qrCode.isDark(row + r, col + c)) {
                                sameCount++;
                            }
                        }
                    }
                    if (sameCount > 5) {
                        lostPoint += 3 + sameCount - 5;
                    }
                }
            }
            for (var row = 0; row < moduleCount - 1; row++) {
                for (var col = 0; col < moduleCount - 1; col++) {
                    var count = 0;
                    if (qrCode.isDark(row, col)) count++;
                    if (qrCode.isDark(row + 1, col)) count++;
                    if (qrCode.isDark(row, col + 1)) count++;
                    if (qrCode.isDark(row + 1, col + 1)) count++;
                    if (count == 0 || count == 4) {
                        lostPoint += 3;
                    }
                }
            }
            for (var row = 0; row < moduleCount; row++) {
                for (var col = 0; col < moduleCount - 6; col++) {
                    if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
                        lostPoint += 40;
                    }
                }
            }
            for (var col = 0; col < moduleCount; col++) {
                for (var row = 0; row < moduleCount - 6; row++) {
                    if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
                        lostPoint += 40;
                    }
                }
            }
            var darkCount = 0;
            for (var col = 0; col < moduleCount; col++) {
                for (var row = 0; row < moduleCount; row++) {
                    if (qrCode.isDark(row, col)) {
                        darkCount++;
                    }
                }
            }
            var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
            lostPoint += ratio * 10;
            return lostPoint;
        }
    };
    var QRMath = {
        glog: function glog(n) {
            if (n < 1) {
                throw new Error("glog(" + n + ")");
            }
            return QRMath.LOG_TABLE[n];
        }, gexp: function gexp(n) {
            while (n < 0) {
                n += 255;
            }
            while (n >= 256) {
                n -= 255;
            }
            return QRMath.EXP_TABLE[n];
        }, EXP_TABLE: new Array(256), LOG_TABLE: new Array(256)
    };
    for (var i = 0; i < 8; i++) {
        QRMath.EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i++) {
        QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i++) {
        QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
    }
    function QRPolynomial(num, shift) {
        if (num.length == undefined) {
            throw new Error(num.length + "/" + shift);
        }
        var offset = 0;
        while (offset < num.length && num[offset] == 0) {
            offset++;
        }
        this.num = new Array(num.length - offset + shift);
        for (var i = 0; i < num.length - offset; i++) {
            this.num[i] = num[i + offset];
        }
    }

    QRPolynomial.prototype = {
        get: function get(index) {
            return this.num[index];
        }, getLength: function getLength() {
            return this.num.length;
        }, multiply: function multiply(e) {
            var num = new Array(this.getLength() + e.getLength() - 1);
            for (var i = 0; i < this.getLength(); i++) {
                for (var j = 0; j < e.getLength(); j++) {
                    num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
                }
            }
            return new QRPolynomial(num, 0);
        }, mod: function mod(e) {
            if (this.getLength() - e.getLength() < 0) {
                return this;
            }
            var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
            var num = new Array(this.getLength());
            for (var i = 0; i < this.getLength(); i++) {
                num[i] = this.get(i);
            }
            for (var i = 0; i < e.getLength(); i++) {
                num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
            }
            return new QRPolynomial(num, 0).mod(e);
        }
    };
    function QRRSBlock(totalCount, dataCount) {
        this.totalCount = totalCount;
        this.dataCount = dataCount;
    }

    QRRSBlock.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];
    QRRSBlock.getRSBlocks = function (typeNumber, errorCorrectLevel) {
        var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
        if (rsBlock == undefined) {
            throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
        }
        var length = rsBlock.length / 3;
        var list = [];
        for (var i = 0; i < length; i++) {
            var count = rsBlock[i * 3 + 0];
            var totalCount = rsBlock[i * 3 + 1];
            var dataCount = rsBlock[i * 3 + 2];
            for (var j = 0; j < count; j++) {
                list.push(new QRRSBlock(totalCount, dataCount));
            }
        }
        return list;
    };
    QRRSBlock.getRsBlockTable = function (typeNumber, errorCorrectLevel) {
        switch (errorCorrectLevel) {
            case QRErrorCorrectLevel.L:
                return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
            case QRErrorCorrectLevel.M:
                return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
            case QRErrorCorrectLevel.Q:
                return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
            case QRErrorCorrectLevel.H:
                return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
            default:
                return undefined;
        }
    };
    function QRBitBuffer() {
        this.buffer = [];
        this.length = 0;
    }

    QRBitBuffer.prototype = {
        get: function get(index) {
            var bufIndex = Math.floor(index / 8);
            return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
        }, put: function put(num, length) {
            for (var i = 0; i < length; i++) {
                this.putBit((num >>> length - i - 1 & 1) == 1);
            }
        }, getLengthInBits: function getLengthInBits() {
            return this.length;
        }, putBit: function putBit(bit) {
            var bufIndex = Math.floor(this.length / 8);
            if (this.buffer.length <= bufIndex) {
                this.buffer.push(0);
            }
            if (bit) {
                this.buffer[bufIndex] |= 0x80 >>> this.length % 8;
            }
            this.length++;
        }
    };
    var QRCodeLimitLength = [[17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34], [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84], [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155], [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250], [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382], [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511], [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658], [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842], [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051], [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]];

    function _isSupportCanvas() {
        return typeof CanvasRenderingContext2D != "undefined";
    }

    function _getAndroid() {
        var android = false;
        var sAgent = navigator.userAgent;

        if (/android/i.test(sAgent)) {
            // android
            android = true;
            var aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);

            if (aMat && aMat[1]) {
                android = parseFloat(aMat[1]);
            }
        }

        return android;
    }

    var Drawing = !_isSupportCanvas() ? function () {
        var Drawing = function Drawing(htOption) {
            this._htOption = htOption;
        };

        Drawing.prototype.draw = function (oQRCode) {
            var _htOption = this._htOption;
            var nCount = oQRCode.getModuleCount();
            var nWidth = Math.floor(_htOption.size / nCount);
            var nHeight = Math.floor(_htOption.size / nCount);
            var aHTML = ['<table style="border:0;border-collapse:collapse;">'];

            for (var row = 0; row < nCount; row++) {
                aHTML.push('<tr>');

                for (var col = 0; col < nCount; col++) {
                    aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + 'px;height:' + nHeight + 'px;background-color:' + (oQRCode.isDark(row, col) ? _htOption.colorDark : _htOption.colorLight) + ';"></td>');
                }

                aHTML.push('</tr>');
            }

            aHTML.push('</table>');

            var nLeftMarginTable = (_htOption.size - elTable.offsetWidth) / 2;
            var nTopMarginTable = (_htOption.size - elTable.offsetHeight) / 2;

            if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
                elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px";
            }
        };

        Drawing.prototype.clear = function () {};

        return Drawing;
    }() : function () {
        // Drawing in Canvas
        function _onMakeImage() {
            this._elImage.src = this._elCanvas.toDataURL("image/png");
            this._elImage.style.display = "block";
            this._elCanvas.style.display = "none";
        }

        if (this._android && this._android <= 2.1) {
            var factor = 1 / window.devicePixelRatio;
            var drawImage = CanvasRenderingContext2D.prototype.drawImage;
            CanvasRenderingContext2D.prototype.drawImage = function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
                if ("nodeName" in image && /img/i.test(image.nodeName)) {
                    for (var i = arguments.length - 1; i >= 1; i--) {
                        arguments[i] = arguments[i] * factor;
                    }
                } else if (typeof dw == "undefined") {
                    arguments[1] *= factor;
                    arguments[2] *= factor;
                    arguments[3] *= factor;
                    arguments[4] *= factor;
                }

                drawImage.apply(this, arguments);
            };
        }

        function _safeSetDataURI(fSuccess, fFail) {
            var self = this;
            self._fFail = fFail;
            self._fSuccess = fSuccess;

            // Check it just once
            if (self._bSupportDataURI === null) {
                var el = document.createElement("img");
                var fOnError = function fOnError() {
                    self._bSupportDataURI = false;

                    if (self._fFail) {
                        self._fFail.call(self);
                    }
                };
                var fOnSuccess = function fOnSuccess() {
                    self._bSupportDataURI = true;

                    if (self._fSuccess) {
                        self._fSuccess.call(self);
                    }
                };

                el.onabort = fOnError;
                el.onerror = fOnError;
                el.onload = fOnSuccess;
                el.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="; // the Image contains 1px data.
                return;
            } else if (self._bSupportDataURI === true && self._fSuccess) {
                self._fSuccess.call(self);
            } else if (self._bSupportDataURI === false && self._fFail) {
                self._fFail.call(self);
            }
        };

        var Drawing = function Drawing(htOption) {
            this._bIsPainted = false;
            this._android = _getAndroid();

            this._htOption = htOption;
            this._elCanvas = document.createElement("canvas");
            this._elCanvas.width = htOption.size;
            this._elCanvas.height = htOption.size;
            this._oContext = this._elCanvas.getContext("2d");
            this._bIsPainted = false;
            this._elImage = document.createElement("img");
            this._elImage.alt = "Scan me!";
            this._elImage.style.display = "none";
            this._bSupportDataURI = null;
            this._callback = htOption.callback;
            this._bindElement = htOption.bindElement;
        };

        Drawing.prototype.draw = function (oQRCode) {
            var _elImage = this._elImage;
            var _tCanvas = document.createElement("canvas");
            var _oContext = _tCanvas.getContext("2d");
            // var _oContext = this._oContext;
            var _htOption = this._htOption;

            var nCount = oQRCode.getModuleCount();
            var rawSize = _htOption.size;
            var rawMargin = _htOption.margin;

            if (rawMargin < 0 || rawMargin * 2 >= rawSize) {
                rawMargin = 0;
            }

            var margin = Math.ceil(rawMargin);

            var rawViewportSize = rawSize - 2 * rawMargin;

            var whiteMargin = _htOption.whiteMargin;
            var backgroundDimming = _htOption.backgroundDimming;
            var rawWidth = rawViewportSize / nCount;
            var rawHeight = rawWidth;
            var nWidth = Math.ceil(rawWidth);
            var nHeight = nWidth;
            var viewportSize = nWidth * nCount;
            var size = viewportSize + 2 * margin;

            _tCanvas.width = size;
            _tCanvas.height = size;

            // We've banned these naughty log outputs
            // console.log("rawSize=" + rawSize + ", drawSize=" + size);
            // console.log("rawViewportSize=" + rawViewportSize + ", drawViewportSize=" + viewportSize);
            // console.log("rawWidth=rawHeight=" + rawWidth + ", drawWidth=drawHeight=" + nWidth);

            var dotScale = _htOption.dotScale;
            _elImage.style.display = "none";
            this.clear();

            if (dotScale <= 0 || dotScale > 1) {
                dotScale = 0.35;
            }

            _oContext.save();
            _oContext.translate(margin, margin);

            _oContext.rect(whiteMargin ? 0 : -margin, whiteMargin ? 0 : -margin, size, size);
            _oContext.fillStyle = "#ffffff";
            _oContext.fill();

            if (_htOption.backgroundImage !== undefined) {
                if (_htOption.autoColor) {
                    var avgRGB = getAverageRGB(_htOption.backgroundImage);
                    _htOption.colorDark = "rgb(" + avgRGB.r + ", " + avgRGB.g + ", " + avgRGB.b + ")";
                }
                _oContext.drawImage(_htOption.backgroundImage, 0, 0, _htOption.backgroundImage.width, _htOption.backgroundImage.height, whiteMargin ? 0 : -margin, whiteMargin ? 0 : -margin, whiteMargin ? viewportSize : size, whiteMargin ? viewportSize : size);
                _oContext.rect(whiteMargin ? 0 : -margin, whiteMargin ? 0 : -margin, size, size);
                _oContext.fillStyle = backgroundDimming;
                _oContext.fill();
            } else {
                _oContext.rect(0, 0, size, size);
                _oContext.fillStyle = "#ffffff";
                _oContext.fill();
            }

            if (_htOption.binarize) {
                _htOption.colorDark = "#000000";
                _htOption.colorLight = "#FFFFFF";
            }

            var agnPatternCenter = QRUtil.getPatternPosition(oQRCode.typeNumber);

            _oContext.fillStyle = "rgba(255, 255, 255, 0.6)";
            _oContext.fillRect(0, 0, 8 * nWidth, 8 * nHeight);
            _oContext.fillRect(0, (nCount - 8) * nHeight, 8 * nWidth, 8 * nHeight);
            _oContext.fillRect((nCount - 8) * nWidth, 0, 8 * nWidth, 8 * nHeight);
            _oContext.fillRect(8 * nWidth, 6 * nHeight, (nCount - 8 - 8) * nWidth, nHeight);
            _oContext.fillRect(6 * nWidth, 8 * nHeight, nWidth, (nCount - 8 - 8) * nHeight);

            var edgeCenter = agnPatternCenter[agnPatternCenter.length - 1];
            for (var i = 0; i < agnPatternCenter.length; i++) {
                for (var j = 0; j < agnPatternCenter.length; j++) {
                    var agnX = agnPatternCenter[j];
                    var agnY = agnPatternCenter[i];
                    if (agnX !== 6 && agnX !== edgeCenter && agnY !== 6 && agnY !== edgeCenter) continue;
                    if (agnX === 6 && (agnY === 6 || agnY === edgeCenter)) continue;
                    if (agnY === 6 && (agnX === 6 || agnX === edgeCenter)) continue;
                    drawAgnProtector(_oContext, agnX, agnY, nWidth, nHeight);
                    // console.log("agnX=" + agnX + ", agnY=" + agnX);
                }
            }

            _oContext.fillStyle = _htOption.colorDark;

            _oContext.fillRect(0, 0, 7 * nWidth, nHeight);
            _oContext.fillRect((nCount - 7) * nWidth, 0, 7 * nWidth, nHeight);
            _oContext.fillRect(0, 6 * nHeight, 7 * nWidth, nHeight);
            _oContext.fillRect((nCount - 7) * nWidth, 6 * nHeight, 7 * nWidth, nHeight);
            _oContext.fillRect(0, (nCount - 7) * nHeight, 7 * nWidth, nHeight);
            _oContext.fillRect(0, (nCount - 7 + 6) * nHeight, 7 * nWidth, nHeight);
            _oContext.fillRect(0, 0, nWidth, 7 * nHeight);
            _oContext.fillRect(6 * nWidth, 0, nWidth, 7 * nHeight);
            _oContext.fillRect((nCount - 7) * nWidth, 0, nWidth, 7 * nHeight);
            _oContext.fillRect((nCount - 7 + 6) * nWidth, 0, nWidth, 7 * nHeight);
            _oContext.fillRect(0, (nCount - 7) * nHeight, nWidth, 7 * nHeight);
            _oContext.fillRect(6 * nWidth, (nCount - 7) * nHeight, nWidth, 7 * nHeight);

            for (var i = 0; i < agnPatternCenter.length; i++) {
                for (var j = 0; j < agnPatternCenter.length; j++) {
                    var agnX = agnPatternCenter[j];
                    var agnY = agnPatternCenter[i];
                    if (agnX !== 6 && agnX !== edgeCenter && agnY !== 6 && agnY !== edgeCenter) continue;
                    if (agnX === 6 && (agnY === 6 || agnY === edgeCenter)) continue;
                    if (agnY === 6 && (agnX === 6 || agnX === edgeCenter)) continue;
                    drawAgn(_oContext, agnX, agnY, nWidth, nHeight);
                }
            }

            _oContext.fillRect(2 * nWidth, 2 * nHeight, 3 * nWidth, 3 * nHeight);
            _oContext.fillRect((nCount - 7 + 2) * nWidth, 2 * nHeight, 3 * nWidth, 3 * nHeight);
            _oContext.fillRect(2 * nWidth, (nCount - 7 + 2) * nHeight, 3 * nWidth, 3 * nHeight);

            for (var i = 0; i < nCount - 8; i += 2) {
                _oContext.fillRect((8 + i) * nWidth, 6 * nHeight, nWidth, nHeight);
                _oContext.fillRect(6 * nWidth, (8 + i) * nHeight, nWidth, nHeight);
            }

            var xyOffset = (1 - dotScale) * 0.5;
            for (var row = 0; row < nCount; row++) {
                for (var col = 0; col < nCount; col++) {
                    var bIsDark = oQRCode.isDark(row, col);

                    // var isBlkPosCtr = ((col < 8 && (row < 8 || row >= nCount - 8)) || (col >= nCount - 8 && row < 8) || (col < nCount - 4 && col >= nCount - 4 - 5 && row < nCount - 4 && row >= nCount - 4 - 5));
                    var isBlkPosCtr = col < 8 && (row < 8 || row >= nCount - 8) || col >= nCount - 8 && row < 8;
                    var isBlkPos = col < 7 && (row < 7 || row >= nCount - 7) || col >= nCount - 7 && row < 7;
                    var bProtected = row === 6 || col === 6 || isBlkPosCtr;

                    for (var i = 0; i < agnPatternCenter.length - 1; i++) {
                        bProtected = bProtected || row >= agnPatternCenter[i] - 2 && row <= agnPatternCenter[i] + 2 && col >= agnPatternCenter[i] - 2 && col <= agnPatternCenter[i] + 2;
                    }

                    var nLeft = col * nWidth + (bProtected ? 0 : xyOffset * nWidth);
                    var nTop = row * nHeight + (bProtected ? 0 : xyOffset * nHeight);
                    _oContext.strokeStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
                    _oContext.lineWidth = 0.5;
                    _oContext.fillStyle = bIsDark ? _htOption.colorDark : "rgba(255, 255, 255, 0.6)"; //_htOption.colorLight;
                    if (agnPatternCenter.length === 0) {
                        // if align pattern list is empty, then it means that we don't need to leave room for the align patterns
                        if (!bProtected) _oContext.fillRect(nLeft, nTop, (bProtected ? isBlkPosCtr ? 1 : 1 : dotScale) * nWidth, (bProtected ? isBlkPosCtr ? 1 : 1 : dotScale) * nHeight);
                    } else {
                        var inAgnRange = col < nCount - 4 && col >= nCount - 4 - 5 && row < nCount - 4 && row >= nCount - 4 - 5;
                        if (!bProtected && !inAgnRange) _oContext.fillRect(nLeft, nTop, (bProtected ? isBlkPosCtr ? 1 : 1 : dotScale) * nWidth, (bProtected ? isBlkPosCtr ? 1 : 1 : dotScale) * nHeight);
                    }
                }
            }

            if (whiteMargin) {
                _oContext.fillStyle = '#FFFFFF';
                _oContext.fillRect(-margin, -margin, size, margin);
                _oContext.fillRect(-margin, viewportSize, size, margin);
                _oContext.fillRect(viewportSize, -margin, margin, size);
                _oContext.fillRect(-margin, -margin, margin, size);
            }

            if (_htOption.logoImage !== undefined) {
                var logoScale = _htOption.logoScale;
                var logoMargin = _htOption.logoMargin;
                var logoCornerRadius = _htOption.logoCornerRadius;
                if (logoScale <= 0 || logoScale >= 1.0) {
                    logoScale = 0.2;
                }
                if (logoMargin < 0) {
                    logoMargin = 0;
                }
                if (logoCornerRadius < 0) {
                    logoCornerRadius = 0;
                }

                _oContext.restore();

                var logoSize = viewportSize * logoScale;
                var x = 0.5 * (size - logoSize);
                var y = x;

                _oContext.fillStyle = '#FFFFFF';
                _oContext.save();
                prepareRoundedCornerClip(_oContext, x - logoMargin, y - logoMargin, logoSize + 2 * logoMargin, logoSize + 2 * logoMargin, logoCornerRadius);
                _oContext.clip();
                _oContext.fill();
                _oContext.restore();

                _oContext.save();
                prepareRoundedCornerClip(_oContext, x, y, logoSize, logoSize, logoCornerRadius);
                _oContext.clip();
                _oContext.drawImage(_htOption.logoImage, x, y, logoSize, logoSize);
                _oContext.restore();
            }

            if (_htOption.binarize) {
                var pixels = _oContext.getImageData(0, 0, size, size);
                var threshold = 128;
                if (parseInt(_htOption.binarizeThreshold) > 0 && parseInt(_htOption.binarizeThreshold) < 255) {
                    threshold = parseInt(_htOption.binarizeThreshold);
                }
                for (var i = 0; i < pixels.data.length; i += 4) {
                    var R = pixels.data[i]; //R(0-255)
                    var G = pixels.data[i + 1]; //G(0-255)
                    var B = pixels.data[i + 2]; //G(0-255)
                    var sum = rgb2gray(R, G, B);
                    if (sum > threshold) {
                        pixels.data[i] = 255;
                        pixels.data[i + 1] = 255;
                        pixels.data[i + 2] = 255;
                    } else {
                        pixels.data[i] = 0;
                        pixels.data[i + 1] = 0;
                        pixels.data[i + 2] = 0;
                    }
                }
                _oContext.putImageData(pixels, 0, 0);
            }

            var _fCanvas = document.createElement("canvas");
            var _fContext = _fCanvas.getContext("2d");
            _fCanvas.width = rawSize;
            _fCanvas.height = rawSize;
            _fContext.drawImage(_tCanvas, 0, 0, rawSize, rawSize);
            this._elCanvas = _fCanvas;

            this._bIsPainted = true;
            if (this._callback !== undefined) {
                this._callback(this._elCanvas.toDataURL());
            }
            if (this._bindElement !== undefined) {
                try {
                    var el = document.getElementById(this._bindElement);
                    if (el.nodeName === 'IMG') {
                        el.src = this._elCanvas.toDataURL();
                    } else {
                        var elStyle = el.style;
                        elStyle["background-image"] = 'url(' + this._elCanvas.toDataURL() + ')';
                        elStyle["background-size"] = 'contain';
                        elStyle["background-repeat"] = 'no-repeat';
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        };

        Drawing.prototype.makeImage = function () {
            if (this._bIsPainted) {
                _safeSetDataURI.call(this, _onMakeImage);
            }
        };

        Drawing.prototype.isPainted = function () {
            return this._bIsPainted;
        };

        Drawing.prototype.clear = function () {
            this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height);
            this._bIsPainted = false;
        };

        Drawing.prototype.round = function (nNumber) {
            if (!nNumber) {
                return nNumber;
            }

            return Math.floor(nNumber * 1000) / 1000;
        };

        return Drawing;
    }();

    function prepareRoundedCornerClip(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    function rgb2gray(r, g, b) {
        return 0.30 * r + 0.59 * b + 0.11 * b;
    }

    function drawAgnProtector(context, centerX, centerY, nWidth, nHeight) {
        context.fillRect((centerX - 2 + 0.5) * nWidth, (centerY - 2 + 0.5) * nHeight, 4 * nWidth, 4 * nHeight);
    }

    function drawAgn(context, centerX, centerY, nWidth, nHeight) {
        context.fillRect((centerX - 2) * nWidth, (centerY - 2) * nHeight, nWidth, 5 * nHeight);
        context.fillRect((centerX + 2) * nWidth, (centerY - 2) * nHeight, nWidth, 5 * nHeight);
        context.fillRect((centerX - 2) * nWidth, (centerY - 2) * nHeight, 5 * nWidth, nHeight);
        context.fillRect((centerX - 2) * nWidth, (centerY + 2) * nHeight, 5 * nWidth, nHeight);
        context.fillRect(centerX * nWidth, centerY * nHeight, nWidth, nHeight);
    }

    function _getTypeNumber(sText, nCorrectLevel) {
        var nType = 1;
        var length = _getUTF8Length(sText);

        for (var i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
            var nLimit = 0;

            switch (nCorrectLevel) {
                case QRErrorCorrectLevel.L:
                    nLimit = QRCodeLimitLength[i][0];
                    break;
                case QRErrorCorrectLevel.M:
                    nLimit = QRCodeLimitLength[i][1];
                    break;
                case QRErrorCorrectLevel.Q:
                    nLimit = QRCodeLimitLength[i][2];
                    break;
                case QRErrorCorrectLevel.H:
                    nLimit = QRCodeLimitLength[i][3];
                    break;
            }

            if (length <= nLimit) {
                break;
            } else {
                nType++;
            }
        }

        if (nType > QRCodeLimitLength.length) {
            throw new Error("Too long data");
        }

        return nType;
    }

    function _getUTF8Length(sText) {
        var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
        return replacedText.length + (replacedText.length != sText ? 3 : 0);
    }

    AwesomeQRCode = function AwesomeQRCode() {};

    AwesomeQRCode.prototype.create = function (vOption) {
        this._htOption = {
            size: 800,
            margin: 20,
            typeNumber: 4,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRErrorCorrectLevel.H,
            backgroundImage: undefined,
            backgroundDimming: 'rgba(0,0,0,0)',
            logoImage: undefined,
            logoScale: 0.2,
            logoMargin: 6,
            logoCornerRadius: 8,
            whiteMargin: true,
            dotScale: 0.35,
            autoColor: true,
            binarize: false,
            binarizeThreshold: 128,
            callback: undefined,
            bindElement: undefined
        };

        if (typeof vOption === 'string') {
            vOption = {
                text: vOption
            };
        }

        if (vOption) {
            for (var i in vOption) {
                this._htOption[i] = vOption[i];
            }
        }

        if (this._htOption.useSVG) {
            Drawing = svgDrawer;
        }

        this._android = _getAndroid();
        this._oQRCode = null;
        this._oDrawing = new Drawing(this._htOption);

        if (this._htOption.text) {
            this.makeCode(this._htOption.text);
        }
    };

    AwesomeQRCode.prototype.makeCode = function (sText) {
        this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel);
        this._oQRCode.addData(sText);
        this._oQRCode.make();
        this._oDrawing.draw(this._oQRCode);
        this.makeImage();
    };

    AwesomeQRCode.prototype.makeImage = function () {
        if (typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3)) {
            this._oDrawing.makeImage();
        }
    };

    AwesomeQRCode.prototype.clear = function () {
        this._oDrawing.clear();
    };

    AwesomeQRCode.CorrectLevel = QRErrorCorrectLevel;

    function getAverageRGB(imgEl) {

        var blockSize = 5,
            defaultRGB = {
            r: 0,
            g: 0,
            b: 0
        },
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data,
            width,
            height,
            i = -4,
            length,
            rgb = {
            r: 0,
            g: 0,
            b: 0
        },
            count = 0;

        if (!context) {
            return defaultRGB;
        }

        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

        context.drawImage(imgEl, 0, 0);

        try {
            data = context.getImageData(0, 0, width, height);
        } catch (e) {
            return defaultRGB;
        }

        length = data.data.length;

        while ((i += blockSize * 4) < length) {
            if (data.data[i] > 200 || data.data[i + 1] > 200 || data.data[i + 2] > 200) continue;
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }

        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);

        return rgb;
    }
})();

(function (window, factory) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
        module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.eventUtil = factory();
    }
})(undefined, function () {
    return new AwesomeQRCode();
});
//# sourceMappingURL=awesome-qr.js.map