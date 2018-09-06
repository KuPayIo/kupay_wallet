<div class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":"设置"}</app-components1-topBar-topBar>
    <div w-class="content">
        <div w-class="userHead">
            <img src="../../../res/image/default_avater_big.png" w-class="headImg"/>
            <span w-class="headName">用户名</span>
            <img src="../../../res/image/13.png" style="width: 40px;height: 40px;margin-right: 30px;"/>
        </div>

        <div style="margin-bottom: 30px;">
            <div w-class="mode">
                <div on-tap="">
                    <app-components-basicItem-basicItem>{name:"手机号",describe:"未设置",style:"margin:0;"}</app-components-basicItem-basicItem>
                </div>
                <div on-tap="">
                    <app-components-basicItem-basicItem>{name:"修改密码",style:"margin:0;border:none;"}</app-components-basicItem-basicItem>
                </div>
            </div>

            <div w-class="mode">
                <div on-tap="">
                    <app-components-basicItem-basicItem>{name:"语言",describe:"中文",style:"margin:0;"}</app-components-basicItem-basicItem>
                </div>
                <div on-tap="">
                    <app-components-basicItem-basicItem>{name:"货币单位",describe:"CNY",style:"margin:0;"}</app-components-basicItem-basicItem>
                </div>
                <div on-tap="">
                    <app-components-basicItem-basicItem>{name:"涨跌颜色",describe:"红涨绿跌",style:"margin:0;border:none;"}</app-components-basicItem-basicItem>
                </div>
            </div>

            <div w-class="mode">
                <div w-class="item" ev-switch-click="onSwitchChange">
                    <span w-class="itemName">锁屏开关</span>
                    <app-components-switch-switch>{types:false}</app-components-switch-switch>
                </div>
                {{if it1.openLockScreen}}
                <div w-class="item">
                    <span w-class="itemName">修改锁屏密码</span>
                </div>
                <div w-class="item">
                    <span w-class="itemName">忘记密码？</span>
                </div>
                {{end}}
            </div>

            <div w-class="mode">
                <div w-class="item">
                    <span w-class="itemName" style="color: #F5A264;">注销账户</span>
                </div>
            </div>

        </div>
        <div style="height: 128px;"></div>
    </div>
</div>