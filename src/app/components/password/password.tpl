<div>
    <div w-class="pswInput" ev-input-change="pswChange">
        <div style="flex: 1">
            <app-components1-input-input>{itype:"password",placeHolder:"密码",style:"border-bottom:none;font-size: 32px;"}</app-components1-input-input>
        </div>
        {{if it1.isSuccess}}
        <img src="../../res/image/icon_right2.png" w-class="successPic"/>
        {{end}}
    </div>

    <div w-class="line" ></div>
    {{if it1.secret==1}} 
    <div w-class="line1" ></div>
    {{elseif it1.secret==2}} 
    <div w-class="line2" ></div>
    {{elseif it1.secret==3}} 
    <div w-class="line3" ></div>
    {{end}}
    {{if it1.showTips}}
    <div w-class="tips">{{it.tips ? it.tips : "至少8位字符，并包含英文、数字、特殊字符其中两种类型"}}</div>
    {{end}}
</div>