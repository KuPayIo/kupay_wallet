<div  on-click="doClick">
    {{let myColor = it.type?(it.activeColor||'#409eff'):(it.inactiveColor||'#dcdfe6')}}
    <span w-class="switch_bg" class="{{it.type?'switch_icon_select':'switch_icon'}}" style="{{'background-color: '+myColor+';border-color:'+myColor}}"></span>
</div>