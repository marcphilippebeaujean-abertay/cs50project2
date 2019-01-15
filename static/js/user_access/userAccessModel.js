import Model from "../interfaces/model";

export default class UserAccessModel extends Model{
    constructor() {
        super();
        this.formId = 'sign-form';
    }
    queryModelData(reqData){
        super.queryModelData(reqData);
        switch(reqData['dataType']){
            case "fieldInputs":
                let data = Model.formToJSON(this.formId);
                return data;
                break;
            default:
                throw "strange data requested from user access model";
                return {};
                break;
        }
        return {};
    }
}