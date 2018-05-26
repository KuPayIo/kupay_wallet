<div class="ga-new-page" ev-back-click="backPrePage" style="background-color: #fff;">
    <app-components-topBar-topBar>{title:"关于我们"}</app-components-topBar-topBar>
    <div w-class="aboutus-img">
        <img src="../../../res/image/img_logo.png" w-class="logoimg"/>
    </div>
    <div w-class="version">V0.0.1</div>
    <div w-class="shortmess">fairblock是一款功能全面、简单易用的钱包应用。</div>
    
    {{for ind,val of it1.data}}
        <div w-class="ga-item" on-tap="itemClick(e,{{ind}})">
            <span w-class="ga-item-text">{{val.value}}</span>
            <img src="../../../res/image/btn_right_arrow.png" w-class="ga-item-arrow"/>
        </div>
    {{end}}
</div>