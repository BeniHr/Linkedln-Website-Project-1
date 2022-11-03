function getNetworkUsers() {
   let getNetworkUsersRequest = fetch('https://random-data-api.com/api/v2/users?size=50');
   getNetworkUsersRequest
   .then((Response) => Response.json())
   .then((data) =>{
    networkUsers = data;
   })
    .catch((error) => {
        throw new Error();
   });
    
}

getNetworkUsers();
class NetworkUsers {
    constructor() {
        
    }
}
