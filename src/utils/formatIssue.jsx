const formatIssue = (field, value, config, fieldOptions) => {
    if(!field || field.length < 3) return {};
    if(field === "summary" || field === "description") {
        return {
            fieldValue: value,
            validField: true
        }
    }
    
    const typeOptions = fieldOptions.projects[0].issuetypes.find(type => type.id === config.issueTypeId);
    const allFieldOptions = Object.keys(typeOptions.fields).map(key => typeOptions.fields[key]);
    const fieldData = allFieldOptions.find(option => option.key === field);

    if(!fieldData || !fieldData.schema) return {};

    if(fieldData.allowedValues && fieldData.allowedValues.length > 0) {
        return field === "components" ? ({
            fieldValue: [{
                id: value
            }],
            validField: true
        }): ({
            fieldValue: {
                id: value
            },
            validField: true
        })
    };

    switch(fieldData.schema.type) {
        case "array":
            const arrayStrings = value.includes(',') ? value.split(',') : [value];
            return {
                fieldValue: arrayStrings.map(item => item.trim()), 
                validField: true
            };
        case "string":
            return {
                fieldValue: value,
                validField: true
            };
        case "number":
            return {
                fieldValue: Number(value),
                validField: true
            };
        default: 
            return {
                fieldValue: value,
                validField: true
            };
    }
};

export default formatIssue;