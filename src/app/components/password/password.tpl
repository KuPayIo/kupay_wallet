<div>
    <div w-class="pswInput" ev-input-change="pswChange" ev-input-focus="iconChange()">
        <div style="flex: 1">
            <app-components1-input-input>{itype:"password",placeHolder:{{it.placeHolder?it.placeHolder:it1.cfgData.password}},input:{{it1.password}} }</app-components1-input-input>
        </div>
        {{if it1.isSuccess}}
        <img src="../../res/image/icon_right2.png" w-class="successPic"/>
        {{elseif it1.showIcon}}
        <img src="../../res/image/fail.png" w-class="successPic" on-tap="clear"/>
        {{end}}
    </div>

    <div style="display: flex;flex: 3;">
        <div w-class="line line{{it1.secret>0?it1.secret:''}}"></div>
        <div w-class="line line{{it1.secret>1?it1.secret:''}}"></div>
        <div w-class="line line{{it1.secret>2?it1.secret:''}}"></div>
    </div>

    {{if it1.showTips}}
    <div w-class="tips">{{it.tips ? it.tips : it1.cfgData.tips}}</div>
    {{end}}
</div>