<div w-class="pi-mask" class="new-page">
    <div w-class="pi-update-box" class="animated bounceInUp">
        <div w-class="pi-update-content">
            <div w-class="pi-pay-title">确认支付</div>
            <div w-class="pi-pay-content">
                <div w-class="pi-pay-item">
                    <span>金额：</span><span id="pi_payCount" w-class="pi-pay-num">{{it.fee_total}} {{it.fee_name}}</span>
                </div>
                <div w-class="pi-pay-item">
                    <span>发给：</span><span id="pi_payObject" w-class="pi-pay-text">{{it.desc}}</span>
                </div>
                <div w-class="pi-pay-item">
                    <span>余额：</span><span id="pi_payBalance" w-class="pi-pay-text">{{it.balance}} {{it.fee_name}}</span>
                </div>
                <div>
                    <input w-class="pi-pay-input" type="password" placeholder="输入密码" name="" id="pi_password" />
                </div>
            </div>
        </div>
        <div w-class="pi-update-btns">
            <div w-class="pi-update-cancel-btn" on-tap="cancelBtnClick">取消</div>
            <div w-class="pi-update-ok-btn" on-tap="okBtnClick">确定</div>
        </div>
    </div>
</div>