var keycloak = new Keycloak();

keycloak
  .init({
    onLoad: 'login-required',
    promiseType: 'native',
  })
  .then(function (authenticated) {
    if (authenticated) {
      var video = document.getElementById('video');
      video.src = '/output.m3u8';
      const options = {
        crossorigin: 'use-credentials',
        cors: 'Anonymous',
      };
      // Callback to include the new token after a refresh
      videojs.Hls.xhr.beforeRequest = function (options) {
        options.headers = options.headers || {};
        options.headers['Authorization'] = 'Bearer ' + keycloak.token; // set request auth token
        return options;
      };

      var player = videojs('my_video_1', options);

      window.setInterval(() => {
        keycloak
          .updateToken(10)
          .then((refreshed) => {
            if (refreshed) {
              console.log('Token was successfully refreshed');
            } else {
              console.log('Token is still valid');
            }
          })
          .catch(function () {
            console.log(
              'Failed to refresh the token, or the session has expired'
            );
          });
      }, 10000);
      keycloak.onTokenExpired = function () {
        console.log('Token is expired');
      };
    }
  });
