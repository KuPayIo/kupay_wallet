/**
 * creation complete
 */
import { Widget } from '../../../../../pi/widget/widget';
import { event } from '../../../../../pi/widget/event';
import { popNew } from '../../../../../pi/ui/root';
export class CreateComplete extends Widget {
    public ok: () => void;
    public state;
    public reader = new FileReader();
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        this.state = {
            choosedimg: false,//是否选择图片
            imgBase64Data: "",//图片base64
            inputWords: ""//输入字符串
        }
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public chooseImg() {
        this.trigger();//触发input file输入框点击事件
    }
    private trigger() {
        //IE
        if (document.all) {
            document.getElementById("imgInput").click();
        }
        // 其它浏览器
        else {
            var e = document.createEvent("MouseEvents");
            e.initEvent("click", true, true);　　　　　　　　　　　　　　//这里的click可以换成你想触发的行为
            document.getElementById("imgInput").dispatchEvent(e);　　　//这里的clickME可以换成你想触发行为的DOM结点
        }
    }
    public change(e) {
        this.reader.onload = (r) => {
            let imgBase64Data = r.currentTarget.result;
            let img = document.getElementById("choosedImg");
            img.src = imgBase64Data;
            this.state.choosedimg = true;
            this.state.imgBase64Data = imgBase64Data;
            this.paint();
        };
        this.reader.readAsDataURL(e.target.files[0]);

    }

    public inputIng(event) {
        let currentValue = event.currentTarget.value;
        this.state.inputWords = currentValue;
    }
    public nextStep() {
        let validObj=this.valid();
        if(!validObj.isvalid){
            popNew('app-components-message-messagebox', { 
                itype: 'message', 
                title:'提示' , 
                content: validObj.message
            });
        }else{
            this.removeImg();
            this.ok && this.ok();
            popNew("app-view-wallet-walletCreate-createByImg-walletCreate");
        }
    }
    public removeImg() {
        this.state.choosedimg = false;
        document.getElementById("hideForm").reset();
        this.paint();
    }

    public valid(){
        if(this.state.choosedimg==false){
            return{
                message:"请选择图片",
                isvalid:false
            }
        }
        if(this.state.inputWords==""){
            return{
                message:"请输入字符",
                isvalid:false
            }
        }
        return{
            message:"",
            isvalid:true
        }
    }
}
