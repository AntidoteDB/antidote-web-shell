# AntidoteDB Web Shell

A demonstrative web shell for [Antidote][antidote].   

## Getting started

Requirements: [node.js 8][nodejs], [npm][npm], [Antidote][antidote-setup].  
To compile it: `npm install`.  
To start a test environment deployment of AntidoteDB: `docker-compose -f docker/docker-antidote-3dcs.yml up`.  
To run it for debugging purposes: `DEBUG=antidote-web-shell:* npm start`.  
It uses the AntidoteDB configuration specified in `config.js`.  


## Credits

[RainbowFS][rainbowfs] and [LightKone][lightkone] research projects.

 [antidote]: http://syncfree.github.io/antidote/
 [rainbowfs]: http://rainbowfs.lip6.fr/
 [lightkone]: https://www.lightkone.eu/
 [nodejs]: https://nodejs.org/
 [npm]: https://www.npmjs.com/
 [antidote-setup]: http://syncfree.github.io/antidote/setup.html

