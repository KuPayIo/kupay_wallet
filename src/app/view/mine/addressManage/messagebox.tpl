<div id="addressMessageBox">
    <div w-class="bg"></div>
    <div w-class="base">
        <div w-class="main">
            <div w-class="header">
                <div w-class="title">
                    <span>{{it.title}}</span>
                    {{if it.mType=="prompt"}}
                    <img src="../../../res/image/btn_scan.png" w-class="scanbtn" on-tap="scanClicked"/>
                    {{end}}
                </div>
            </div>
            <div w-class="content">
                {{if it.mType=="prompt"}}
                <div w-class="message" ev-input-change="addresseChange" w-class="input-father addressInput" class="addressInput">
                    <app-components-input-input>{itype:"textarea",placeHolder:"输入地址",input:"{{it1.input1Value}}",style:{{it1.textAreaStyle}}}</app-components-input-input>
                </div>
                {{else}}
                <div w-class="message" ev-input-change="addresseChange" w-class="input-father addressInput" class="addressInput">
                        <app-components-input-input>{itype:"textarea",placeHolder:"{{it.text}}",style:{{it1.textAreaStyle}},disabled:true}</app-components-input-input>
                </div>
                {{end}}

                {{if it.mType=="confirm"||it.mType=="prompt"}}
                <div ev-input-change="tagsChange" w-class="input-father tags">
                    <app-components-input-input>{itype:{{it.inputType}},placeHolder:"请输入标签",input:"{{it1.input2Value}}",style:{{it1.textInputStyle}} }</app-components-input-input>
                </div>
                {{end}}
            </div>
            <div w-class="btns">
                {{if it.mType=="confirm"||it.mType=="prompt"}}
                <button type="button" w-class="button button_small" on-tap="doClickCancel" style="margin-right: 30px;">
                    <span>取消</span>
                </button>
                {{end}}
                <button type="button" w-class="button button_small button_sure" on-tap="doClickSure">
                    <span>确定</span>
                </button>
            </div>
        </div>
    </div>
</div>
