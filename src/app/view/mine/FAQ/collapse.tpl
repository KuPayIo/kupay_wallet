<div w-class="pi-collapse" class="pi-collapse">
    {{for index,CollapseItem in it.htmlStrList}}
    <div class="pi-collapse-item {{it1.isExpanded(index) ? 'pi-collapse-item-active' : ''}}">
        <div w-class="pi-collapse-head" on-tap="clickItemListener(e,{{index}})">
            <div w-class="pi-collapse-title" class="pi-collapse-title">{{CollapseItem.title}}</div>
            <img src="{{it1.isExpanded(index) ? '../../../res/image/btn_bottom_arrow.png' : '../../../res/image/btn_right_arrow.png'}}" w-class="collapseBtn"/>
        </div>
        <div w-class="pi-collapse-item-panel {{it1.isExpanded(index) ? 'pi-collapse-item-panel-border' : ''}}" class="pi-collapse-item-panel">
            <widget w-tag="pi-ui-html" w-class="pi-collapse-item-content" >{{CollapseItem.htmlStr}}</widget>
        </div>
    </div>
    {{end}}
</div>