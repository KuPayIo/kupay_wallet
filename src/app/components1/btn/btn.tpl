<div w-class="btn btn-{{it.types}} {{it.cannotClick?'btn-cannotClick':'btn-'+it.color }}" on-tap="doTap" style="{{it.style?it.style:''}} animation:{{it1.isAbleBtn?'btnClick 0.2s':''}}">
    {{if it1.isString}}
        {{it.name}}
    {{else}}
        <pi-ui-lang>{{it.name}}</pi-ui-lang>
    {{end}}
</div>