import { formToJSON } from "../utilities";

export default class UserAccessModel{
    constructor() {
        this.formId = 'sign-form';
        this.queryFormData = this.queryFormData.bind(this);
    }
    queryFormData(){
        let data = formToJSON(this.formId);
        return data;
    }
}