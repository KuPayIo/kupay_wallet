<lable 
    w-class="{{it.checkedIndex === it.labelIndex ? 'pi-radio-checked' : 'pi-radio'}}"  
    class="{{it.checkedIndex === it.labelIndex ? 'pi-radio is-checked' : 'pi-radio'}} {{it.disabled ? 'is-disabled' : ''}}"
    on-click="clickListenter">
    <span w-class="pi-radio__input">
        <span w-class="{{it.checkedIndex === it.labelIndex ? 'pi-radio__inner-checked' : 'pi-radio__inner'}} {{it.disabled ? 'is-disabled' : ''}}" class="pi-radio__inner"></span>
    </span>
    <span w-class="{{it.disabled ? 'pi-radio__label-disabled' : 'pi-radio__label'}}">{{it.text}}</span>
</lable>