var keycloak = new Keycloak();

keycloak.init({
    onLoad: 'login-required',
    promiseType: 'native'
}).then(function (authenticated) {
    //alert(authenticated ? 'authenticated' : 'not authenticated');

    if (authenticated) {
        keycloak.updateToken(30).then(function (refreshed) {
            if (refreshed) {
                alert('Token was successfully refreshed');
            } else {
                alert('Token is still valid');
            }
        }).catch(function () {
            alert('Failed to refresh token');
        });
        var video = document.getElementById('video');
        video.src = '/output.m3u8';
        const options = {
            crossorigin: 'use-credentials',
            cors: 'Anonymous',
          }
        var player = videojs('my_video_1', options);

        window.setInterval(() =>{ 
            keycloak.updateToken(30).then(function () {
                console.log('update token');
            }).catch(function () {
                console.log('Failed to refresh token');
            });
        }, 30000 );




        /*if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource('/output.m3u8');
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = '/output.m3u8';
            video.addEventListener('loadedmetadata', function () {
                video.play();
            });
        }*/

    }

    ;
    //keycloak.login({

});

// keycloak.init({ promiseType: 'native' })
/*       .then(function(authenticated) {
    alert(authenticated ? 'authenticated' : 'not authenticated');

    keycloak.updateToken(30).then(function() {
      console.log('update token');
  }).catch(function() {
      alert('Failed to refresh token');
  });

  var video = document.getElementById('video');
  if(Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource('http://localhost:3000/output.m3u8');
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED,function() {
      video.play();
  });
 }
  else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = 'http://localhost:3000/output.m3u8';
    video.addEventListener('loadedmetadata',function() {
      video.play();
    });
  }


}).catch(function() {
    alert('failed to initialize');
});*/
