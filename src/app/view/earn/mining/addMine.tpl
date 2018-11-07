<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"排名","zh_Hant":"排名","en":""} }}
    <app-components1-topBar-topBar>{"title":{{topBarTitle}} }</app-components1-topBar-topBar>

    <div style="overflow-y: auto;overflow-x: hidden;flex: 1 0 0;-webkit-overflow-scrolling: touch;">
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
            },
            {
            itemName:{"zh_Hans":"存币送KT","zh_Hant":"存幣送KT","en":""},
            itemShort:{"zh_Hans":"矿储量+1000KT","zh_Hant":"礦儲量+1000KT","en":""},
            itemDetail:{"zh_Hans":"存币到自己的钱包地址，首次存币送1000KT，2-4个送2000KT，4-8个送4000KT，8-16个送6000KT，16-32个送8000KT,32以上送10000KT封顶。","zh_Hant":"存幣到自己的錢包地址，首次存幣送1000KT，2-4個送2000KT，4-8個送4000KT，8-16個送6000KT，16-32個送8000KT,32以上送10000KT封頂。","en":""}
            },
            {
            itemName:{"zh_Hans":"与好友分享","zh_Hant":"與好友分享","en":""},
            itemShort:{"zh_Hans":"一起分享0.5ETH","zh_Hant":"一起分享0.5ETH","en":""},
            itemDetail:{"zh_Hans":"成功邀請一人送500KT和0.01ETH。","zh_Hant":"成功邀請一人送500KT和0.01ETH。","en":""}
            },
            {
            itemName:{"zh_Hans":"购买理财","zh_Hant":"購買理財","en":""},
            itemShort:{"zh_Hans":"首次购买额外+1500KT","zh_Hant":"首次購買額外+1500KT","en":""},
            itemDetail:{"zh_Hans":"每购买1ETH等价的理财产品每天送100KT，购买当日额外赠送500KT，首次购买额外赠送1500KT，总量封顶","zh_Hant":"每購買1ETH等價的理財產品每天送100KT，購買當日額外贈送500KT，首次購買額外贈送1500KT，總量封頂","en":""}
            },
            {
            itemName:{"zh_Hans":"聊天","zh_Hant":"聊天","en":""},
            itemShort:{"zh_Hans":"聊天+700KT","zh_Hant":"聊天+700KT","en":""},
            itemDetail:{"zh_Hans":"首次参与聊天赠送700KT","zh_Hant":"首次參與聊天贈送700KT","en":""}
            }] }}
            {{for ind,val of it1.data}}
            <div on-tap="show({{ind}})" ev-imgAndBtn-tap="goDetail({{ind}})">
                <app-components-imgAndBtnItem-imgAndBtnItem>{"name":{{addMineList[ind].itemName}},"describe":{{addMineList[ind].itemShort}},"img":{{val.itemImg}},"btnName":{{btnName}},isComplete:{{val.isComplete}}
                    }</app-components-imgAndBtnItem-imgAndBtnItem>
                {{if val.show}}
                <div w-class="itemDetail">
                   <pi-ui-lang>{{addMineList[ind].itemDetail}}</pi-ui-lang> 
                </div>
                {{end}}
            </div>
            {{end}}
        </div>

    </div>

</div>