<div on-click="doClick">
    {{if it.type}}
    <span w-class="icon_{{it.type}}">
        <i w-class="arrow_{{it.type}}" class="checkbox_{{it.type}}"></i>
    </span>
    <span w-class="text_{{it.type}}">{{it.text}}</span>
    {{end}}
</div>