<div on-tap="doClick" w-class="checkbox">
    {{if it.itype}}
    <span w-class="icon_{{it.itype}} icon-box">
        <i w-class="arrow_{{it.itype}}" class="checkbox1_{{it.itype}}"></i>
    </span>
    <span w-class="text_{{it.itype}}">{{it.text}}</span>
    {{end}}
</div>