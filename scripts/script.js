let networkUsers = [];
let skills = {};
let positions = {};

// let plans = {};
// let planStatusIs = {};

// active, blocked, idle, pending

let currentUser = {};

const maxDisplayedUsers = 10;
let totalPages = 0;
let currentPage = 1;
let MostPopularSkill = '';

const networkFeedElement = document.getElementById('network');
const networkFeedResultNumberElement =
    document.getElementById('results-number');
const networkFeedPaginationElement =
    document.getElementById('network-pagination');
const accountElement = document.getElementById('account');

function getNetworkUsers() {
    let getNetworkUsersRequest = fetch(
        'https://random-data-api.com/api/v2/users?size=90'
    );
    getNetworkUsersRequest
        .then((Response) => Response.json())
        .then((data) => {
            networkUsers = data;

            currentUser = new NetworkUser(networkUsers[0]);
            createUserProfileElement(currentUser, accountElement);
            networkUsers = networkUsers.slice(1);
            totalPages = Math.ceil(networkUsers.length / maxDisplayedUsers);

            getPagesConfiguration();

            for (let networkUser of networkUsers) {
                const user = new NetworkUser(networkUser);

                addSkillToList(user.employment.mainSkill);
                addPositionToList(user.employment.position);

                // addPlanToList(user.subscription.plan);
                // addStatusToList(user.subscription.status);
            }

            findMostPopularSkill();

            generateNetworkFeed();
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

function findMostPopularSkill() {
    let MostPopularSkillCount = 0;

    for (let skill in skills) {
        if (skills[skill] > MostPopularSkillCount) {
            MostPopularSkillCount = skills[skill];
            MostPopularSkill = skill;
        }
    }
}

function addPositionToList(position) {
    if (positions[position]) {
        positions[position] += 1;
    } else {
        positions[position] = 1;
    }
}

// function addPlanToList(plan) {
//     if (plans[plan]) {
//         plans[plan] += 1;
//     } else {
//         plans[plan] = 1;
//     }
// }

// function addStatusToList(status) {
//     if (planStatusIs[status]) {
//         planStatusIs[status] += 1;
//     } else {
//         planStatusIs[status] = 1;
//     }
// }

function clearNetworkFeed() {
    networkFeedElement.innerHTML = '';
}

function generateNetworkFeed() {
    const startingIndex = (currentPage - 1) * maxDisplayedUsers;
    const endingIndex =
        currentPage === totalPages
            ? networkUsers.length - 1
            : currentPage * maxDisplayedUsers - 1;

    for (let index = startingIndex; index < endingIndex; index++) {
        const user = new NetworkUser(networkUsers[index]);
        createUserProfileElement(user, networkFeedElement);
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

    const userProfilePersonalDataJobTitle = document.createElement('p');
    userProfilePersonalDataJobTitle.classList.add('job-title');

    const userJobTitle = document.createTextNode(
        user.employment.mainSkill + ' @ ' + user.employment.position
    );
    userProfilePersonalDataJobTitle.appendChild(userJobTitle);

    userProfilePersonalDataElement.appendChild(userProfilePersonalDataName);
    userProfilePersonalDataElement.appendChild(userProfilePersonalDataJobTitle);

    userProfileElement.appendChild(userProfilePersonalDataElement);

    const userPlanElement = document.createElement('div');
    userPlanElement.classList.add(
        'subscription-plan',
        user.subscription.status.toLowerCase()
    );

    const userPlanText = document.createTextNode(user.subscription.plan);

    userPlanElement.appendChild(userPlanText);

    userProfileElement.appendChild(userPlanElement);

    if (parentElement === accountElement) {
        const userNameElement = document.createElement('span');
        const userNameText = document.createTextNode(
            ` @${user.personalData.username}`
        );

        userNameElement.appendChild(userNameText);

        userProfilePersonalDataName.appendChild(userNameElement);

        const userBioElement = document.createElement('p');
        userBioElement.classList.add('bio');

        const userBioText = document.createTextNode(
            `I am a ${user.employment.mainSkill} ${user.employment.position} from ${user.address.city}, ${user.address.country}.`
        );

        userBioElement.appendChild(userBioText);
        userProfilePersonalDataName.appendChild(userBioElement);
    }

    if (user.employment.mainSkill === MostPopularSkill) {
        const popularSkillElement = document.createElement('div');
        popularSkillElement.classList.add('popular-skill');
        const popularSkillText = document.createTextNode('Popular Skill');
        popularSkillElement.appendChild(popularSkillText);

        userProfileElement.appendChild(popularSkillElement);
    }

    parentElement.appendChild(userProfileElement);
}

function getPagesConfiguration() {
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        const pageNumberElement = document.createElement('div');
        pageNumberElement.classList.add('page-number');

        pageNumberElement.setAttribute('data-page', pageNumber);

        if (pageNumber === currentPage) {
            pageNumberElement.classList.add('active');
        }

        const pageNumberText = document.createTextNode(pageNumber);
        pageNumberElement.appendChild(pageNumberText);

        pageNumberElement.addEventListener('click', (event) => {
            const page = parseInt(event.target.getAttribute('data-page'));
            // const page = parseInt(event.target.innerext)
            if (page === currentPage) {
                return;
            }
            currentPage = page;
            setResultsNumberElement();

            const currentActivePageElement = document.querySelector(
                '.page-number.active'
            );
            currentActivePageElement.classList.remove('active');
            clearNetworkFeed();

            event.target.classList.add('active');
            generateNetworkFeed();
        });

        networkFeedPaginationElement.appendChild(pageNumberElement);
    }

    setResultsNumberElement();
}

function setResultsNumberElement() {
    const startingNumber = (currentPage - 1) * maxDisplayedUsers + 1;
    const endingNumber =
        currentPage === totalPages
            ? networkUsers.length
            : currentPage * maxDisplayedUsers;

    networkFeedResultNumberElement.textContent = `Showing users from ${startingNumber} to ${endingNumber} out of ${networkUsers.length}`;
}

getNetworkUsers();
class NetworkUser {
    id;
    address;
    personalData;
    employment;
    subscription;

    constructor(data) {
        this.id = data.id;

        this.setUserAddress(data.address);
        this.setUserPersonalData(data);
        this.setUserEmploymentData(data.employment);
        this.setUserSubscriptionData(data.subscription);
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

    setUserSubscriptionData(subscriptionData) {
        this.subscription = {
            plan: subscriptionData.plan,
            status: subscriptionData.status,
        };
    }
}
