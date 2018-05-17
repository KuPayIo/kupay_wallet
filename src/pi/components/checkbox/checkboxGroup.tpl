<div>
    {{if it.chooseAll}}
    <div on-click="doAllClick">
        <components-checkbox-checkbox>{type:{{it1.chooseAllType}},text:{{it.chooseAll}}}</components-checkbox-checkbox>
    </div>
    {{end}}
    <div ev-checkbox-click="doEachClick">
        {{for i,v of it.list}}
        <components-checkbox-checkbox>{type:{{v.type}},text:{{v.text}},index:{{i}},reset:{{v.reset}}}</components-checkbox-checkbox>
        {{end}}
    </div>
</div>