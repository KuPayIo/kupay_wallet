<div w-class="base">
    <div w-class="bg"></div>
    <div w-class="tips"><img w-class="avatar" src="../../res/image/{{it.tipsImgUrl}}"/>{{it.tipsTitle}}</div>
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
            <div ev-input-change="inputChange" w-class="input-father">
                <input-input$$>{itype:{{it.inputType}},placeHolder:{{it.placeHolder}},style:{{it1.style}}}</input-input$$>
            </div>
        </div>
        <div w-class="btns">
            <button type="button" w-class="button button_cancel" on-tap="doClickCancel">
                <span>取消</span>
            </button>
            <button type="button" w-class="button button_sure" on-tap="doClickSure">
                <span>验证</span>
            </button>
        </div>
    </div>
</div>