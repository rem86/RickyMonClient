var app = require('../../server/server');
var fs = require('../../server/param.json');
var gpu = require('../../common/models/gpu.json');

module.exports = function (Message) {
    var http = require('http');
    var options = {
      host: fs.LocalHash,
      path: fs.PathHash,
      port: fs.PortHash
    };


      function intervalFunc() {
              process.nextTick(function () {
          
                      var req = http.get(options, function (res) {
                      var bodyChunks = [];
                      res.on('data', function (chunk) {
                        bodyChunks.push(chunk);
                      }).on('end', function () {
          
                        var body = Buffer.concat(bodyChunks);
                        //console.log('BODY: ' + body);
                        body = JSON.parse(body);
                        // console.log('Hash: ' + body.bo.hashrate.total[0]);
          
                        gpu.properties.Lugar = fs.Lugar;
                        gpu.properties.NombrePC = fs.NombrePC;
                        gpu.properties.IP = fs.LocalHash;
                        gpu.properties.HashTotalPC = body.hashrate.total[0];
          
                        var i = 0;
                        var j = 0;
                        for (i = 0; i < fs.GPUs.length; i++) {
                          gpu.properties.Nro = i;
                          if (fs.GPUs[i] == 2) {
                            gpu.properties.HashNucleo1 = body.hashrate.threads[0 + j][0];
                            gpu.properties.HashNucleo2 = body.hashrate.threads[1 + j][0];
                            gpu.properties.HashGPU = Math.round((body.hashrate.threads[0 + j][0] + body.hashrate.threads[1 + j][0]) * 100) / 100
                            j = j + 2;
                          } else {
                            gpu.properties.HashNucleo1 = body.hashrate.threads[j][0];
                            gpu.properties.HashNucleo2 = 0;
                            gpu.properties.HashGPU = Math.round((body.hashrate.threads[j][0]) * 100) / 100
                            j = j + 1;
                          }
          
                          var gpuProp = gpu.properties;
                          gpuProp.Id = gpuProp.Lugar + '-' + gpuProp.NombrePC + '-' +gpuProp.Nro;
                          var request = require('request');
                          request.put('http://localhost:3000/api/GPUs/', {
                            json: {
                              "Id": gpuProp.Id,
                              "Lugar": gpuProp.Lugar,
                              "NombrePC": gpuProp.NombrePC,
                              "IP": gpuProp.IP,
                              "Nro": gpuProp.Nro,
                              "HashTotalPC": gpuProp.HashTotalPC,
                              "HashGPU": gpuProp.HashGPU,
                              "HashNucleo1": gpuProp.HashNucleo1,
                              "HashNucleo2": gpuProp.HashNucleo2,
                              "Temp": 0
                            }
                          }, function (error, response, body) {
          
                            if (!error && response.statusCode == 200) {
                              console.log(body);
                              console.log(response);
                              console.log(error);
                            }
                          });
                        }
                      });
                    }).on('error', function (e) {
                      console.log("Got an error: ", e);
                    });
          
                  req.on('error', function (e) {
                    console.log('ERROR: ' + e.message);
                  });

                });
          
      }
      
      setInterval(intervalFunc, fs.RefreshTime);

    };
