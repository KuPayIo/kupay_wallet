<div class="ga-new-page" w-class="ga-new-page" on-tap="closeSelf">
<div w-class="mainBox" on-tap="clickMainBox">
    <div w-class="tip">
        <span>{{it.tip}}</span>
        <img src="../../res/image/exchange_delete.png" on-tap="closeSelf" w-class="imgIcon"/>
    </div>
    <div w-class="linkBox">
        <span on-tap="linkTo">
            {{it.linkTxt}}
        </span>
    </div>
</div>
</div>