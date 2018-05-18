<div w-class="base">
    <div w-class="header" title="36px">
        <div w-class="header-bg"></div>
        <div w-class="title " style="top: 9px; transform-origin: 185.5px 13px 0px;">
            <span>{{it1.title}}</span>
        </div>
        <div w-class="back" style="cursor: pointer;" on-tap="doClose">
            <img w-class="img-back" src="../../res/image/u12.png" />
        </div>
    </div>

    <div w-class="body">
        <div w-class="pay">{{it.pay}}</div>
        <div w-class="result">{{it.result}}</div>
        <div w-class="line"></div>
        <div w-class="body-title">收币地址</div>
        <div w-class="body-title-value">{{it.getAddr}}</div>
        <div w-class="body-title">矿工费</div>
        <div w-class="body-title-value">{{it.tip}}</div>
        <div w-class="body-title">备注</div>
        <div w-class="body-title-value">{{it.info}}</div>
        <div w-class="body-title">发币地址</div>
        <div w-class="body-title-value">{{it.setAddr}}</div>
        <div w-class="body-title">交易时间</div>
        <div w-class="body-title-value">{{it.time}}</div>
        <div w-class="body-title">交易号</div>
        <div w-class="body-title-value">{{it.id}}</div>
    </div>
</div>