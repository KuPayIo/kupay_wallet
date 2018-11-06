<div class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"设置","zh_Hant":"設置","en":""} }}
    <app-components1-topBar-topBar>{"title":{{topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="content">
        <div style="margin: 30px 0;">
            <div w-class="mode">
                {{: itemTitle = [
                {"zh_Hans":"语言","zh_Hant":"語言","en":""},
                {"zh_Hans":"货币单位","zh_Hant":"貨幣單位","en":""},
                {"zh_Hans":"涨跌颜色","zh_Hant":"漲跌顏色","en":""},
                {"zh_Hans":"锁屏开关","zh_Hant":"鎖屏開關","en":""},
                {"zh_Hans":"退出账户","zh_Hant":"退出賬戶","en":""},
                {"zh_Hans":"退出并清除信息","zh_Hant":"退出並清除信息","en":""}] }}

                {{for ind,val of it1.itemList}}
                <div on-tap="itemClick({{ind}})">
                    <app-components-basicItem-basicItem>{name:{{itemTitle[ind]}},describe:{{val.list[val.selected]}} }</app-components-basicItem-basicItem>
                </div>
                {{end}}
                <div w-class="item" ev-switch-click="onSwitchChange" style="border-bottom: none;">
                    <span w-class="itemName"><pi-ui-lang>{{itemTitle[3]}}</pi-ui-lang></span>
                    <span style="margin-right: 20px">
                        <app-components-switch-switch>{types:{{it1.openLockScreen}} }</app-components-switch-switch>
                    </span>
                </div>
            </div>

            <div w-class="mode">
                <div w-class="item" on-tap="logOut">
                    <span w-class="itemName"><pi-ui-lang>{{itemTitle[4]}}</pi-ui-lang></span>
                </div>
                <div w-class="item" on-tap="logOutDel" style="border-bottom: none;">
                    <span w-class="itemName" style="color: #F5A264;"><pi-ui-lang>{{itemTitle[5]}}</pi-ui-lang></span>
                </div>
            </div>

        </div>
        <div style="height: 128px;"></div>
    </div>
</div>