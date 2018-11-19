<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="body" on-scroll="pageScroll" id="body">
        <div w-class="head1 {{'head1-' + it1.stateBg}}">
            {{: tags = [
                {"zh_Hans":"昨日收益","zh_Hant":"昨日收益","en":""},
                {"zh_Hans":"年化收益","zh_Hant":"年化收益","en":""},
                {"zh_Hans":"累计收益","zh_Hant":"累計收益","en":""},
                {"zh_Hans":"持续(天)","zh_Hant":"持續(天)","en":""}] }}
            
            {{: details = [
                {"zh_Hans":"交易时间：","zh_Hant":"交易時間：","en":""},
                {"zh_Hans":"购买单价：","zh_Hant":"購買單價：","en":""},
                {"zh_Hans":"产品名称：","zh_Hant":"產品名稱：","en":""},
                {"zh_Hans":"购买份数：","zh_Hant":"購買份數：","en":""},
                {"zh_Hans":"年化收益：","zh_Hant":"年化收益：","en":""},
                {"zh_Hans":"锁定期：","zh_Hant":"鎖定期：","en":""}] }}

            <div w-class="head1-tag"><pi-ui-lang>{{tags[0]}}</pi-ui-lang> ({{it.product.coinType}})</div>
            <div w-class="ye-earn">{{it.product.yesterdayIncoming}}</div>
            <div w-class="status">{{it1.stateShow}}</div>
            <div w-class="head2">
                <div w-class="col1">
                    <div w-class="tag"><pi-ui-lang>{{tags[1]}}</pi-ui-lang></div>
                    <div w-class="content">{{it.product.profit}}%</div>
                </div>
                <div w-class="line"></div>
                <div w-class="col2">
                    <div w-class="tag"><pi-ui-lang>{{tags[2]}}</pi-ui-lang> ({{it.product.coinType}})</div>
                    <div w-class="content">{{it.product.totalIncoming}}</div>
                </div>
                <div w-class="line"></div>
                <div w-class="col1">
                    <div w-class="tag"><pi-ui-lang>{{tags[3]}}</pi-ui-lang></div>
                    <div w-class="content">{{it.product.days}}</div>
                </div>
            </div>
        </div>

        <div w-class="bottom-box">
            <div w-class="row5">{{it.product.productIntroduction}}</div>
            <div w-class="title"><pi-ui-lang>{"zh_Hans":"其他信息","zh_Hant":"其他信息","en":""}</pi-ui-lang></div>
            <div w-class="detail-box">
                <div w-class="detail"><pi-ui-lang>{{details[0]}}</pi-ui-lang> {{it.product.purchaseDate}}</div>
                <div w-class="detail"><pi-ui-lang>{{details[1]}}</pi-ui-lang> {{it.product.unitPrice}}{{it.product.coinType}}</div>
                <div w-class="detail"><pi-ui-lang>{{details[2]}}</pi-ui-lang> {{it.product.productName}}</div>
                <div w-class="detail"><pi-ui-lang>{{details[3]}}</pi-ui-lang> {{it.product.amount}} <pi-ui-lang>{"zh_Hans":"份","zh_Hant":"份","en":""}</pi-ui-lang></div>
                <div w-class="detail"><pi-ui-lang>{{details[4]}}</pi-ui-lang> {{it.product.profit}}%</div>
                <div w-class="detail"><pi-ui-lang>{{details[5]}}</pi-ui-lang> {{it.product.lockday}}</div>
            </div>
            <div w-class="read" on-tap="readAgree"><pi-ui-lang>{"zh_Hans":"阅读声明","zh_Hant":"閱讀聲明","en":""}</pi-ui-lang></div>
            <div ev-btn-tap="redemptionClick" w-class="btn">
                {{: btnName = {"zh_Hans":it1.btnText,"zh_Hant":it1.btnText,"en":""} }}
                <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":{{it1.btnBgColor}}}</app-components1-btn-btn>
            </div>
        </div>
    </div>
    
  {{: topBarTitle = {"zh_Hans":it.product.productName,"zh_Hant":it.product.productName,"en":""} }}
    <app-components1-topBar-topBar2>{scrollHeight:{{it1.scrollHeight}},text:{{topBarTitle}} }</app-components1-topBar-topBar2>
    
</div>