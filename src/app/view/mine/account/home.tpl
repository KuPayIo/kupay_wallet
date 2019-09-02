<div class="new-page" ev-back-click="backPrePage" w-class="newPage">
    {{: topBarTitle = {"zh_Hans":"账户","zh_Hant":"賬戶","en":""} }}
    <app-components-topBar-topBar>{title:{{topBarTitle}} }</app-components-topBar-topBar>
    <div w-class="body">
        <div w-class="other">
            <div on-tap="uploadAvatar" on-down="onShow">
                {{: itemTitle = [{"zh_Hans":"手机号","zh_Hant":"手機號","en":""},
                {"zh_Hans":"性别","zh_Hant":"性別","en":""},
                {"zh_Hans":"个性签名","zh_Hant":"個性簽名","en":""},
                {"zh_Hans":"修改密码","zh_Hant":"修改密碼","en":""},
                {"zh_Hans":"备份助记词","zh_Hant":"備份助記詞","en":""},
                {"zh_Hans":"未备份","zh_Hant":"未備份","en":""},
                {"zh_Hans":"导出私钥","zh_Hant":"導出私鑰","en":""},
                {"zh_Hans":"设置密码","zh_Hant":"設置密碼","en":""},
                {"zh_Hans":"头像","zh_Hant":"頭像","en":""},
                {"zh_Hans":"昵称","zh_Hant":"暱稱","en":""},                
                {"zh_Hans":"退出账户","zh_Hant":"退出賬戶","en":""},
                {"zh_Hans":"退出并清除信息","zh_Hant":"退出並清除信息","en":""},
                {"zh_Hans":"黑名单管理","zh_Hant":"黑名單管理","en":""}
                ] }}
                
                {{: phone = {"zh_Hans":it.phone,"zh_Hant":it.phone,"en":""} }}
                {{: bindPhone = {"zh_Hans":"未设置","zh_Hant":"未設置","en":""} }}
                <app-components-basicItem-basicItem>{name:{{itemTitle[8]}},img:true,chooseImage:{{it.chooseImage}},avatarHtml:{{it.avatarHtml}},avatar:{{it.avatar}} }</app-components-basicItem-basicItem>
            </div>
            <div on-tap="changeName" on-down="onShow">
                <app-components-basicItem-basicItem>{name:{{itemTitle[9]}},describe:{{it.nickName}} }</app-components-basicItem-basicItem>
            </div>
            <div on-tap="changeSex" on-down="onShow">
                {{: activeSex = (it.sex!=2?(it.sex==0?'男':'女'):bindPhone)}}
                <app-components-basicItem-basicItem>{name:{{itemTitle[1]}},describe:{{activeSex}} }</app-components-basicItem-basicItem>
            </div>
            <div on-tap="changeSignature" on-down="onShow">
                <app-components-basicItem-basicItem>{name:{{itemTitle[2]}},describe:{{it.note!=''?it.note:bindPhone}} }</app-components-basicItem-basicItem>
            </div>
        </div>
        <div w-class="other">
            <div on-tap="changePhone" on-down="onShow">
                {{if it.phone.indexOf('*') > 0}}
                <div w-class="other-item" ev-switch-click="onSwitchChange">
                    <span w-class="item-title"><pi-ui-lang>{{itemTitle[0]}}</pi-ui-lang></span>
                    <span w-class="tag">
                        <pi-ui-lang>{{phone}}</pi-ui-lang>
                    </span>
                </div>
                {{else}}
                <app-components-basicItem-basicItem>{name:{{itemTitle[0]}},describe:{{bindPhone}} }</app-components-basicItem-basicItem>
                {{end}}
            </div>
            <div on-tap="changePsw" on-down="onShow">
                {{: pswTitle = it.isTourist ? itemTitle[7] : itemTitle[3]}}
                <app-components-basicItem-basicItem>{name:{{pswTitle}},style:"margin:0;border:none;"}</app-components-basicItem-basicItem>
            </div>
        </div>
        
        <div w-class="other">
            {{if !it.isTourist}}
            <div w-class="other-item" on-tap="backupWalletClick" on-down="onShow">
                <div w-class="item-title"><pi-ui-lang>{{itemTitle[4]}}</pi-ui-lang></div>
                {{if !it.backup}}
                <div w-class="tag"><pi-ui-lang>{{itemTitle[5]}}</pi-ui-lang></div>
                {{end}}
                <img src="app/res/image/right_arrow2_gray.png" height="40px" w-class="rightArrow"/>
            </div>
            <div w-class="other-item" on-tap="exportPrivateKeyClick" style="border-bottom: none;" on-down="onShow">
                <div w-class="item-title"><pi-ui-lang>{{itemTitle[6]}}</pi-ui-lang></div>
                <img src="app/res/image/right_arrow2_gray.png" height="40px" w-class="rightArrow"/>
            </div>
            {{end}}
        </div>

        <div w-class="other" style="margin: 20px 0;">
            <div on-tap="logOut" on-down="onShow">
                <app-components-basicItem-basicItem>{name:{{itemTitle[10]}} }</app-components-basicItem-basicItem>
            </div>
            <div on-tap="logOutDel" on-down="onShow">
                <app-components-basicItem-basicItem>{name:{{itemTitle[11]}} }</app-components-basicItem-basicItem>
            </div>
            <div on-tap="blacklist" on-down="onShow">
                <app-components-basicItem-basicItem>{name:{{itemTitle[12]}} }</app-components-basicItem-basicItem>
            </div>
        </div>
    </div>
</div>