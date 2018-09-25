<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}} }</app-components1-topBar-topBar>

    <div style="overflow-y: auto;overflow-x: hidden;flex: 1 0 0;">
        <div w-class="content">
            {{for ind,val of it1.data}}
            <div on-tap="show({{ind}})" ev-imgAndBtn-tap="goDetail({{ind}})">
                <app-components-imgAndBtnItem-imgAndBtnItem>{"name":{{val.itemName}},"describe":{{val.itemShort}},"img":{{val.itemImg}},"btnName":{{it1.cfgData.btnName}},isComplete:{{val.isComplete}} }</app-components-imgAndBtnItem-imgAndBtnItem>
                {{if val.show}}
                <div w-class="itemDetail">
                    {{val.itemDetail}}
                </div>
                {{end}}
            </div>
            {{end}}
        </div>
        
    </div>
    
</div>