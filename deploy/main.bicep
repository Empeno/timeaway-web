@description('Name of the Static Web App')
param staticWebAppName string

@description('Location for the Static Web App')
param location string = resourceGroup().location

@description('SKU for the Static Web App')
param sku string = 'Free'

@description('GitHub repository URL')
param repositoryUrl string

@description('Branch to deploy from')
param branch string = 'main'

resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: sku
    tier: sku
  }
  properties: {
    repositoryUrl: repositoryUrl
    branch: branch
    databaseConnections: [
      {
        name: 'default'        
        configurationFiles: {
          fileName: 'staticwebapp.database.config.json'
          contents: null
          type: 'configuration'
        }
      }
    ]
  }
}

output staticWebAppUrl string = staticWebApp.properties.defaultHostname
