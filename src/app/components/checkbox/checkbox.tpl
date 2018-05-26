<div on-tap="doClick" w-class="checkbox">
    {{if it.type}}
    <span w-class="icon_{{it.type}} icon-box">
        <i w-class="arrow_{{it.type}}" class="checkbox1_{{it.type}}"></i>
    </span>
    <span w-class="text_{{it.type}}">{{it.text}}</span>
    {{end}}
</div>