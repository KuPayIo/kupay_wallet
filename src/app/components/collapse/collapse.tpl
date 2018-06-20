<div w-class="pi-collapse" class="pi-collapse">
    {{for index,CollapseItem in it.collapseList}}
    <div class="pi-collapse-item {{it1.isExpanded(index) ? 'pi-collapse-item-active' : ''}}" w-class="pi-collapse-item">
        <div w-class="pi-collapse-head" on-tap="clickItemListener(e,{{index}})" class="pi-collapse-head">
            <div w-class="ga-icon-container"><img src="../../res/image/{{CollapseItem.icon}}" /></div>
            <div w-class="pi-collapse-title" class="pi-collapse-title">{{CollapseItem.title}}</div>
            <img  src="../../res/image/btn_right_arrow.png" w-class="pi-collapse-arrow {{it1.isExpanded(index) ? 'pi-collapse-arrow-rotate' : ''}}" />
        </div>
        <div w-class="pi-collapse-item-panel {{it1.isExpanded(index) ? 'pi-collapse-item-panel-border' : ''}}"
            class="pi-collapse-item-panel">
            {{for index0,item of CollapseItem.textList}}
            <div w-class="pi-collapse-text-item" class="pi-collapse-text-item" on-tap="itemClick(e,{{index}},{{index0}})">
                <div w-class="pi-collapse-text" class="pi-collapse-text">{{item}}</div>
            </div>
            {{end}}
        </div>
    </div>
    {{end}}
</div>