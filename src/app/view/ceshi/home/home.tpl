<div class="new-page" w-class="new-page">
    <div w-class="topBack">
        <img src="../../../res/image1/topbar_backimg.png" w-class="backImg"/>
        <app-components1-topBar-topBar1>{avatar:{{it.avatar}} }</app-components1-topBar-topBar1>
    </div>
    <div w-class="body">

        {{% 支付宝、微信充值测试}}
        <div style="width:100%;margin-bottom: 50px;"> 
            <p style="font-size:36px;border: 1px solid brown;margin: 0">充值GT测试</p>
            <input type="number" value="" id="total" placeholder="total" style="width:100%;height: 50px;font-size: 26px;box-sizing:border-box;"/>
            <input type="number" value="" id="gt" placeholder="gt" style="width:100%;height: 50px;font-size: 26px;box-sizing:border-box;"/>
            <input type="number" value="" id="payType" placeholder="payType" style="width:100%;height: 50px;font-size: 26px;box-sizing:border-box;"/>
            <input type="text" value="" id="body" placeholder="body" style="width:100%;height: 50px;font-size: 26px;box-sizing:border-box;"/>
            <button on-tap="rechargeBtn" style="width:100%;height: 50px;font-size: 26px;">GT充值</button>
        </div>
        {{% GTPay测试}}
        <div style="width:100%;"> 
            <p style="font-size:36px;border: 1px solid brown;margin: 0">GT支付测试</p>
            <input type="number" value="" id="pay_no" placeholder="out_trade_no" style="width:100%;height: 50px;font-size: 26px;box-sizing:border-box;"/>
            <input type="number" value="" id="pay_total" placeholder="total_fee" style="width:100%;height: 50px;font-size: 26px;box-sizing:border-box;"/>
            <input type="text" value="" id="pay_body" placeholder="body" style="width:100%;height: 50px;font-size: 26px;box-sizing:border-box;"/>
            <button on-tap="payBtn" style="width:100%;height: 50px;font-size: 26px;">GT支付</button>
        </div>

    </div>
</div>