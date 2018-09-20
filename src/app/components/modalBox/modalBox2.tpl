<div w-class="base">
    <div w-class="main">
        <div w-class="header">
            <div w-class="title">
                <span>{{it.title}}</span>
                <div w-class="quit-container" on-tap="quitClick"><img w-class="quit" src="../../res/image/btn_pop_close.png"/></div>
            </div>
        </div>
        <div w-class="content" {{if it.contentStyle}}style="{{it.contentStyle }}"{{end}}>
            {{if it.content}}
            <div w-class="message">
                <p>{{it.content}}</p>
            </div>
            {{end}}
        </div>
        <div w-class="extra">{{it.extraInfo}}</div>
        <div w-class="copy-btn" on-tap="copyBtnClick">{{it.copyBtnText}}</div>
    </div>
</div>