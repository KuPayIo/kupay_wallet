<div w-class="main" class="message_open ">
    <p w-class="text">
    {{if typeof(it.content)==='string' }}
        {{it.content}}
    {{else}}
        <pi-ui-lang>{{it.content}}</pi-ui-lang>
    {{end}}
    </p>
</div>