<div w-class="outer" style="{{it.style ? it.style : ''}}">
<div style="height: 40px;">

</div>
<div w-class="ga-top-banner {{it.titlePosition === 'left' ? 'ga-title-left' : ''}}" >
    <div on-tap="backPrePage" w-class="ga-back-container">
        <img src="../../res/image/{{it.iconColor ? it1.backIcon[it.iconColor] : it1.backIcon['default']}}" w-class="ga-back" />
    </div>
    <span on-tap="backPrePage" w-class="ga-banner-title">{{it.title}}</span>
</div>
</div>