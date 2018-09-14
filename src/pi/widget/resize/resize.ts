export const resize = (option: Option, cb: (data: any/*base64, ab*/) => void) => {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let img = new Image();
    img.crossOrigin = '';
    img.onload = function () {
        let scale = (img.width < img.height) ? (option.width / img.width) : (option.width / img.height);
        scale = (scale < 1) ? scale : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        let base64 = null;
        if (option.type == "jpeg") {
            base64 = canvas.toDataURL("image/" + option.type, option.ratio || 0.92);
        } else {
            base64 = canvas.toDataURL("image/" + option.type)
        }
        let mimeString = base64.split(',')[0].split(':')[1].split(';')[0]; // mime类型
        let byteString = atob(base64.split(',')[1]); //base64 解码
        let arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
        let intArray = new Uint8Array(arrayBuffer); //创建视图
        for (let i = 0; i < byteString.length; i += 1) {
            intArray[i] = byteString.charCodeAt(i);
        }
        if (cb) cb({ base64, ab: arrayBuffer });
    };
    img.src = option.url;
}

interface Option {
    url: string;
    width: number;
    ratio: number;
    type: string;
}