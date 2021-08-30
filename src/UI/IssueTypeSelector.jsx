

import ForgeUI, {Option, Select, useState, useConfig, UserPicker, RadioGroup, Radio, Fragment } from '@forge/ui';

import { requestJira } from "../utils/requestJira";

import FieldSelectors from './FieldSelectors';

const IssueTypeSelector = (props) => {
    const config = useConfig();
    const { projectKey } = props;

    const fetchIssueTypeData = async () => {
        const response = await requestJira(
            `/rest/api/latest/issue/createmeta?projectKeys=${projectKey}&expand=projects.issuetypes`
        );
        const result = await response.json();
        return result;
    };

    const [issuetypeData] = useState(fetchIssueTypeData);

    return (
        <Fragment>
        {issuetypeData && 
            <Select label="Issue type" name="issueTypeId">
                {issuetypeData.projects[0].issuetypes.filter(type => !type.subtask).map(issueType => (
                    <Option label={issueType.name} value={issueType.id} />
                ))}
            </Select>}
            {config.issueTypeId && (
                <FieldSelectors
                    issueTypeId={config.issueTypeId}
                    projectKey={projectKey} 
                />
            )}
            <UserPicker label="Assign to" name="assignee" />
            <RadioGroup label="Set reporter as" name="reporter">
                <Radio label="User" value="author" />
                <Radio label="None" value="anonymous" />
            </RadioGroup>
        </Fragment>
    )
};

export default IssueTypeSelector;