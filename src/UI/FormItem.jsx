import ForgeUI, { TextField, TextArea, Select, Option, CheckboxGroup } from "@forge/ui";

const FormItem = (props) => {
    const { item, config } = props;
    let defaultValue = config.presets && config.presets.includes(item.key) ? 
        config[`preset${item.key}`] :
        null;
    let customLabel = config.customnamedFields && config.customnamedFields.includes(item.key) ? 
        config[`custom${item.key}`] :
        null;
    if(item.name === "Description") return <TextArea label={customLabel || item.name} name={item.key} defaultValue={defaultValue} />
    if(item.allowedValues) {
        if(item.allowedValues.length > 0) {
            return (
                <Select label={customLabel || item.name} name={item.key}>
                    {item.allowedValues.map(value => <Option label={value.name || value.value} value={value.id} isMulti={item.name === "Components"} />)}
                </Select>
            )
        }
        else return <CheckboxGroup label={`No options for ${item.name}, add options in Jira`} name="noOption"/>
    }
    switch(item.schema.type) {
        case 'string':
            return <TextField label={customLabel || item.name} name={item.key} defaultValue={defaultValue} />
        default:
            return <TextField label={customLabel || item.name} name={item.key} defaultValue={defaultValue} />
    }
}

export default FormItem;