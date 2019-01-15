export const formToJSON = (formClass) => {
        let form = document.getElementsByClassName(formClass)[0];
        if (form === null) {
            return {};
        }
        return [].reduce.call(form.elements, (data, element) => {
            data[element.name] = element.value;
            return data;
        }, {});
    };