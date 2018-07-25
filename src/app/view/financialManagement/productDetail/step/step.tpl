<div w-class="step">

    {{for i,v of it.itemList}}
    <div w-class="stepItem">
            <div w-class="iconbox">
                <span w-class="iconSpan {{i<=it.step ? "stepd" : ""}}">
                </span>
                {{if i==0}}
                <span w-class="iconLines {{i<=it.step ? "stepd" : ""}}"></span>
                {{elseif i==it.itemList.length-1}}
                <span w-class="iconLinee {{i<=it.step ? "stepd" : ""}}"></span>
                {{else}}
                <span w-class="iconLine {{i<=it.step ? "stepd" : ""}}"></span>
                {{end}}
            </div>
            <div>title</div>
            <div>content</div>
    </div>
    {{end}}
</div>