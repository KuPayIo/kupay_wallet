<div class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":"设置"}</app-components1-topBar-topBar>
    <div w-class="content">
        <div w-class="userHead">
            <img src={{it1.userHead}} w-class="headImg"/>
            <span w-class="headName" ev-input-change="userNameChange">
                {{if it1.userInput}}
                <app-components-input-input>{input:{{it1.userName}},placeHolder:"请输入昵称",autofocus:"autofocus" }</app-components-input-input>
                {{else}}
                {{it1.userName}}
                {{end}}
            </span>
            <img src="../../../res/image/13.png" style="width: 40px;height: 40px;margin-right: 30px;" on-tap="changeInput"/>
        </div>

        <div style="margin-bottom: 30px;">
            <div w-class="mode">
                <div on-tap="itemClick(0)">
                    <app-components-basicItem-basicItem>{name:"手机号",describe:"未设置",style:"margin:0;"}</app-components-basicItem-basicItem>
                </div>
                <div on-tap="itemClick(1)">
                    <app-components-basicItem-basicItem>{name:"修改密码",style:"margin:0;border:none;"}</app-components-basicItem-basicItem>
                </div>
            </div>

            <div w-class="mode">
                <div on-tap="itemClick(2)">
                    <app-components-basicItem-basicItem>{name:"语言",describe:"中文",style:"margin:0;"}</app-components-basicItem-basicItem>
                </div>
                <div on-tap="itemClick(3)">
                    <app-components-basicItem-basicItem>{name:"货币单位",describe:"CNY",style:"margin:0;"}</app-components-basicItem-basicItem>
                </div>
                <div on-tap="itemClick(4)">
                    <app-components-basicItem-basicItem>{name:"涨跌颜色",describe:"红涨绿跌",style:"margin:0;border:none;"}</app-components-basicItem-basicItem>
                </div>
            </div>

            <div w-class="mode">
                <div w-class="item" ev-switch-click="onSwitchChange" style="{{it1.openLockScreen?'':'border-bottom: none;'}}">
                    <span w-class="itemName">锁屏开关</span>
                    <app-components-switch-switch>{types:{{it1.openLockScreen}} }</app-components-switch-switch>
                </div>
                {{if it1.openLockScreen}}
                <div w-class="item" on-tap="">
                    <span w-class="itemName">修改锁屏密码</span>
                </div>
                <div w-class="item" style="border-bottom: none;">
                    <span w-class="itemName">忘记密码？</span>
                </div>
                {{end}}
            </div>

            <div w-class="mode">
                <div w-class="item" on-tap="logOut" style="border-bottom: none;">
                    <span w-class="itemName" style="color: #F5A264;">注销账户</span>
                </div>
            </div>

        </div>
        <div style="height: 128px;"></div>
    </div>
</div>