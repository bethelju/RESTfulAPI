# RESTfulAPI
This is a RESTful API that utilizes GCP App Engine and Datastore to model relationships between lodgings and guests. 
The entities hold the following relationships:
* Lodgings can hold multiple guests 
* Lodgings are owned by particular users
* Users are identified by JWT's assigned using Google's third party OAuth system
* A user can only view and manipulate the lodgings that (s)he owns 

The app is located on GCP at the following root URL: https://restfulapi-278600.wl.r.appspot.com

The login page is located at: https://restfulapi-278600.wl.r.appspot.com/login

### Usage
To use, follow the OAuth pathway to retrieve a token for use in your authorization header when making calls to the API

Visit the wiki for a more thorough documentation on how to use!

Feel free to use the Postman tests in the tests folder for examples of API calls
