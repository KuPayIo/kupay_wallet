{{let flag=it.background && it.background!=''}}
<div w-class="outer" style="background: {{it.background}}">
    <div w-class="ga-top-banner" >
        <img on-tap="backPrePage" src="../../res/image/{{flag ? 'btn_back_white.png' : 'btn_back.png'}}" w-class="ga-back" />
        <span on-tap="backPrePage" w-class="ga-banner-title{{it.centerTitle?'-center':''}}" style="color: {{flag?'#fff':''}}">{{it.title}}</span>
        <img on-tap="goNext" src="../../res/image/{{flag ? 'btn_dapp_heart.png' : 'btn_dapp_pick.png'}}" w-class="ga-next" />
    </div>
</div>