let networkUsers = [];
let skills = {};
let positions = [];

function getNetworkUsers() {
    let getNetworkUsersRequest = fetch(
        'https://random-data-api.com/api/v2/users?size=50'
    );
    getNetworkUsersRequest
        .then((Response) => Response.json())
        .then((data) => {
            networkUsers = data;
            for (let networkUser of networkUsers) {
                const user = new NetworkUser(networkUser);
                addSkillToList(networkUser.employment.mainSkill);
                addPositionToList(networkUser.employment.position);
            }
        })
        .catch((error) => {
            throw new Error();
        });
}

function addSkillToList(skill) {
    if (skills[skill]) {
        skills[skill] += 1;
    } else {
        skills[skill] = 1;
    }
}

function addPositionToList(position) {
    if (positions[position]) {
        positions[position] += 1;
    } else {
        positions[position] = 1;
    }
}

getNetworkUsers();
class NetworkUsers {
    id;
    address;
    personalData;
    employment;

    constructor(data) {
        // console.log(data);
        this.id = data.id;

        this.setUserAddress(data.address);
        this.setUserPersonalData(data);
        this.setUserEmploymentData(data.employment);
    }
    setUserAddress(address) {
        this.address = {
            city: address.city,
            country: address.country,
            coordinates: address.coordinates,
        };
    }

    setUserPersonalData(data) {
        this.personalData = {
            firstName: data.first_name,
            lastName: data.last_name,
            dateOfBirth: data.date_of_birth,
            phoneNumber: data.phone_number,
            email: data.email,
            username: data.username,
            avatar: data.avatar,
        };
    }

    setUserEmploymentData(employment) {
        this.employment = {
            position: employment.tittle,
            mainSkill: employment.key_skill,
        };
    }
}
