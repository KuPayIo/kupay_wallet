/**
 * 图片导入（本地、相机）
 */
import { NativeObject, ParamType, registerSign } from './native';

export class ImagePicker extends NativeObject {
    /**
     * 从本地选择图片
     * @param param 参数
     */
    public selectFromLocal(param: any) {
        this.call('chooseImage', param);
    }

    /**
     * 打开相机拍摄
     * @param param 参数
     */
    public openCamera(param: any) {
        // todo
    }
}

registerSign(ImagePicker, {
    chooseImage: [
        {
            name: 'useCamera',// 是否使用相机----(传1表示 “是”，其它任何值都表示 “否”)
            type: ParamType.Number
        },
        {
            name: 'single',// 是否只选择一张照片(单选)----(传1表示 “是”，其它任何值都表示 “否”)
            type: ParamType.Number
        },
        {
            name: 'max',// 可以选择多张的情况下最大可以选择的张数
            type: ParamType.Number
        }
    ]
});

// export class ImagePicker extends NativeObject {
//     /**
//      * 从本地选择图片
//      * 调用成功返回
//      * 手机上的路径
//      * @param param 参数
//      */
//     public selectFromLocal(param: any) {
//         this.call('chooseImage', param);
//     }
//     /**
//      * 传入路径(手机上的路径)->Ahash
//      * @param param 
//      */
//     public calculateAHash(param:any) {
//         this.call('calcAHash',param);
//     }
//     /**
//      * 传入路径(手机上的路径)->Base64
//      * @param param 
//      */
//     public calculateBase64(param:any) {
//         this.call('calcBase64',param);
//     }
// }

// registerSign(ImagePicker, {
//     chooseImage: [
//         {
//             name: 'useCamera',// 是否使用相机----(传1表示 “是”，其它任何值都表示 “否”)
//             type: ParamType.Number
//         },
//         {
//             name: 'single',// 是否只选择一张照片(单选)----(传1表示 “是”，其它任何值都表示 “否”)
//             type: ParamType.Number
//         },
//         {
//             name: 'max',// 可以选择多张的情况下最大可以选择的张数
//             type: ParamType.Number
//         }
//     ],
//     calcAHash: [
//         {
//             /*
//              * 文件在手机里面的路径、传入路径可计算AHash
//              * 这个值会在调用 chooseImage(int, int, int)的时候获得
//              * 传回这个路径之后用于在WebView展示出用户选择的图片
//              * 而不再是传Base64的字符串了~
//              */
//             name: 'path',
//             type: ParamType.String
//         }
//     ],
//     calcBase64: [{
//         /*
//          * 文件在手机里面的路径、传入路径可计算Base64
//          * 这个值会在调用 chooseImage(int, int, int)的时候获得
//          * 传回这个路径之后用于在WebView展示出用户选择的图片
//          */
//         name: 'path',
//         type: ParamType.String
//     }]
// });