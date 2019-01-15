export default class Model{
    constructor(){
        this.queryModelData = this.queryModelData.bind(this);
    }
    queryModelData(reqData){
        if(!('dataType' in reqData)){
            throw 'data type not defined for request';
        }
    }
    static formToJSON(formId) {
        let form = document.getElementsByClassName(formId)[0];
        if(form === null){
            return {};
        }
        return [].reduce.call(form.elements, (data, element) => {
                data[element.name] = element.value;
                return data;
            }, {});
    }
}