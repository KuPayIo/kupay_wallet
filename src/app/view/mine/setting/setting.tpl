<div class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="content">
        <div style="margin: 30px 0;">
            <div w-class="mode">
                {{for ind,val of it1.itemList}}
                <div on-tap="itemClick({{ind}})">
                    <app-components-basicItem-basicItem>{name:{{it1.cfgData.itemTitle[ind]}},describe:{{val.list[val.selected]}} }</app-components-basicItem-basicItem>
                </div>
                {{end}}
                <div w-class="item" ev-switch-click="onSwitchChange" style="border-bottom: none;">
                    <span w-class="itemName">{{it1.cfgData.itemTitle[3]}}</span>
                    <span style="margin-right: 20px">
                        <app-components-switch-switch>{types:{{it1.openLockScreen}} }</app-components-switch-switch>
                    </span>
                </div>
            </div>

            {{if it1.wallet}}
            <div w-class="mode">
                <div w-class="item" on-tap="logOut">
                    <span w-class="itemName">{{it1.cfgData.itemTitle[4]}}</span>
                </div>
                <div w-class="item" on-tap="logOutDel" style="border-bottom: none;">
                    <span w-class="itemName" style="color: #F5A264;">{{it1.cfgData.itemTitle[5]}}</span>
                </div>
            </div>
            {{end}}
        </div>
        <div style="height: 128px;"></div>
    </div>
</div>