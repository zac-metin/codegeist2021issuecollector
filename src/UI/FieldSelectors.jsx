import ForgeUI, {useState, useEffect, useConfig, Fragment, CheckboxGroup, Checkbox, TextField, TextArea } from '@forge/ui';

import { requestJira } from "../utils/requestJira";

const FieldSelectors = (props) => {
    const config = useConfig();
    const { issueTypeId, projectKey } = props;

    const fetchProjectFieldData = async () => {
        const response = await requestJira(`/rest/api/latest/issue/createmeta?projectKeys=${projectKey}&expand=projects.issuetypes.fields&issuetypeIds=${issueTypeId}`);
        return await response.json();
    }

    const [ projectFieldData ] = useState(fetchProjectFieldData);
    const [ fieldOptions, setFieldOptions ] = useState();
    const [ allFieldOptions, setAllFieldOptions ] = useState();

    useEffect(() => {
        if(projectFieldData.projects && projectFieldData.projects.length > 0) {
            const typeOptions = projectFieldData.projects[0].issuetypes.find(
                type => type.id === config.issueTypeId
            );
            const allFieldOptions = Object.keys(typeOptions.fields).map(
                key => typeOptions.fields[key]
            );
            setAllFieldOptions(allFieldOptions);
            setFieldOptions(
                allFieldOptions.filter(option => option.required === false)
            );
        }
    }, [projectFieldData]);

    const renderFieldOptions = () => {
        const noShowFields = ["Issue Type", "Project", "Reporter", "Epic Link", "Linked Issues", "Assignee", "Attachment"];
        
        return allFieldOptions
        .filter(field => !(noShowFields.includes(field.name)))
        .filter(field => (field.schema.type === "string" || (field.schema.type === "array" && !field.allowedValues)))
        .map(field => (<Checkbox label={field.name} value={field.key} />
        ));
    };

    return (
        <Fragment>
            {fieldOptions && 
            <CheckboxGroup label="Optional Fields" name="fields" description="">
                {fieldOptions
                .filter(field => !(["Description", "Epic Link", "Linked Issues", "Assignee", "Attachment"].includes(field.name)))
                .map(field => (<Checkbox label={field.name} value={field.key} />
                ))}
            </CheckboxGroup>}
            {allFieldOptions && 
            <CheckboxGroup label="Preset Fields" name="presets" description="Set an initial value for field">
                {renderFieldOptions()}
            </CheckboxGroup>}
            {config.presets && config.presets.length > 0 && (typeof config.presets !== "string") &&
            config.presets.map(field => field === "description" ? 
            <TextArea label={`Prefill Value for ${field}`} name={`preset${field}`} /> : 
            <TextField label={`Prefill Value for ${field}`} name={`preset${field}`} />
            )}
            {allFieldOptions && 
            <CheckboxGroup label="Customise Field Names" name="customnamedFields" description="Set custom display names for form fields">
                {renderFieldOptions()}
            </CheckboxGroup>}
            {config.customnamedFields && config.customnamedFields.length > 0 && (typeof config.customnamedFields !== 'string') &&
            config.customnamedFields.map(field => <TextField label={`Custom field name for ${field}`} name={`custom${field}`} />)}
        </Fragment>
    )};

    export default FieldSelectors;