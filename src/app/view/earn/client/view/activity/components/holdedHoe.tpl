<div w-class="box" on-tap="selectHoeClick" style="{{it.selected ? 'border:4px solid rgba(50,228,169,1);' : ''}}">
    <img src="{{it.img}}"/>
    <div w-class="holded-num">{{ it.holdedNumber >99 ? "99+" : it.holdedNumber}}</div>
</div>