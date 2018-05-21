<div w-class="base">
    <div w-class="header" title="36px" ev-back-click="doClose">
        <app-components-topBar-topBar>{title:{{it1.title}}}</app-components-topBar-topBar>
    </div>
    <div w-class="body">
        <div w-class="balance">余额&nbsp;&nbsp;{{it.currencyBalance}}</div>
        <div w-class="addr">{{it.addr}}</div>
        <div w-class="copy" on-tap="doCopy">复制地址</div>
    </div>
</div>