<div w-class="base">
    <div w-class="bg"></div>
    <div w-class="main">
        <div w-class="header">
            <div w-class="title">
                <span>{{it.title}}</span>
            </div>
        </div>
        <div w-class="content">
            <div w-class="cointype">BTC</div>
            <div w-class="message" ev-input-change="inputChange" w-class="input-father">
                <app-components-input-input>{type:{{it.inputType}},placeHolder:"地址"}</app-components-input-input>
                <img src="../../../res/image/btn_scan.png" w-class="scanbtn"/>
            </div>
            {{if it.type==="prompt"}}
            <div ev-input-change="inputChange" w-class="input-father">
                <app-components-input-input>{type:{{it.inputType}},placeHolder:"ETH 004" }</app-components-input-input>
            </div>
            {{end}}
        </div>
        <div w-class="btns">
            {{if it.type==="confirm"||it.type==="prompt"}}
            <button type="button" w-class="button button_small" on-tap="doClickCancel" style="margin-right: 10px;">
                <span>取消</span>
            </button>
            {{end}}
            <button type="button" w-class="button button_small button_sure" on-tap="doClickSure">
                <span>确定</span>
            </button>
        </div>
    </div>
</div>