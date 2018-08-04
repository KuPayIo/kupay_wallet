<div w-class="step">

    {{for i,v of it.itemList}}
    <div w-class="stepItem">
            <div w-class="title">{{v.title}}</div>

            <div w-class="iconbox">
                <span w-class="iconSpan {{i<=it.step ? "stepd" : ""}}"></span>
                
                <span w-class="iconLine {{i<it.step ? "stepd" : ""}}"></span>
              
            </div>
            <div w-class="content">{{v.content}}</div>
    </div>
    {{end}}
</div>