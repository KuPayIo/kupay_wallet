<div class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":"联系我们"}</app-components1-topBar-topBar>
    <div w-class="content">
        <div w-class="aboutus-img">
            <img src="../../../res/image/img_logo.png" w-class="logoimg"/>
        </div>
        <div w-class="version">V0.0.1</div>
        <div w-class="shortmess">KuPay是一款功能全面、简单易用的钱包应用。</div>
        
        {{for ind,val of it1.data}}
            <div on-tap="itemClick(e,{{ind}})">
                <app-components-basicItem-basicItem>{"name":{{val.value}},"describe":{{val.desc}} }</app-components-basicItem-basicItem>
            </div>
        {{end}}
    </div>
</div>