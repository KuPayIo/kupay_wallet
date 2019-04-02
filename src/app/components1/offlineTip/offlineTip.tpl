<div style="{{ it.isLogin ? 'height:0px;' : ''}}overflow:hidden;">
    <div w-class="netClose">
        <img src="../../res/image/question_blue.png" style="width:32px;margin-right: 10px;"/>
        <span style="margin-right:20px;">网络连接不可用&nbsp;<span style="color:#388EFF;" on-tap="reConnect">点击重连</span></span>
        {{if it.reconnecting}}
        <app-components1-loading-loading2>{}</app-components1-loading-loading2>
        {{end}}
    </div>
</div>