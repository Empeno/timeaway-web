# TimeAway Web

![Build Status](https://img.shields.io/github/actions/workflow/status/Empeno/timeaway-web/main.yml?branch=main&label=Build%20Status)  
![Azure Static Web Apps](https://img.shields.io/badge/Azure-Static%20Web%20Apps-blue?logo=microsoftazure)  
![License](https://img.shields.io/github/license/Empeno/timeaway-web)  
![Last Commit](https://img.shields.io/github/last-commit/Empeno/timeaway-web)  
![Repo Size](https://img.shields.io/github/repo-size/Empeno/timeaway-web)  
![Contributors](https://img.shields.io/github/contributors/Empeno/timeaway-web)  


This repo also includes a **CI/CD workflow** to automate the deployment of the app to Azure Static Web Apps using a **Bicep template**.

---

## Indholdsfortegnelse

1. [Features](#features)
2. [Azure Static Web Apps CI/CD Workflow](#azure-static-web-apps-cicd-workflow)
   - [Workflow Overview](#workflow-overview)
   - [How to Trigger the Workflow Manually](#how-to-trigger-the-workflow-manually)
3. [Prerequisites](#prerequisites)
4. [Folder Structure](#folder-structure)
5. [Additional Notes](#additional-notes)

---

## Features

- **Vanilla JavaScript**: A simple starter app with no frameworks.
- **Dev Container Support**: Open the project in a [GitHub Codespace](https://github.com/features/codespaces) or using [VS Code with the Remote Containers extension](https://code.visualstudio.com/docs/remote/containers) to get a pre-configured development environment.
- **Azure Static Web Apps CI/CD Workflow**: Automates the deployment of the app and its infrastructure.

---

## Azure Static Web Apps CI/CD Workflow

This repository includes a GitHub Actions workflow to automate the deployment of an Azure Static Web App using a Bicep template.

### Workflow Overview

The workflow is defined in `.github/workflows/main.yml` and performs the following steps:

1. **Trigger Events**:
   - Automatically runs on `push` or `pull_request` events to the `main` branch.
   - Can also be triggered manually using the `workflow_dispatch` event.

2. **Steps**:
   - **Checkout Code**: Clones the repository to the GitHub Actions runner.
   - **Extract Static Web App Name**: Reads the Static Web App name from the `bicep/parameters.json` file.
   - **Deploy Bicep Template**: Deploys the Azure resources defined in the Bicep template.
   - **Retrieve API Key**: Fetches the API key for the Static Web App.
   - **Build and Deploy**: Builds and deploys the application to Azure Static Web Apps.

---

### How to Trigger the Workflow Manually

1. Go to the **Actions** tab in your GitHub repository.
2. Select the **Azure Static Web Apps CI/CD** workflow.
3. Click the **Run workflow** button.
4. Provide any required inputs (if applicable) and confirm to start the workflow.

---

## Prerequisites

Before running the workflow, ensure the following:

1. **Azure Service Principal**:
   - Configure the following secrets in your GitHub repository:
     - `AZURE_CLIENT_ID`
     - `AZURE_CLIENT_SECRET`
     - `AZURE_TENANT_ID`
   - These credentials are required to authenticate with Azure and deploy the resources.

2. **Static Web App API Token**:
   - Add the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret to your repository. This token is used to deploy the app to Azure Static Web Apps.

3. **Bicep Template**:
   - The Bicep template is located in the `bicep` folder and defines the Azure resources required for the Static Web App.

4. **jq**:
   - Ensure `jq` (a lightweight JSON processor) is installed on the runner. It is used to parse the `parameters.json` file.

---

## Folder Structure

```plaintext
timeaway-web/
├── bicep/
│   ├── main.bicep               # Bicep template for Azure resources
│   ├── parameters.json          # Parameters for the Bicep template
├── src/                         # Source code for the web app
├── .github/
│   ├── workflows/
│       ├── main.yml             # GitHub Actions workflow file
├── [README.md](http://_vscodecontentref_/1)                    # Project documentation
````

## Additional Notes

The workflow uses Azure CLI to deploy the Bicep template and manage Azure resources.
The parameters.json file contains the configuration for the Static Web App, including its name, location, and repository details.
The workflow is designed to follow Azure best practices for CI/CD and infrastructure deployment.
For more information, refer to the Azure Static Web Apps documentation.

