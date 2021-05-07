# Complex Backend microservice

A project based on nodejs backend server microservices structure

## Usage

```bash
   $ npm install --save
```

## Scripts

-   ### Clean

```bash
   $ npm run clean
```

run this script to delete the dist folder

-   ### Build

```bash
   $ npm run build
```

run this script to compile the source code and create the dist folder

-   ### Start

```bash
   $ npm start:api
```

run this script to start the respective microservice

-   ### Serve

```bash
   $ npm run serve
```

run this script to generate a development server that watch the changes on the code

-   ### Deploy

```bash
   $ npm run deploy
```

run this script to do the clean, build and start at the same time

## Docs

### Authentication

This API use an baerer toke as authentication method using the JWT standar, you need to append a header "Authorization" to the request on querys or mutations 
that are protected by user policies, the format of this header is <code lang="js">"Authorization":"sdhfskhglkdnfghlkhsdflkshdkflsdlkfhksldhfknhflkshdflkshd"</code> by example.  

### Requests

Requests to the server must be made through the URLs: `http://localhost:81/api/`, May be Queries or Mutations over the data

### Query
The queries are selecctions of data over an entity in the system, can search por single objects, collections and nested objects trees

#### Parameters on queries:

-   **offset**: This parameter indicates the index where the data path begins.
-   **limit**: This parameter indicates the lenght of the array of data.
-   **order**: This parameter indicates the order of the array ascendent/descendent.
-   **orderField**: This parameter indicates the key or field by which the array will be ordered.

#### Example

In this case we'll make a request to the entity travels, to get travels collection, this will return the last 50 elements on the travels db collection.


Code:

```js
//Request
fetch("http://localhost:81/api/", {
    method: "POST",
    body:{
        query:`
            query{
                travels{
                    _id
                    pasengers
                    driver
                    vehicle
                    route
                }
            }
        `
    },
}).then((response) => {
	var respuesta = JSON.parse(response);
	console.log(response.data);
});
```

Response:

```js
        {
            "data": [
                {
                    "_id": "454-45sdffasd-asd2wa-123",
                    "passengers": 35,
                    "driver": "4584451-werq12-123esfdfg-232re",
                    "vehicle": "ndi1-2wu9je2e-wneid-2312",
                    "route": "97-q212er-71e17-dsf21"
                },
                {
                    "_id": "454-45sdffasd-asd2wa-123",
                    "passengers": 35,
                    "driver": "4584451-werq12-123esfdfg-232re",
                    "vehicle": "ndi1-2wu9je2e-wneid-2312",
                    "route": "97-q212er-71e17-dsf21"
                },
                {
                    "_id": "454-45sdffasd-asd2wa-123",
                    "passengers": 35,
                    "driver": "4584451-werq12-123esfdfg-232re",
                    "vehicle": "ndi1-2wu9je2e-wneid-2312",
                    "route": "97-q212er-71e17-dsf21"
                }
            ],
        }
```

### Mutations

The mutations alterate the data, create, update and delete operations are in this group of actions, to modify the collections of data

#### Examples
In this case we`ll make a new travel and recive the created object

Code:

```js
// we make the object with the data
var data = {
    passengers: 64,
    driver: "4584451-werq12-123esfdfg-232re",
    vehicle: "ndi1-2wu9je2e-wneid-2312",
    route: "97-q212er-71e17-dsf21"
};

//and make the request
fetch("http://localhost:81/api/", {
	method: "POST",
    body: `
        mutation{
            createTravel(newTravel: ${JSON.stringify(data)}){
                _id
                pasengers
                driver
                vehicle
                route
            }
        }
    `,
}).then((response) => {
	var respuesta = JSON.parse(response);
	console.log(response.data);
});
```

Response:

```js
        {
            "data":{
                "_id": "212ee-39j$%1wdfa-lsdkg31-4541",
                "passengers": 64,
                "driver": "4584451-werq12-123esfdfg-232re",
                "vehicle": "ndi1-2wu9je2e-wneid-2312",
                "route": "97-q212er-71e17-dsf21"
            }
        }
```

## Responses and errors

| Response              | Description                                                     | Message                             | Code |
| --------------------- | --------------------------------------------------------------- | ----------------------------------- | ---- |
| Ok                    | Everything was good and the response is expected as desired     | Ok                                  | 200  |
| Created               | The data its saved and the record created successfully          | Record created                      | 201  |
| Updated               | The record was successfuly updated and midificated              | Record updated                      | 201  |
| Deleted               | The record was deleted from the api                             | Record deleted                      | 200  |
| Empty                 | The resquest was good but the endpoint is empty                 | The entity is empty                 | 200  |
| Invalid ID            | The given ID doesn't have the correct numeric format            | The given ID is not valid           | 400  |
| Bad Request           | The route or the data have invalid format or doesn't exist      | Bad Request                         | 400  |
| Unauthorized          | The credentials are missing or are invalids                     | The credentials are invalids        | 401  |
| Forbidden             | The user doesn't have permissions to use this route             | You are not allow to use this route | 403  |
| Element Not Found     | The element requested doesn't exist                             | Element not found                   | 404  |
| Route Not Found       | The route requested doesn't exist                               | Route not found                     | 404  |
| Bad Format            | The format of the data is invalid                               | Format invalid                      | 406  |
| Internal Server Error | An error has ocurred on the server and the request was rejected | Internal server error               | 500  |

## Endpoints

-   **[Users](https://github.com/Duccem/ducen/tree/master/docs/Users "Users")**

