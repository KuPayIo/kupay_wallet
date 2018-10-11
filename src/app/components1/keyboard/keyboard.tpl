<div class="new-page" w-class="body" id="keyboard">
    <div w-class="top"></div>
    <div w-class="bottom">
        <div w-class="title">
            <div style="text-align: center;width: 100%">{{it.title}}</div>
            {{if it1.closePage}}
            <img src="../../res/image/30_gray.png" w-class="close" on-tap="close"/>
            {{end}}
        </div>
        <div w-class="dots">
            {{for ind,val of it1.defArr}}
            <div w-class="oneDot {{it1.pswArr[ind] >= 0 ? 'dotActive' : ''}}" ></div>
            {{end}}
        </div>
        <div w-class="numbers">
            {{for ind,val of it1.numbers}}
                <div w-class="oneNum {{(ind+1)%3==0?'':'oneNumMore'}}" on-tap="boardItemClick({{ind}})">
                    {{if val=='x'}}
                    <img src="../../res/image1/delete_lock.png"/>
                    {{else}}
                    {{val}}
                    {{end}}
                </div>
            {{end}}
        </div>
    </div>
</div>