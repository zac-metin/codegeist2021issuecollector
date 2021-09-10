import { MacroConfig } from "@forge/ui";

const formatIssue = (config, formValues, fieldOptions, accountId) => {
    let payload = {
      fields: {
        project: {
          key: config.projectKey
        },
        issuetype: {
          id: config.issueTypeId
        },
        assignee: {
          id: config.assignee
        }
      }
    };
    if(config.reporter === 'author') {
      payload.fields.reporter = {
        accountId: accountId
      };
    }
    if(formValues) {
      Object.keys(formValues).forEach(field => {
        const { fieldValue, validField } = formatField(field, formValues[field], config, fieldOptions);
        if(fieldValue && validField) {
          payload.fields[field] = fieldValue;
        }
      })
 
    if(config.presets) {
      config.presets.forEach((field) => {
        if(!Object.keys(formValues).includes(field)) {
          if(config[`preset${field}`]) {
            const { fieldValue, validField } = formatField(
              field,
              config[`preset${field}`],
              config,
              fieldOptions
            );
            if(fieldValue && validField) {
              payload.fields[field] = fieldValue;
            }
          }
        }
      })
    }
    };
    console.log(payload);
    return payload;
};

const formatField = (field, value, config, fieldOptions) => {
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
        case "priority":
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