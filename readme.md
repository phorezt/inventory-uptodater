# Inventory UpToDater

Keeps the inventory up to date with your org's entity files on github.  
This is a PoC and so there is no module bundler, typescript compiler or anything fancy. Run it with `node index.js`.

## Pre-requisite

To get this code running it needs the following:

1. Setting up the github app for your organisation  
Do it here

2. Setting up the firebase project with a firestore db  
Download the service account and add the file as `firebase.json` in the root (it's in .gitignore)

For working locally:
3. You also need ngrok, smee.io or similar to serve localhost to the interwebz. And then the installed github app in the org needs to have that ngrok url updated in the settings on github.