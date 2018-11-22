<div class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"账户","zh_Hant":"賬戶","en":""} }}
    <app-components1-topBar-topBar>{title:{{topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="body">
        <div w-class="head-container" class="pi-input">
            {{if !it1.chooseImage}}
                <widget w-tag="app-components1-img-img" on-tap="uploadAvatar">{imgURL:{{it1.avatar}},width:"120px;"}</widget>
            {{else}}
                <widget w-tag="pi-ui-html" on-tap="uploadAvatar" w-class="ui-html">{{it1.avatarHtml}}</widget>
            {{end}}
            
            <div style="flex: 1 0 0;" ev-input-blur="walletNameInputBlur" ev-input-change="userNameChange">
                {{: defaultName = {"zh_Hans":"昵称未设置","zh_Hant":"暱稱未設置","en":""} }}
                <widget w-tag="app-components1-input-input" id="nameInput">{input:{{it1.nickName}},maxLength:10,placeHolder:{{defaultName}},disabled:{{!it1.canEditName}},notUnderLine:{{!it1.canEditName}} }</widget>
            </div>
            {{if it1.canEditName}}  
                <img src="app/res/image/16.png" w-class="edit" on-tap="changeInput"/>  
            {{else}}
                <img src="app/res/image/edit_gray.png" w-class="edit" on-tap="changeInput"/>                
            {{end}}
            
        </div>
        <div w-class="other">
            <div on-tap="changePhone">
                {{: itemTitle = [{"zh_Hans":"手机号","zh_Hant":"手機號","en":""},
                {"zh_Hans":"修改密码","zh_Hant":"修改密碼","en":""},
                {"zh_Hans":"备份助记词","zh_Hant":"備份助記詞","en":""},
                {"zh_Hans":"未备份","zh_Hant":"未備份","en":""},
                {"zh_Hans":"导出私钥","zh_Hant":"導出私鑰","en":""}] }}
                
                {{: phone = {"zh_Hans":it1.phone,"zh_Hant":it1.phone,"en":""} }}
                {{: bindPhone = {"zh_Hans":"未设置","zh_Hant":"未設置","en":""} }}

                {{if it1.phone.indexOf('*') > 0}}
                <div w-class="other-item" ev-switch-click="onSwitchChange">
                    <span w-class="item-title"><pi-ui-lang>{{itemTitle[0]}}</pi-ui-lang></span>
                    <span w-class="tag">
                        <pi-ui-lang>{{phone}}</pi-ui-lang>
                    </span>
                </div>
                {{else}}
                <app-components-basicItem-basicItem>{name:{{itemTitle[0]}},describe:{{bindPhone}}}</app-components-basicItem-basicItem>
                {{end}}
            </div>
            <div on-tap="changePsw">
                <app-components-basicItem-basicItem>{name:{{itemTitle[1]}},style:"margin:0;border:none;"}</app-components-basicItem-basicItem>
            </div>
        </div>
        
        <div w-class="other">
            <div w-class="other-item" on-tap="backupWalletClick">
                <div w-class="item-title"><pi-ui-lang>{{itemTitle[2]}}</pi-ui-lang></div>
                {{if !it1.backup}}
                <div w-class="tag"><pi-ui-lang>{{itemTitle[3]}}</pi-ui-lang></div>
                {{end}}
                <img src="app/res/image/right_arrow2_gray.png" height="40px" w-class="rightArrow"/>
            </div>
            <div w-class="other-item" on-tap="exportPrivateKeyClick" style="border-bottom: none;">
                <div w-class="item-title"><pi-ui-lang>{{itemTitle[4]}}</pi-ui-lang></div>
                <img src="app/res/image/right_arrow2_gray.png" height="40px" w-class="rightArrow"/>
            </div>
        </div>
    </div>
</div>