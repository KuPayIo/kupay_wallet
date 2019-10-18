<div style="width:100%;height:100%;display: flex;">
<div w-class="tabs" >
{{if it.type === 0}}
    {{for i, v of it.tabBarList}}
        {{if i == it.isActive}}
        <widget w-tag={{v.components}} style="visibility:visible;z-index:0;position:absolute;width:100%;height:100%;">{isActive:{{i == it.isActive}} }</widget>
        {{elseif it.old[i]}}
        <widget w-tag={{v.components}} style="visibility:hidden;z-index:-1;position: absolute;width:100%;height:100%;">{isActive:{{i == it.isActive}} }</widget>
        {{end}}
    {{end}}
{{elseif it.type === 1}}
    <widget w-tag={{it.tabBarList[it.isActive].components}} style="position:absolute;width:100%;height:100%;">{isActive:false}</widget>
{{else}}
    {{for i, v of it.tabBarList}}
        <div ev-myHome="myHome" style="visibility: {{v.modulName == it.isActive ? 'visible' : 'hidden'}}; z-index:{{v.modulName == it.isActive ? 0 :-1}}; position:absolute; width:100%;height:100%;">
            <widget w-tag={{v.components}} >{isActive:{{v.modulName == it.isActive}},userInfo:{{it.userInfo}} }</widget>
        </div>
    {{end}}
{{end}}
</div>

<div w-class="ga-bottom-tab-bar-container" class="{{it.tabBarAnimateClasss}}" >
    <div style=" display: flex;height: 110px;width: 100%;">
        {{for index,item of it.tabBarList}}
        <div w-class="ga-tab-bar-item {{it.isActive == item.modulName ? 'ga-tab-bar-item-active' : ''}}" on-down="tabBarChangeListener(e,{{index}})">
            <img src="../../res/image1/{{it.isActive == item.modulName ? item.iconActive : item.icon}}" w-class="ga-tab-bar-icon" />
            <span w-class="ga-tab-bar-text">
                <pi-ui-lang>{{item.text}}</pi-ui-lang>
            </span>
        </div>
        {{end}}
    </div>
</div>

</div>
