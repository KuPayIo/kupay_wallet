<div class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="content">
        <div w-class="userHead">
            <img src="{{it1.userHead}}" w-class="headImg"/>
            <span w-class="headName" ev-input-change="userNameChange" ev-input-blur="userNameConfirm">
                {{if it1.userInput}}
                <app-components1-input-input>{input:{{it1.userName}},placeHolder:{{it1.cfgData.itemTitle[0]}},autofocus:"autofocus",maxLength:10 }</app-components1-input-input>
                {{else}}
                {{it1.userName}}
                {{end}}
            </span>
            <img src="../../../res/image/edit.png" w-class="nameEdit" on-tap="changeInput"/>
        </div>

        <div style="margin-bottom: 30px;">
            <div w-class="mode">
                <div on-tap="itemClick(0)">
                    <app-components-basicItem-basicItem>{name:{{it1.cfgData.itemTitle[1]}},describe:{{it1.phone}},style:"margin:0;"}</app-components-basicItem-basicItem>
                </div>
                <div on-tap="itemClick(1)">
                    <app-components-basicItem-basicItem>{name:{{it1.cfgData.itemTitle[2]}},style:"margin:0;border:none;"}</app-components-basicItem-basicItem>
                </div>
            </div>

            <div w-class="mode">
                <div on-tap="itemClick(2)">
                    <app-components-basicItem-basicItem>{name:{{it1.cfgData.itemTitle[3]}},describe:{{it1.itemList[0].list[it1.itemList[0].selected] }},style:"margin:0;"}</app-components-basicItem-basicItem>
                </div>
                <div on-tap="itemClick(3)">
                    <app-components-basicItem-basicItem>{name:{{it1.cfgData.itemTitle[4]}},describe:{{it1.itemList[1].list[it1.itemList[1].selected] }},style:"margin:0;"}</app-components-basicItem-basicItem>
                </div>
                <div on-tap="itemClick(4)">
                    <app-components-basicItem-basicItem>{name:{{it1.cfgData.itemTitle[5]}},describe:{{it1.itemList[2].list[it1.itemList[2].selected] }},style:"margin:0;border:none;"}</app-components-basicItem-basicItem>
                </div>
            </div>

            <div w-class="mode">
                <div w-class="item" ev-switch-click="onSwitchChange" style="{{it1.openLockScreen?'':'border-bottom: none;'}}">
                    <span w-class="itemName">{{it1.cfgData.itemTitle[6]}}</span>
                    <app-components-switch-switch>{types:{{it1.openLockScreen}} }</app-components-switch-switch>
                </div>
                {{if it1.openLockScreen}}
                <div w-class="item" on-tap="oldLockPsw(0)" style="border-bottom: none;">
                    <span w-class="itemName">{{it1.cfgData.itemTitle[7]}}</span>
                </div>
                {{end}}
            </div>

            <div w-class="mode">
                <div w-class="item" on-tap="logOut" style="border-bottom: none;">
                    <span w-class="itemName" style="color: #F5A264;">{{it1.cfgData.itemTitle[8]}}</span>
                </div>
            </div>

        </div>
        <div style="height: 128px;"></div>
    </div>
</div>