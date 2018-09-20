<div class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    <app-components1-topBar-topBar>{"title":{{it1.cfgData.topBarTitle}},nextImg:"../../res/image/detailBlueIcon.png"}</app-components1-topBar-topBar>
    <div w-class="inputBox" ev-input-change="inputChange">
        <app-components1-input-input>{placeHolder:{{it1.cfgData.inputPlaceholder}},style:"border-radius:12px;",input:{{it1.cid}} }</app-components1-input-input>
    </div>
    <div w-class="btn" ev-btn-tap="convertClick">
        <app-components-btn-btn>{name:{{it1.cfgData.btnName}},color:"blue"}</app-components-btn-btn>
    </div>
</div>