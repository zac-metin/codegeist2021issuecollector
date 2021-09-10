import ForgeUI, { TextField, TextArea, Select, Option, CheckboxGroup } from "@forge/ui";

const PresetFormItem = (props) => {
    const { item } = props;
    if(!item) return null;
    let label= `Prefill Value for ${item.name}`;
    if(item.name === "Description") return <TextArea label={`Prefill Value for ${item.name}`} name="presetDescription" />
    if(item.name === "Summary") return <TextField label={`Prefill Value for ${item.name}`} name="presetSummary" />
    if(item.allowedValues) {
        if(item.allowedValues.length > 0) {
            return (
                <Select label={label} name={`preset${item.key}`}>
                    {item.allowedValues.map(value => <Option label={value.name || value.value} value={value.id} isMulti={item.name === "Components"} />)}
                </Select>
            )
        }
        else return <CheckboxGroup label={`No options for ${item.name}, add options in Jira to prefill`} name="noOption"/>
    }
    switch(item.schema.type) {
        case 'string':
            return <TextField label={label} name={`preset${item.key}`} />
        default:
            return <TextField label={label} name={`preset${item.key}`} />
    }
}

export default PresetFormItem;