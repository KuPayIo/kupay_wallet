<div w-class="pi-collapse" class="pi-collapse">
    {{for index,CollapseItem in it.htmlStrList}}
    <div class="pi-collapse-item {{it1.isExpanded(index) ? 'pi-collapse-item-active' : ''}}">
        <div w-class="pi-collapse-head" on-click="clickItemListener(e,{{index}})">
            <div w-class="pi-collapse-title {{it1.isExpanded(index) ? 'pi-collapse-title-avtive' : ''}}" class="pi-collapse-title">{{CollapseItem.title}}</div>
            <i class="pi-collapse-arrow" w-class="pi-collapse-arrow {{it1.isExpanded(index) ? 'pi-collapse-arrow-rotate' : ''}}"></i>
        </div>
        <div w-class="pi-collapse-item-panel {{it1.isExpanded(index) ? 'pi-collapse-item-panel-border' : ''}}"
            class="pi-collapse-item-panel" 
            style="">
            <widget w-tag="ui-html" w-class="pi-collapse-item-content" >{{CollapseItem.htmlStr}}</widget>
        </div>
    </div>
    {{end}}
</div>