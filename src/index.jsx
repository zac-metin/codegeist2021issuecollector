import ForgeUI, { render, Fragment, Macro, Text, Link, Button, Form, SectionMessage, useConfig, useProductContext, useState } from "@forge/ui";

import { requestJira, postJira } from "./utils/requestJira";

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
        const { fieldValue, validField } = formatIssue(field, formValues[field], config, fieldOptions);
        if(fieldValue && validField) {
          payload.fields[field] = fieldValue;
        }
      })
 
    if(config.presets) {
      config.presets.forEach((field) => {
        if(!Object.keys(formValues).includes(field)) {
          if(config[`preset${field}`]) {
            const { fieldValue, validField } = formatIssue(
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

    const response = await postJira("/rest/api/2/issue", payload);
    
    const responseBody = await response.json();
    if(!response.ok) {
      console.error(responseBody);
      const firstErrorMessage = responseBody.errorMessages[0];
      let errorMessage = firstErrorMessage ? firstErrorMessage : '';
      if(responseBody.errors) {
        const messageSeparator = ".";
        const additionalErrorText = Object.values(responseBody.errors).join(messageSeparator);
        if(additionalErrorText) {
          errorMessage = errorMessage ? errorMessage + messageSeparator + additionalErrorText : additionalErrorText;
        }
      }
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
      || option.name === "Description"));
      return selectedFieldOptions.map(item => <FormItem item={item} config={config} />);
  };

  const form = () => (
    <Fragment>
      <SectionMessage title={config.collectorName || 'Issue Collector'} appearance="info">
      {<Text>{config.collectorDescription || ''}</Text>}
      </SectionMessage>
      <Form onSubmit={createIssue}>
    {error ? (<Text content={`Error: ${error}`} />
    ) : (<Text content="Please complete the fields below:" />)}
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
