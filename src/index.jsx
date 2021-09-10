import ForgeUI, { render, Fragment, Macro, Text, Link, Button, Form, TextField, TextArea, SectionMessage, useConfig, useProductContext, useState } from "@forge/ui";

import { requestJira, postJira } from "./utils/requestJira";
import handleError from "./utils/handleError";

import FormItem from './UI/FormItem';
import formatIssue from './utils/formatIssue';

const App = () => {
  const { accountId } = useProductContext();
  const config = useConfig();
  const [step, setStep] = useState('button');
  const [error, setError] = useState();
  const [issueKey, setIssueKey] = useState();

  const fetchFieldOptions = async () => {
    if(config && config.projectKey && config.issueTypeId) {
      const response = await requestJira(`/rest/api/latest/issue/createmeta?projectKeys=${config.projectKey}&expand=projects.issuetypes.fields&issuetypeIds=${config.issueTypeId}`);
      const projectFieldData = await response.json();
      return projectFieldData;
    }
  }

  const [fieldOptions ] = useState(fetchFieldOptions);

  if(!config) {
    return <Text content="Configure this collector by clicking the macro's Edit (Pencil) Icon while editing the page" />
  }

  const createIssue = async (formValues) => {
    setIssueKey(null);
    
    const payload = formatIssue(config, formValues, fieldOptions, accountId);

    const response = await postJira("/rest/api/2/issue", payload);
    
    const responseBody = await response.json();
    if(!response.ok) {
      const errorMessage = handleError(responseBody);
      setError(errorMessage || 'Failed to create issue.');
    } else {
      setError(null);
      setIssueKey(responseBody.key);
      setStep('success');
    }
  };

  const button = () => (
    <Button 
      appearance="primary"
      text={(config && config.collectorButtonText) ? config.collectorButtonText : "Configuration Required"}
      onClick={() => { setStep('form');}}
    />
  );

  const textFields = () => {
    const typeOptions = fieldOptions.projects[0].issuetypes.find(type => type.id === config.issueTypeId);
    const allFieldOptions = Object.keys(typeOptions.fields).map(key => typeOptions.fields[key]);
    const excludeFields = ["Issue Type", "Project", "Reporter"];
    const selectedFieldOptions = allFieldOptions.filter(option => (
      (option.required && excludeFields.indexOf(option.name) === -1) ||
      config.fields.includes(option.key)
      || option.name === "Description" || option.name === "Summary"));
      return selectedFieldOptions.map(item => <FormItem item={item} config={config} />);
  };
console.log(config);
  const form = () => (
    <Fragment>
      <SectionMessage title={config.collectorName || 'Issue Collector'} appearance="info">
      {<Text>{config.collectorDescription || ''}</Text>}
      </SectionMessage>
      <Form onSubmit={createIssue}>
    {error ? (<Text content={`Error: ${error}`} />
    ) : (<Text content="Please complete the fields below:" />)}
    <TextField label={config.renamedsummary || 'Summary'} name="summary" defaultValue={config.presetSummary} />
    <TextArea label={config.renameddescription || 'Description'} name="description" defaultValue={config.presetDescription} />
    {config.fields && fieldOptions && textFields()}
      </Form>
    </Fragment>
  );

  const success = () => (
    <Fragment>
      <SectionMessage title={config.collectorName || 'Issue Collector'} appearance="info">
              <Text>
              Created issue <Link href={`/browse/${issueKey}`}>{issueKey}</Link>
              </Text> 
      </SectionMessage>
      <Button 
        text="Create Another Issue"
        onClick={() => {setStep('form')}}
      />
    </Fragment>
  );

  const ui = {
    button,
    form,
    success
  };
  return ui[step]();
};

export const run = render(<Macro app={<App />} />);
