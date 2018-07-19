<div w-class="base">
    <div w-class="bg"></div>
    <div w-class="main">
        <div w-class="header">
            <div w-class="title">
                <span>{{it.title}}</span>
            </div>
        </div>
        <div w-class="content" {{if it.contentStyle}}style="{{it.contentStyle }}"{{end}}>
            {{if it.content}}
            <div w-class="message">
                <p>{{it.content}}</p>
            </div>
            {{end}}
            {{if it.itype==="prompt"}}
            <div ev-input-change="inputChange" w-class="input-father">
                <input-input$$>{itype:{{it.inputType}},placeHolder:{{it.placeHolder}}}</input-input$$>
            </div>
            {{end}}
        </div>
        {{if it.itype !== "extra"}}
        <div w-class="btns">
            {{if it.itype==="confirm"||it.itype==="prompt"}}
            <button type="button" w-class="button button_small" on-tap="doClickCancel" style="margin-right: 90px;{{it.cancelButtonStyle?it.cancelButtonStyle:''}}">
                {{if it.cancelButton}}
                <span>{{it.cancelButton}}</span>
                {{else}}
                <span>取消</span>
                {{end}}
            </button>
            {{end}}
            <button type="button" w-class="button button_small button_sure" on-tap="doClickSure" style="{{it.okButtonStyle?it.okButtonStyle:''}}">
                    {{if it.okButton}}
                    <span>{{it.okButton}}</span>
                    {{else}}
                    <span>确定</span>
                    {{end}}
            </button>
        </div>
        {{else}}
        <div w-class="extra">{{it.extraInfo}}</div>
        <div w-class="quit-container" on-tap="quitClick"><img w-class="quit" src="../../res/image/btn_pop_close.png"/></div>
        <div w-class="copy-btn" on-tap="copyBtnClick">{{it.copyBtnText}}</div>
        {{end}}
    </div>
</div>