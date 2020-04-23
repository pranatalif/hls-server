var data = require('./keycloak1.json');
//Manipulate data
delete data['auth-server-url'];
data['auth-server-url'] =
  'http://' + process.env.KEYCLOAKIPRESOLVE + ':8080/auth';
//Output data
console.log(JSON.stringify(data));
