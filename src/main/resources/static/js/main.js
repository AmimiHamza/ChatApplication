'use strict';

const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const newGroupPage = document.querySelector('#NewGroup-page');
const group_members_page= document.querySelector('#group-members-div');
newGroupPage.classList.add('hidden');

const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const connectingElement = document.querySelector('.connecting');
const chatArea = document.querySelector('#chat-messages');
const logout = document.querySelector('#logout');
const onlinedot = document.createElement('H1');
const NewGroupButton = document.querySelector('#NewGroupButton');
const newGroupForm = document.querySelector('#NewGroupForm');
const chatname= document.querySelector('#chat-name');
const chatnamedisplay= document.querySelector('#chat-name-display');

const deletegroupbutton = document.querySelector('#deletegroupbutton');
const group_members_button = document.querySelector('#group-members');
const group_member_list= document.querySelector('#group-member-list');
const member_list = document.querySelector('#member-list');
const quit_members_button = document.querySelector('#quit-members');
let checkedUssers = [];

let stompClient = null;
let nickname = null;
let fullname = null;
let selectedUserId = null;
let notifiedUser = null;

function connect(event) {
    nickname = document.querySelector('#nickname').value.trim();
    fullname = document.querySelector('#fullname').value.trim();

    if (nickname && fullname) {
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}


function onConnected() {
    stompClient.subscribe(`/user/${nickname}/queue/messages`, onMessageReceived);
    stompClient.subscribe(`/user/public`, onMessageReceived);
    stompClient.subscribe('/user/publiceo', onMessageReceived);

    stompClient.send("/app/user.addUser",
        {},
        JSON.stringify({nickName: nickname, fullName: fullname, status: 'ONLINE'})
    );
    document.querySelector('#connected-user-fullname').textContent = fullname;
    usernamePage.classList.add('hidden');
    chatPage.classList.remove('hidden');
    findAndDisplayAllUsers().then();
    findAndDisplayAllGroups().then();
    
}

async function onMessageReceived(payload) {

    await findAndDisplayAllUsers('AllUsers',userItemClick);
    await findAndDisplayAllGroups();
    const message = JSON.parse(payload.body);



    if (selectedUserId) {
        document.querySelector(`#${selectedUserId}`).classList.add('active');
    } else {
        messageForm.classList.add('hidden');
        chatname.classList.add('hidden');
   }


    if (selectedUserId && selectedUserId === message.senderId && nickname===message.recipientId) {
        displayMessage(message.senderId, message.content);
        chatArea.scrollTop = chatArea.scrollHeight;
    }else if(selectedUserId && selectedUserId === message.recipientId){
        displayMessage(message.senderId, message.content);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    if (message.recipientId === nickname) {
    var notifiedUser = document.querySelector(`#${message.senderId}`);}
    else{
        var notifiedUser = document.querySelector(`#${message.recipientId}`);
    }
    if (notifiedUser && !notifiedUser.classList.contains('active')) {
        const nbrMsg = notifiedUser.querySelector('.nbr-msg');
        nbrMsg.classList.remove('hidden');
        nbrMsg.textContent = '';
    }
}



    
    async function findAndDisplayAllGroups() {
        const response = await fetch(`/user/${nickname}/groups`);
        const groups = await response.json();
        const groupList = document.getElementById('AllUsers');

        groups.forEach(group => {
            const listItem = document.createElement('li');
            listItem.classList.add('user-item');
            listItem.id = group.id;

            const groupnameSpan = document.createElement('span');
            groupnameSpan.textContent = group.name;

            const groupImage = document.createElement('img');
            groupImage.src = '../img/group_icon.jpg';
            groupImage.alt = group.fullName;

            const receivedMsgs = document.createElement('span');
            receivedMsgs.textContent = '0';
            receivedMsgs.classList.add('nbr-msg', 'hidden');

            listItem.appendChild(groupImage);
            listItem.appendChild(groupnameSpan);
            listItem.appendChild(receivedMsgs);
            groupList.appendChild(listItem);

            const separator = document.createElement('li');
            separator.classList.add('separator');
            groupList.appendChild(separator);



            listItem.addEventListener('click', groupItemClick);
        });
    

    function groupItemClick(event) {
        document.querySelectorAll('.user-item').forEach(item => {
            item.classList.remove('active');
        });
        messageForm.classList.remove('hidden');
        chatname.classList.remove('hidden');
        chatnamedisplay.textContent=event.currentTarget.id;
        console.log(event.currentTarget)
        deletegroupbutton.classList.remove('hidden');
        group_members_button.classList.remove('hidden');

        messageForm.setAttribute('id', 'group_message_form');


        const clickedUser = event.currentTarget;
        clickedUser.classList.add('active');

        selectedUserId = clickedUser.getAttribute('id');
        fetchAndDisplayGroupChat().then();
        const nbrMsg = clickedUser.querySelector('.nbr-msg');
        nbrMsg.classList.add('hidden');
        nbrMsg.textContent = '0';

        
    }

    async function fetchAndDisplayGroupChat() {
        const userChatResponse = await fetch(`/groups/${selectedUserId}/messages`);
        const userChat = await userChatResponse.json();
        chatArea.innerHTML = '';
        userChat.forEach(chat => {
        displayMessage(chat.senderId, chat.content);
        });
        chatArea.scrollTop = chatArea.scrollHeight;
    }
}

async function findAndDisplayAllUsers(listid,functionName) {
    const AllUsersResponse = await fetch('/users');
    let AllUsers = await AllUsersResponse.json();
    AllUsers = AllUsers.filter(user => user.nickName !== nickname);
    const AllUsersList = document.getElementById(listid);
    if(listid == 'AllUsers'){
        AllUsersList.innerHTML = '';
    }

    AllUsers.forEach(user => {
        appendUserElement(user, AllUsersList, functionName);
        if (AllUsers.indexOf(user) < AllUsers.length - 1) {
            const separator = document.createElement('li');
            separator.classList.add('separator');
            AllUsersList.appendChild(separator);
        }
    });
}

function appendUserElement(user, AllUsersList, functionName) {

    const listItem = document.createElement('li');
    listItem.classList.add('user-item');
    listItem.id = user.nickName;

    const onlinedot = document.createElement('H1');
    onlinedot.textContent = '•';
    onlinedot.style.fontSize = '1.5em';
    if (user.status === 'ONLINE') {
        onlinedot.style.color = 'lime';
    } else {
        onlinedot.style.color = 'red';}

    const userImage = document.createElement('img');
    userImage.src = '../img/user_icon.png';
    userImage.alt = user.fullName;

    const usernameSpan = document.createElement('span');
    usernameSpan.textContent = user.fullName;

    const checked = document.createElement('H1');
    checked.textContent = '•';
    checked.style.fontSize = '2.5em';
    checked.style.color = 'black';
    checked.classList.add('checked', 'hidden');

    const receivedMsgs = document.createElement('span');
    receivedMsgs.textContent = '0';
    receivedMsgs.classList.add('nbr-msg', 'hidden');

    listItem.appendChild(checked);
    listItem.appendChild(userImage);
    listItem.appendChild(usernameSpan);
    listItem.appendChild(receivedMsgs);
    listItem.appendChild(onlinedot);

    listItem.addEventListener('click', functionName);

    AllUsersList.appendChild(listItem);
}

function userItemClick(event) {
    group_members_page.classList.add('hidden');
    chatPage.classList.remove('hidden');
    document.querySelectorAll('.user-item').forEach(item => {
        item.classList.remove('active');
    });
    messageForm.classList.remove('hidden');

    chatname.classList.remove('hidden');
    chatnamedisplay.textContent=event.currentTarget.id;
    deletegroupbutton.classList.add('hidden');
    group_members_button.classList.add('hidden')

    messageForm.setAttribute('id', 'user_message_form');

    const clickedUser = event.currentTarget;
    clickedUser.classList.add('active');

    selectedUserId = clickedUser.getAttribute('id');
    fetchAndDisplayUserChat().then();

    const nbrMsg = clickedUser.querySelector('.nbr-msg');
    nbrMsg.classList.add('hidden');
    nbrMsg.textContent = '0';
}

function displayMessage(senderId, content) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    if (senderId === nickname) {
        messageContainer.classList.add('sender');
    } else {
        messageContainer.classList.add('receiver');
    }
    const messagespan = document.createElement('span');

    

    const contentp = document.createElement('p');
    contentp.textContent = senderId + ': ' + content;
    
    messagespan.appendChild(contentp);
    
    messageContainer.appendChild(messagespan);
    chatArea.appendChild(messageContainer);
}

async function fetchAndDisplayUserChat() {
    const userChatResponse = await fetch(`/messages/${nickname}/${selectedUserId}`);
    const userChat = await userChatResponse.json();
    chatArea.innerHTML = '';
    userChat.forEach(chat => {
        displayMessage(chat.senderId, chat.content);
    });
    chatArea.scrollTop = chatArea.scrollHeight;
}


function onError() {
    connectingElement.textContent = 'Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


function sendMessage(event) {
    const messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
    if(messageForm.id === 'group_message_form'){
        const chatMessage = {
            senderId: nickname,
            recipientId: selectedUserId,
            content: messageInput.value.trim(),
            timestamp: new Date()
        };
        stompClient.send("/app/chat.sendgroupmessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    else{
        const chatMessage = {
            senderId: nickname,
            recipientId: selectedUserId,
            content: messageInput.value.trim(),
            timestamp: new Date()
        };
        stompClient.send("/app/chat.sendmessage", {}, JSON.stringify(chatMessage));
        displayMessage(nickname, messageInput.value.trim());
        messageInput.value = '';
    }
}
    chatArea.scrollTop = chatArea.scrollHeight;
    event.preventDefault();
}




function onLogout() {
    stompClient.send("/app/user.disconnectUser",
        {},
        JSON.stringify({nickName: nickname, fullName: fullname, status: 'OFFLINE'})
    );
    window.location.reload();
}
//group chat
NewGroupButton.addEventListener('click', createGroup, true);
async function createGroup(event) {
    newGroupPage.classList.remove('hidden');
    chatPage.classList.add('hidden');
    event.preventDefault();
    await findAndDisplayAllUsers('NewGroupList',userItemClickGroup);

}

deletegroupbutton.addEventListener('click', deleteGroup, true);

async function deleteGroup(event) {
    let groupid=chatnamedisplay.innerHTML;

    const groupPayload = {name: nickname};
    fetch(`/groups/${groupid}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(groupPayload)
    })

            .then(() => {
                console.log("Group deleted");
            });
        ;
    event.preventDefault();
        const groupList = document.getElementById('AllUsers');
        groupList.innerHTML = '';
        await findAndDisplayAllUsers('AllUsers',userItemClick);
        await findAndDisplayAllGroups();
        chatArea.classList.add('hidden');

}

quit_members_button.addEventListener('click',quitGroup,true);
function quitGroup(event){
    group_members_page.classList.add('hidden');
    chatPage.classList.remove('hidden');
    event.preventDefault();

}
group_members_button.addEventListener('click',showmembers,true)
async function showmembers(event){

    let groupid=chatnamedisplay.innerHTML;
    group_members_page.classList.remove('hidden');
    chatPage.classList.add('hidden');
    await findAndDisplayGroupMembers(groupid,group_member_list,userItemClick);
    event.preventDefault();

        };

        async function findAndDisplayGroupMembers(groupid,member_list,functionName) {
            const AllUsersResponse = await fetch(`/groups/${groupid}/users`);
            let AllUsers = await AllUsersResponse.json();
            member_list.innerHTML = '';
        
            AllUsers.forEach(user => {
                appendUserElement(user, member_list, functionName);
                if (AllUsers.indexOf(user) < AllUsers.length - 1) {
                    const separator = document.createElement('li');
                    separator.classList.add('separator');
                    member_list.appendChild(separator);
                }
            });
        }
        

function userItemClickGroup(event) {
    const clickedUser = event.currentTarget;
    selectedUserId = clickedUser.getAttribute('id');

    // Check if the user is already checked
    const isChecked = checkedUssers.includes(selectedUserId);

    if (isChecked) {
        // User is already checked, remove them from the checked users list
        const index = checkedUssers.indexOf(selectedUserId);
        if (index !== -1) {
            checkedUssers.splice(index, 1);
        }
        // Hide the checked indicator
        const checked = clickedUser.querySelector('.checked');
        checked.classList.add('hidden');
    } else {
        // User is not checked, add them to the checked users list
        checkedUssers.push(selectedUserId);
        // Show the checked indicator
        const checked = clickedUser.querySelector('.checked');
        checked.classList.remove('hidden');
    }
}

// Add event listener for form submission
newGroupForm.addEventListener('submit', onSubmitGroupForm);

// Function to handle form submission
function onSubmitGroupForm(event) {
    event.preventDefault();

    // Get the group name from the form
    const groupName = document.querySelector('#groupName').value.trim();
    //add the current user to the group
    checkedUssers.push(nickname);
    // Create a payload object with the group name and selected user IDs
    
    const groupPayload = {
        name: groupName,
        creator:`${nickname}`,
        users: checkedUssers
    };

    // Send the group payload to the server
    stompClient.send("/app/group.groups", {}, JSON.stringify(groupPayload));
        // Optionally, display a message indicating that the group has been created

        // Clear the group name input and checked users list
        document.querySelector('#groupName').value = '';
        checkedUssers = [];
        
        // Show the chat page and hide the new group page
        chatPage.classList.remove('hidden');
        newGroupPage.classList.add('hidden');
    } 





usernameForm.addEventListener('submit', connect, true); // step 1
messageForm.addEventListener('submit', sendMessage, true);
logout.addEventListener('click', onLogout, true);
window.onbeforeunload = () => onLogout();

