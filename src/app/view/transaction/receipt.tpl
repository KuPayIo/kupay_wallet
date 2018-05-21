<div w-class="base">
    <div w-class="header" title="36px">
        <div w-class="header-bg"></div>
        <div w-class="title " style="top: 9px; transform-origin: 185.5px 13px 0px;">
            <span>{{it1.title}}</span>
        </div>
        <div w-class="back" on-tap="doClose">
            <img w-class="img-back" src="../../res/image/u12.png" />
        </div>
    </div>

    <div w-class="body">
        <div w-class="balance">余额&nbsp;&nbsp;{{it.currencyBalance}}</div>
        <div w-class="addr">{{it.addr}}</div>
        <div w-class="copy" on-tap="doCopy">复制地址</div>
    </div>
</div>