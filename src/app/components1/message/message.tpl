<div w-class="main" class="{{if !it1.isShow}}message-fade-enter{{end}} message_open ">
    <p w-class="text">
    {{if typeof(it.content)==='string'}}
        {{it.content}}
    {{else}}
        <pi-ui-lang>{{it.content}}</pi-ui-lang>
    {{end}}
    </p>
</div>