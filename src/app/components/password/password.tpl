<div>
    <div w-class="pswInput" ev-input-change="pswChange" ev-input-focus="iconChange(1)" ev-input-blur="iconChange(2)">
        <div style="flex: 1">
            <app-components1-input-input>{itype:"password",placeHolder:{{it.placeHolder?it.placeHolder:'密码'}} }</app-components1-input-input>
        </div>
        {{if it1.isSuccess}}
        <img src="../../res/image/icon_right2.png" w-class="successPic"/>
        {{elseif it1.showIcon}}
        <img src="../../res/image/btn_img_close.png" w-class="successPic" on-tap="clear"/>
        {{end}}
    </div>

    <div style="display: flex;">
        <div w-class="line line{{it1.secret>0?it1.secret:''}}"></div>
        <div w-class="line line{{it1.secret>1?it1.secret:''}}"></div>
        <div w-class="line line{{it1.secret>2?it1.secret:''}}"></div>
    </div>

    {{if it1.showTips}}
    <div w-class="tips">{{it.tips ? it.tips : "至少8位字符，并包含英文、数字、特殊字符其中两种类型"}}</div>
    {{end}}
</div>