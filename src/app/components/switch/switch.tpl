<div  on-click="doClick">
    {{let myColor = it.types?(it.activeColor||'linear-gradient(to right,#318DE6,#38CFE7)'):(it.inactiveColor||'#dcdfe6')}}
    <span w-class="switch_bg" class="{{it.types ?'switch_icon_select':'switch_icon'}}" style="background: {{myColor}}"></span>
</div>