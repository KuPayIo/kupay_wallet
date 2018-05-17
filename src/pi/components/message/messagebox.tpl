<div w-class="base">
    <div w-class="bg"></div>
    <div w-class="main">
        <div w-class="header">
            <div w-class="title">
                <span>{{it.title}}</span>
            </div>
        </div>
        <div w-class="content">
            <div w-class="message">
                <p>{{it.content}}</p>
            </div>
            {{if it.type==="prompt"}}
            <div ev-input-change="inputChange">
                <components-input-input>{}</components-input-input>
            </div>
            {{end}}
        </div>
        <div w-class="btns">
            {{if it.type==="confirm"||it.type==="prompt"}}
            <button type="button" w-class="button button_small" on-click="doClickCancel" style="margin-right: 10px;">
                <span>取消</span>
            </button>
            {{end}}
            <button type="button" w-class="button button_small button_sure" on-click="doClickSure">
                <span>确定</span>
            </button>
        </div>
    </div>
</div>