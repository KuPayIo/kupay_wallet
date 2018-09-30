<div class="new-page" ev-back-click="backPrePage">
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="content">
        <div w-class="aboutus-img">
            <img src="../../../res/image/img_logo.png" w-class="logoimg"/>
        </div>
        <div w-class="version">V1.0</div>
        <div w-class="shortmess">{{it1.cfgData.shortMess}} </div>
        
        {{for ind,val of it1.data}}
            <div on-tap="itemClick(e,{{ind}})">
                <app-components-basicItem-basicItem>{"name":{{val.value}},"describe":{{val.desc}} }</app-components-basicItem-basicItem>
            </div>
        {{end}}
    </div>
</div>