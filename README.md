# RESTfulAPI
This is a RESTful API that utilizes GCP App Engine and Datastore to model relationships between lodgings and guests. 
The entities hold the following relationships:
* Lodgings can hold multiple guests 
* Lodgings are owned by particular users
* Users are identified by JWT's assigned using Google's third party OAuth system
* A user can only view and manipulate the lodgings that (s)he owns 

The app is located on GCP at the following root URL: https://restfulapi-278600.wl.r.appspot.com

The login page is located at: https://restfulapi-278600.wl.r.appspot.com/login
### Entities
__Guests__ have the following attributes:
* ID assigned by Cloud Datastore
* First name (f_name)
* Last name (l_name)
* Dietary restrictions (dietary_restrictions)
* Lodging resided in (carrier)  

The API allows you to do the following actions with __Guests__:  
* Create a Guest (POST /guests)
* Get a Guest (GET /guests/:id)
* Get all Guests (GET /guests)  
* Partially edit a Guest (PATCH /guests/:id)  
* Completely edit a Guest (PUT /guests/:id)    
* Delete a Guest  (DELETE /guests/:id)  

Below is a sample guest:    
![Guest Image](https://imgur.com/f1bZZZA.png)  

__Lodgings__ have the following attributes:
* ID assigned by Cloud Datastore  
* Lodging name (name)  
* Type of Lodging (type)
* User Owner (owner)
* Size of Lodging (size)  
* Guests Array (guests)  

The API allows you to do the following actions with __Lodgings__:  
* Create a Lodging (POST /lodgings)
* Get a Lodging (GET /lodgings/:id)
* Get all Lodgings (GET /lodgings)  
* Partially edit a Lodging (PATCH /lodgings/:id)  
* Completely edit a Lodging (PUT /lodgings/:id)    
* Delete a Guest (DELETE /lodgings/:id)
* Place a Guest in a Lodging (PUT /lodgings/:id/guests/:id)
* Remove a Guest from a Lodging (DELETE /lodgings/:id/guests/:id)

Below is a sample lodging:  
![Lodging Image](https://imgur.com/ob5N0UJ.png)

### Usage
To use, follow the OAuth pathway to retrieve a token for use in your authorization header when making calls to the API

Visit the wiki for a more thorough documentation on how to use!

Feel free to use the Postman tests in the tests folder for examples of API calls
