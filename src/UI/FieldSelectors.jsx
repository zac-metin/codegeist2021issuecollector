import ForgeUI, {useState, useEffect, useConfig, Fragment, CheckboxGroup, Checkbox, TextField, TextArea } from '@forge/ui';

import PresetFormItem from './PresetFormItem';

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

    const getItemByKey = (fieldKey) => allFieldOptions ? allFieldOptions.find(field => field && field.key === fieldKey) : null;
    const displayName = (fieldKey) => allFieldOptions ? allFieldOptions.find(field => field.key === fieldKey).name : '';

    const noShowFields = ["Issue Type", "Project", "Reporter", "Epic Link", "Linked Issues", "Assignee", "Attachment"];
    
    const renderPresetOptions = () => allFieldOptions
        .filter(field => !(noShowFields.includes(field.name)))
        .filter(field => !(field.schema.type === "array" && field.allowedValues ))
        .map(field => (<Checkbox label={field.name} value={field.key} />
        ));

    const renderCustomOptions = () => allFieldOptions
        .filter(field => !(noShowFields.includes(field.name)))
        .map(field => (<Checkbox label={field.name} value={field.key} />
        ));

    return (
        <Fragment>
            {fieldOptions && 
            <CheckboxGroup label="Optional Fields" name="fields" description="Set optional fields to display form inputs for">
                {fieldOptions
                .filter(field => !(["Description", "Epic Link", "Linked Issues", "Assignee", "Attachment"].includes(field.name)))
                .map(field => (<Checkbox label={field.name} value={field.key} />
                ))}
            </CheckboxGroup>}
            {allFieldOptions && 
            <CheckboxGroup label="Preset Fields" name="presets" description="Set a default value for fields">
                {renderPresetOptions()}
            </CheckboxGroup>}
            {config.presets && config.presets.length > 0 && (typeof config.presets !== "string") &&
            config.presets.map(field => <PresetFormItem item={getItemByKey(field)} /> )}
            {allFieldOptions && 
            <CheckboxGroup label="Customise Field Names" name="renamed" description="Set custom display names for form fields">
                {renderCustomOptions()}
            </CheckboxGroup>}
            {config.renamed && config.renamed.length > 0 && (typeof config.renamed !== 'string') &&
            config.renamed.map(field => <TextField label={`Custom label for ${displayName(field)}`} name={`renamed${field}`} />)}
        </Fragment>
    )};

    export default FieldSelectors;