<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"排名","zh_Hant":"排名","en":""} }}
    <app-components1-topBar-topBar>{"title":{{topBarTitle}} }</app-components1-topBar-topBar>

    <div style="overflow-y: auto;overflow-x: hidden;flex: 1 0 0;-webkit-overflow-scrolling: touch;scroll-behavior: smooth;">
        <div w-class="content">
            {{: btnName = {"zh_Hans":"做任务","zh_Hant":"做任務","en":""} }}
            {{: addMineList =
            [{
            itemName:{"zh_Hans":"创建钱包","zh_Hant":"創建錢包","en":""},
            itemShort:{"zh_Hans":"矿储量+300KT","zh_Hant":"礦儲量+300KT","en":""},
            itemDetail:{"zh_Hans":"创建钱包送300KT","zh_Hant":"創建錢包贈送300KT","en":""}
            },
            {
            itemName:{"zh_Hans":"验证手机号","zh_Hant":"驗證手機號","en":""},
            itemShort:{"zh_Hans":"矿储量+2500KT","zh_Hant":"礦儲量+2500KT","en":""},
            itemDetail:{"zh_Hans":"手机号注册可提现，额外赠送2500KT","zh_Hant":"手機號註冊可提現，額外贈送2500KT","en":""}
            }] }}
            {{for ind,val of it.data}}
                {{if val.modulIsShow}}
                <div on-tap="show({{ind}})" ev-imgAndBtn-tap="goDetail({{ind}})">
                    <app-components-imgAndBtnItem-imgAndBtnItem>{"name":{{addMineList[ind].itemName}},"describe":{{addMineList[ind].itemShort}},"img":{{val.itemImg}},"btnName":{{btnName}},isComplete:{{val.isComplete}}
                        }</app-components-imgAndBtnItem-imgAndBtnItem>
                    {{if val.detailShow}}
                    <div w-class="itemDetail">
                        <pi-ui-lang>{{addMineList[ind].itemDetail}}</pi-ui-lang> 
                    </div>
                    {{end}}
                </div>
                {{end}}
            {{end}}
        </div>

    </div>

</div>