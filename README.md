# restful the lights
Restful API for a 16-light matrix.


#####To run: 
```
npm install
nodemon index.js
```
Then visit `localhost:8080/index` to see GUI lights controller

#####To check status of lights
HTTP *GET* 
`localhost:8080/api/query/[lightID]`
#####To set status of lights
HTTP *POST* `
localhost:8080/api/setLights/` with the following params
	* `lightID` - from 1 to 16
	* `state` - `1` or `0`


---------------------------------------

#####Later: 
	* Set more than one light at a time
	* init state of index.html checkbox by querying light states
	* serial communicationz 