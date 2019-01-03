<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"中将记录","zh_Hant":"中獎記錄","en":""} }}
    <widget w-tag="app-components1-topBar-topBar">{"title":{{topBarTitle}} }</widget>

    <div w-class="content flex-col">
        {{if it.history.length !==0}}
        {{% 顶部提示}}
        <div w-class="tips">
            <widget w-tag="pi-ui-lang">{"zh_Hans":"部分卡券及实物奖品已放入我的背包，等待兑换","zh_Hant":"部分卡券及實物獎品已放入我的背包，等待兌換","en":""}</widget>
        </div>


        {{% 列表}}

        {{for i,item in it.history}}
        <div w-class="mat item">
            <img src="{{item.img}}" width="210px;"/>
            <div w-class="item-text">
                <div style="height:45px;font-size:32px;margin-bottom: 20px;">{{item.name}}</div>
                <div style="height:33px;font-size:24px;">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"有效期：至","zh_Hant":"有效期：至","en":""}</widget>
                    {{item.time}}
                </div>
            </div>
        </div>
        {{end}}
        {{else}}
        {{% 无记录}}
        <div w-class="flex-col" style="align-items: center;margin-top:160px;">
            <img src="../../res/image/dividend_history_none.png" width="195px;"/>
            <widget w-class="tips" w-tag="pi-ui-lang">{"zh_Hans":"还没有记录哦","zh_Hant":"還沒有記錄哦","en":""}</widget>
        </div>
        {{end}}
    </div>

</div>