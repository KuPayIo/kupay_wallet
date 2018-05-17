<div class="pi-radio-group" w-class="pi-radio-group" ev-radio-change="radioChangeListener">
    {{for index,radio of it.radioList}}
        <radio$>{text:{{radio.text}},labelIndex:{{index}},checkedIndex:{{it.checkedIndex}},disabled:{{radio.disabled}}}</radio$>
    {{end}}
</div>