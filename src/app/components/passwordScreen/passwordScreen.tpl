<div w-class="ga-psw-screen">
    <div w-class="ga-title">{{it.title}}</div>
    <div w-class="ga-dots-container">
        {{for index,value of it1.defaultArr}}
            <span w-class="{{it1.pswArr[index] ? 'ga-dot ga-dot-active' : 'ga-dot'}}"></span>
        {{end}}
    </div>
    <div w-class="ga-extra-text">{{it.extraText}}</div>
</div>