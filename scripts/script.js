let networkUsers = [];
let skills = {};
let positions = {};

let currentUser = {};

const maxDisplayedUsers = 10;

const networkFeedElement = document.getElementById('network');
const accountElement = document.getElementById('account');

function getNetworkUsers() {
    let getNetworkUsersRequest = fetch(
        'https://random-data-api.com/api/v2/users?size=51'
    );
    getNetworkUsersRequest
        .then((Response) => Response.json())
        .then((data) => {
            networkUsers = data;
            let currentDisplayedUsers = 0;

            currentUser = new NetworkUser(networkUsers[0]);
            createUserProfileElement(currentUser, accountInfoElement);
            // addAdditionalData()
            networkUsers = networkUsers.slice(1);

            for (let networkUser of networkUsers) {
                const user = new NetworkUser(networkUser);

                if (currentDisplayedUsers !== maxDisplayedUsers) {
                    createUserProfileElement(user, networkFeedElement);
                    currentDisplayedUsers++;
                }

                addSkillToList(user.employment.mainSkill);
                addPositionToList(user.employment.position);
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

function createUserProfileElement(user, parentElement) {
    if (!parentElement) {
        return;
    }

    const userProfileElement = document.createElement('div');
    userProfileElement.classList.add('user-profile');
    userProfileElement.id = `user-profile-${user.id}`;

    const userProfileAvatarElement = document.createElement('img');
    userProfileAvatarElement.classList.add('avatar');
    userProfileAvatarElement.src = user.personalData.avatar;
    userProfileAvatarElement.loading = 'lazy';

    userProfileElement.appendChild(userProfileAvatarElement);

    const userProfilePersonalDataElement = document.createElement('div');
    userProfilePersonalDataElement.classList.add('personal-data');

    const userProfilePersonalDataName = document.createElement('p');
    userProfilePersonalDataName.classList.add('full-name');

    const userFullName = document.createTextNode(
        `${user.personalData.firstName} ${user.personalData.lastName}`
    );

    userProfilePersonalDataName.appendChild(userFullName);

    if (parentElement === accountElement) {
        const userNameElement = document.createElement('span');
        const userNameText = document.createTextNode(
            `@${user.personalData.username}`
        );

        userNameElement.appendChild(userNameText);

        userProfilePersonalDataName.appendChild(userNameElement);

    }
    
    const userProfilePersonalDataJobTitle = document.createElement('p');
    userProfilePersonalDataJobTitle.classList.add('job-title');

    const userJobTitle = document.createTextNode(user.employment.position);
    userProfilePersonalDataJobTitle.appendChild(userJobTitle);

    userProfilePersonalDataElement.appendChild(userProfilePersonalDataName);
    userProfilePersonalDataElement.appendChild(userProfilePersonalDataJobTitle);

    userProfileElement.appendChild(userProfilePersonalDataElement);

    parentElement.appendChild(userProfileElement);
}

getNetworkUsers();
class NetworkUser {
    id;
    address;
    personalData;
    employment;

    constructor(data) {
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

    setUserEmploymentData(employmentData) {
        this.employment = {
            position: employmentData.title,
            mainSkill: employmentData.key_skill,
        };
    }
}
