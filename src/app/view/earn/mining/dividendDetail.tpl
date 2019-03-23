<div class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"分红说明","zh_Hant":"分紅說明","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    <div w-class="content">
        <div w-class="title">
            <pi-ui-lang>{"zh_Hans":"如何分红？","zh_Hant":"如何分紅？","en":""}</pi-ui-lang>
        </div>
        <div style="padding: 30px;line-height: 50px;">
            <p>
                <pi-ui-lang>{
                    "zh_Hans":"1、分红单位最小为份，1份{{ it.ktShow }}=3000{{ it.ktShow }}，只核算云账户中的{{ it.ktShow }}，未挖取的矿储量不算。",
                    "zh_Hant":"1、分紅單位最小為份，1份{{ it.ktShow }}=3000{{ it.ktShow }}，只核算雲賬戶中的{{ it.ktShow }}，未挖取的礦儲量不算。",
                    "en":""}
                </pi-ui-lang>
            </p>
            <p>
                <pi-ui-lang>{
                    "zh_Hans":"2、分红时间是北京时间(同台北时间)每周五下午2点，点击领分红即可领取本次分红。如没有领取，该次分红一直存在直到领取，分红不累计领取。",
                    "zh_Hant":"2、分紅時間是北京時間(同台北時間)每週五下午2點，點擊領分紅即可領取本次分紅。如沒有領取，該次分紅一直存在直到領取，分紅不累計領取。",
                    "en":""}
                </pi-ui-lang>
            </p>
            <p>
                <pi-ui-lang>{
                    "zh_Hans":"3、分红开始之前可增加持有{{ it.ktShow }}获取更多分红。",
                    "zh_Hant":"3、分紅開始之前可增加持有{{ it.ktShow }}獲取更多分紅。",
                    "en":""}
                </pi-ui-lang>
            </p>
            <p>
                <pi-ui-lang>{
                    "zh_Hans":"4、曾经拥有1000{{ it.ktShow }}才具有提现权限。",
                    "zh_Hant":"4、曾經擁有1000{{ it.ktShow }}才具有提現權限。",
                    "en":""}
                </pi-ui-lang>
            </p>
            <p>
                <pi-ui-lang>{
                    "zh_Hans":"5、{{it.walletName}}拥有最终解释权。",
                    "zh_Hant":"5、{{it.walletName}}擁有最終解釋權。",
                    "en":""}
                </pi-ui-lang>
            </p>
        </div>
    </div>
</div>