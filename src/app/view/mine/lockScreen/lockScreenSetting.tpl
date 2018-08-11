<div class="ga-new-page" w-class="ga-new-page" ev-back-click="backPrePage">
    <app-components-topBar-topBar>{title:"锁屏密码"}</app-components-topBar-topBar>
    <div w-class="ga-line"></div>
    <div w-class="ga-item">
        <span>开启锁屏密码</span>
        <div w-class="{{it1.openLockScreen ? 'switch-choose':'switch'}}" on-tap="onSwitchChange"></div>
    </div>
    <div w-class="hiddenArea {{it1.openLockScreen ? 'openLockScreen' : ''}}">
    <div w-class="ga-item" on-tap="resetLockScreen">修改锁屏密码</div>
    <div w-class="ga-item" on-tap="forgetPasswordClick">忘了密码?</div>
    </div>
</div>