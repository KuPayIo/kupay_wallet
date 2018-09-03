{{let flag=it.background && it.background!=''}}
<div w-class="outer" style="background: {{it.background}}">
    <div w-class="ga-top-banner" >
        <div w-class="left-container">
            <img on-tap="backPrePage" src="../../res/image/{{flag ? 'btn_back_white.png' : 'right_arrow_blue.png'}}" w-class="ga-back" />
            <span on-tap="backPrePage"  style="color: {{flag?'#fff':''}}">{{it.title}}</span>
        </div>
        {{if it.nextClick}}
        <img on-tap="goNext" src="../../res/image/{{flag ? 'img_share_wechat.png' : 'img_share_moments.png'}}" w-class="ga-next" />
        {{end}}
    </div>
</div>