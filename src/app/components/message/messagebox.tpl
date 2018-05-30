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
            {{if it.type==="prompt"}}
            <div ev-input-change="inputChange" w-class="input-father">
                <input-input$$>{type:{{it.inputType}},placeHolder:{{it.placeHolder}}}</input-input$$>
            </div>
            {{end}}
        </div>
        {{if it.type !== "extra"}}
        <div w-class="btns">
            {{if it.type==="confirm"||it.type==="prompt"}}
            <button type="button" w-class="button button_small" on-tap="doClickCancel" style="margin-right: 90px;">
                <span>取消</span>
            </button>
            {{end}}
            <button type="button" w-class="button button_small button_sure" on-tap="doClickSure">
                <span>确定</span>
            </button>
        </div>
        {{else}}
        <div w-class="extra">{{it.extraInfo}}</div>
        <div w-class="quit-container" on-tap="quitClick"><img w-class="quit" src="../../res/image/btn_pop_close.png"/></div>
        {{end}}
    </div>
</div>