<div class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    {{: topBarTitle = {"zh_Hans":"兑换","zh_Hant":"兌換","en":""} }}	
    <app-components1-topBar-topBar>{"title":{{topBarTitle}},nextImg:"../../res/image/detailBlueIcon.png"}</app-components1-topBar-topBar>
    <div w-class="inputBox" ev-input-change="inputChange">
        {{: inputPlaceholder = {"zh_Hans":"输入兑换码，领取红包","zh_Hant":"輸入兌換碼，領取紅包","en":""} }}
        <app-components1-input-input>{placeHolder:{{inputPlaceholder}},style:"border-radius:12px;",input:{{it1.cid}},notUnderLine:true }</app-components1-input-input>
    </div>
    <div w-class="btn" ev-btn-tap="convertClick">
        {{: btnName = {"zh_Hans":"兑换","zh_Hant":"兌換","en":""} }}
        <app-components1-btn-btn>{name:{{btnName}},color:"blue"}</app-components1-btn-btn>
    </div>
</div>