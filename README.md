# trellomapper
Maps Trello cards to Google Maps

![Trellomapper](https://monosnap.com/file/jSyVqPBMwke9bW6l0FGwXG24F4bY9h.png)

# Pre Requisits

In order to build and run this project, you will need the following steps:

 1. Install npm and Grunt
	If you still don't have it, you need both npm and Grunt.
	* You can find the information and documentation about npm [here](https://docs.npmjs.com/about-npm).
	* You can find the information and documentation about Grunt [here](https://gruntjs.com/getting-started).
 2. Define the API keys needed
	You will API keys for Google Maps and Trello, once you have these keys, you need to create a file called `keys.json` in the main folder of the project. This file must have the following structure:
	```json
	{
		"trello": "<your trello API key>",
		"gmaps": "<your Google Maps API key>"
	}
	```

# Building & Running
Building this project is as simple as running:
```bash
$ npm install
```

After that, you can run the project with Grunt by running:
```bash
$ grunt
```

If everything works well, you should be able to access the project locally acessing `http://localhost:8080`
