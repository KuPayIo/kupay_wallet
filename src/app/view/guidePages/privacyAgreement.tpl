<div w-class="ga-privacy-agreement-container">
    <h1 w-class="ga-title">服务及隐私服务</h1>
    <div w-class="ga-agreement-box">
        <div w-class="ga-agreement-content">{{it1.agreement}}{{it1.agreement}}</div>
    </div>
    <div w-class="ga-bottom-agreement">
        <div w-class="ga-registered-protocol" ev-checkbox-click="checkBoxClick">
            <app-components-checkbox-checkbox>{itype:"false",text:"我已经认证阅读并同意"}</app-components-checkbox-checkbox>
            <span w-class="ga-user-protocol" on-tap="agreementClick">隐私条约</span>
        </div>
        <div w-class="{{it1.userProtocolReaded ? 'ga-readed-btn ga-readed-btn-active' : 'ga-readed-btn'}} " on-tap="readedClick" >我已阅读</div>
    </div>
</div>