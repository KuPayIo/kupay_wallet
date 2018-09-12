<div class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    <app-components1-topBar-topBar>{"title":"兑换",nextImg:"../../res/image/detailBlueIcon.png"}</app-components1-topBar-topBar>
    <div w-class="inputBox" ev-input-change="inputChange">
        <app-components1-input-input>{placeHolder:"输入兑换码，领取红包",style:"border-radius:12px;",input:{{it1.cid}} }</app-components1-input-input>
    </div>
    <div w-class="btn" ev-btn-tap="convertClick">
        <app-components-btn-btn>{name:"兑换",color:"blue"}</app-components-btn-btn>
    </div>
</div>