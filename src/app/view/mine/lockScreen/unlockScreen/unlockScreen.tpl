<div ev-completed-click="completedInput" ev-forgetPassword-click="forgetPasswordClick" id="unlock-screen" class="ga-new-page">
    <app-components_level_1-passwordScreen-passwordScreen>{title:{{it1.passwordScreenTitle}},forgetPsw:{{true}}}</app-components_level_1-passwordScreen-passwordScreen>
    {{if it && it.jump}}
    <div w-class="ga-jump" on-tap="jumpClick">跳过</div>
    {{end}}
</div>