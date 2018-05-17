<div w-class="pi-input-autocomplete" ev-input-focus="focus" ev-input-blur="blur" ev-input-change="change">
    <components-input-input>{input:{{it1 && it1.currentValue}}}</components-input-input>
    {{if it1.showTips && it1.showTipList.length > 0}}
    <div w-class="pi-input-dropdown">
        <div w-class="pi-scrollbar">
            <div w-class="pi-autocomplete-suggestion__wrap">
                <ul w-class="pi-autocomplete-suggestion__list">
                    {{for index,tip of it1.showTipList}}
                    <li w-class="pi-autocomplete-item" class="pi-autocomplete-item" on-mousedown="autoCompleteItemClickListener(e,'{{tip.value}}')">{{tip.value}}</li>
                    {{end}}
                </ul>
            </div>
        </div>
        <div w-class="pi-popper__arrow" class="pi-popper__arrow"></div>
    </div>
    {{end}}
</div>