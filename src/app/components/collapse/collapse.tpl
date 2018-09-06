<div style="position: relative;">
    {{for index,CollapseItem in it.htmlStrList}}
    {{let fg = it1.currentExpIndex==index}}
    <div class="pi-collapse-item" >
        <div w-class="pi-collapse-head" on-tap="clickItemListener(e,{{index}})">
            <div w-class="pi-collapse-title" class="pi-collapse-title">{{CollapseItem.title}}</div>
            <img src="../../res/image/{{fg ? '40.png' : '22.png'}}" w-class="collapseBtn"/>
        </div>
        <div w-class="pi-collapse-item-panel" class="pi-collapse-item-panel">
            <widget w-tag="pi-ui-html" w-class="pi-collapse-item-content" >{{CollapseItem.htmlStr}}</widget>
        </div>
    </div>
    {{end}}
</div>