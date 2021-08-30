import ForgeUI, {MacroConfig, Option, Select, render, useState, useConfig, TextField, TextArea } from '@forge/ui';

import { requestJira } from "./utils/requestJira";

import IssueTypeSelector from './UI/IssueTypeSelector';

const fetchProjects = async () => {
    const response = await requestJira("/rest/api/latest/project");
    const json = await response.json();
    return json.sort((a,b) => (a.name > b.name) ? 1 : -1);
};

const Config = () => {
    const config = useConfig();
    const [projects] = useState(fetchProjects);

    return (
        <MacroConfig>
            <TextField label="Name" name="collectorName" description="Name of Issue Collector" />
            <TextArea label="Description" name="collectorDescription" description="Displayed when collector form is shown" />
            <TextField label="Button Text" name="collectorButtonText" />
            <Select label="project" name="projectKey">
                {projects.map(project => (
                <Option 
                    label={`${project.name} (${project.key})`} 
                    value={project.key}
                />))}
            </Select>
            {config && config.projectKey && (<IssueTypeSelector projectKey={config.projectKey} />)}
        </MacroConfig>
    )
};

    export const run = render(<Config />);


