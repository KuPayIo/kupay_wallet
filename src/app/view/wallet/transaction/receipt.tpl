<div w-class="base">
    <div w-class="header" title="36px" ev-back-click="doClose">
        <app-components-topBar-topBar>{title:{{it1.title}}}</app-components-topBar-topBar>
    </div>
    <div w-class="body">
        <div w-class="qrcode">
            <pi-components-qrcode-qrcode>{value:{{it.addr}},size:500}</pi-components-qrcode-qrcode>
        </div>
        <div w-class="addr">{{it.addr}}</div>
        <div w-class="copy" style="display: none;" on-tap="doCopy">
            <img src="../../../res/image/btn_trans_copy.png" />
        </div>
    </div>



</div>