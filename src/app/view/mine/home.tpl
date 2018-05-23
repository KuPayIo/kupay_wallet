<div class="ga-new-page">
    <div w-class="ga-top-banner">
        <span w-class="ga-banner-title">我的</span>
        <img src="../../res/image/u250.png" w-class="ga-notice"/>
    </div>
    {{for index,item of it1.mineList}}
    <div w-class="ga-item" on-tap="itemClick(e,{{index}})">
        <img src="../../res/image/{{item.icon}}" w-class="ga-item-icon"/>
        <span w-class="ga-item-text">{{item.text}}</span>
        <span w-class="ga-item-arrow"></span>
    </div>
    {{end}}
</div>