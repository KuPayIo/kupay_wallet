/**
 * 图片生成助记词
 */

/**
 * 计算图片的average hash
 * @param pixels 图片像素，RGB或者RGBA
 * @param w 宽度(int)
 * @param h 高度(int)
 * @param channels 像素的通道数(int)
 * @return 8长度，表示图像hash(Uint8Array)
 */
export const ahash = (pixels: Uint8Array, w: number, h: number, channels: number): string => {

    if (w < 16 || h < 16) {
        throw new Error('w, h invalid');
    }

    if (channels !== 1 && channels !== 3 && channels !== 4) {
        throw new Error('channels invalid');
    }

    if (!(pixels instanceof Uint8Array)) {
        throw new Error(`pixels invalid, pixels.length = ${(<Uint8Array>pixels).length}, w = ${w}, h = ${h}, channels = ${channels}`);
    }

    const g: any = gray(pixels, w, h, channels);

    const s = resizeGray(g, w, h, 8, 8);

    const mean = getMean(s);

    const u = compareWithMean(s, mean);

    return toHexString(u);
};
/**
 * 彩色图 变 灰度图
 * @param pixels 图片像素，RGB或者RGBA
 * @param w 宽度(int)
 * @param h 高度(int)
 * @param channels 像素的通道数(int)
 */
const gray = (pixels: Uint8Array, w: number, h: number, channels: number) => {

    if (channels === 1) {
        return new Uint8Array(pixels.length).set(pixels, 0);
    }

    let curr = 0;
    const result = new Uint8Array(w * h);

    for (let j = 0; j < h; ++j) {
        for (let i = 0; i < w; ++i) {
            const id = (w * j + i) * channels;
            const r = pixels[id];
            const g = pixels[id + 1];
            const b = pixels[id + 2];
            result[curr++] = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
        }
    }

    return result;
};

/**
 * 取块中像素的平均值
 * @param grayPixels 灰度图的像素
 * 
 */
const getBlockMean = (grayPixels: Uint8Array, w, startW, startH, endW, endH) => {
    let sum = 0;
    let num = 0;
    for (let j = startH; j < endH; ++j) {
        for (let i = startW; i < endW; ++i) {
            ++num;
            sum += grayPixels[j * w + i];
        }
    }

    return Math.round(sum / num);
};

/**
 * 缩放灰度图
 * @param pixels 灰度图的像素
 * @param w 宽度{int}
 * @param h 高度{int}
 * @param wBlock 要缩放的宽度{int}
 * @param hBlock 要缩放的高度{int}
 * @return resize之后的像素数据
 */
const resizeGray = (pixels: Uint8Array, w: number, h: number, wBlock: number, hBlock: number): Uint8Array => {
    const numW = Math.floor(w / wBlock);
    const numH = Math.floor(h / hBlock);
    const r = new Uint8Array(wBlock * hBlock);
    for (let j = 0; j < hBlock; ++j) {
        for (let i = 0; i < wBlock; ++i) {
            r[j * wBlock + i] = getBlockMean(pixels, w, i * numW, j * numH, (i + 1) * numW, (j + 1) * numH);
        }
    }

    return r;
};

/**
 * 求平均数
 * @param data 数据
 * @return 平均数{int}
 */
const getMean = (data: Uint8Array): number => {
    let sum = 0;
    for (let i = 0; i < data.length; ++i) {
        sum += data[i];
    }

    return Math.round(sum / data.length);
};

/**
 * 根据mean，比较pixels的每个元素，小于mean为0，大于mean为1
 * @param data 数据
 * @param  mean 标记{int}
 * @return 长度是data.length，表示计算出来的Hash
 */
const compareWithMean = (data: Uint8Array, mean): Uint8Array => {
    const r = new Uint8Array(data.length);
    for (let i = 0; i < data.length; ++i) {
        r[i] = data[i] < mean ? 0 : 1;
    }

    return r;
};

/**
 * 将Uint8Array变16进制字符串
 * @param data 数据
 * @return 16进制字符串
 */
const toHexString = (data: Uint8Array): string => {
    let result = '';
    const str = data.reduce((last, curr) => last += curr === 1 ? '1' : '0', '');

    for (let i = 0; i < str.length / 4; ++i) {
        const s = str.substr(i * 4, 4);
        result += parseInt(s, 2).toString(16);
    }

    return result;
};
