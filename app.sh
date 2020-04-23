#! /bin/bash
export KEYCLOAKIPRESOLVE='keycloak.gns3.fr'
echo $KEYCLOAKIPRESOLVE
node app.js > keycloak.json
npm start