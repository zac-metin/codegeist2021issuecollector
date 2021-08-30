# Forge Hello World

This project contains a Forge app written in Javascript that displays a Confluence macro to create issues. 

See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Modify your app by editing the `src/index.jsx` file.

- Build and deploy your app by running:
```
forge deploy
```

- Install your app in an Atlassian site by running:
```
forge install
```

- Develop your app by running `forge tunnel` to proxy invocations locally:
```
forge tunnel
```

### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.




## Inspiration

I think the key inspiration was the simple Feedback Collector in the example forge apps. The sample app opened up the idea of collecting customised issues easily within Confluence and just the possibilities of Forge in general

## What it does

In short, it lets you create highly configurable issue collector forms within Confluence Cloud,
  
The longer description is that it dynamically fetches the fields of the selected project and issue type to create an adaptive config menu where the user can customise the following:

- Which optional fields to include in the form (any field available for that project + issuetype combo)
- Ability to preset values for fields (and have the field show up for the user to edit, or hide and always set as preset)
- Ability to choose a custom label for each field to effectively rename it in the form

These configurations allow the presentation of the customised form for the Confluence users to fill out and create Jira issues

## How we built it

Looking to the feedback collector as an initial example, I looked into ways to use the Jira API to find out which fields are available for a specific project and issuetype. From there it was a process of using the available Forge Confluence Macro form inputs to adapt to the fields depending on their type.

## Challenges we ran into

The biggest challenge was figuring out how to code something flexible enough to adapt to all sorts of issuetype fields including customfields

## Accomplishments that we're proud of

The end result :) 

## What we learned

This definitely highlighted the capacities of Forge, so I learned what its capable of and am a lot more ready to use and implement it going forwards. Already have a few more ideas for projects but there's only so much time in the hackathon.

## What's next for IssueCollector for Confluence Cloud

I'm hoping to refine it and develop it into a Marketplace app