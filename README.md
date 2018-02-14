# AntidoteDB Web Shell

A demonstrative web shell for [AntidoteDB][antidote].   

## Getting started

Requirements: [node.js 8][nodejs], [npm][npm], [Antidote][antidote-setup].  
To build it: `make` (or `npm install`).  
To run it with a local cluster of Docker containers: `make run`.  

To start a local Docker deployment of AntidoteDB: `docker-compose -f docker/docker-antidote-3dcs.yml up`.  
To run the web server (which will listen on `localhost:3000`): `DEBUG=antidote-web-shell:* npm start`.  

It uses the AntidoteDB configuration specified in `config.js`.  

## Credits

[RainbowFS][rainbowfs] and [LightKone][lightkone] research projects.

 [antidote]: http://syncfree.github.io/antidote/
 [rainbowfs]: http://rainbowfs.lip6.fr/
 [lightkone]: https://www.lightkone.eu/
 [nodejs]: https://nodejs.org/
 [npm]: https://www.npmjs.com/
 [antidote-setup]: http://syncfree.github.io/antidote/setup.html

