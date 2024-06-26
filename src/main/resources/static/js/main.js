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
const add_members_button = document.querySelector('#add-members');
const delete_member_button = document.querySelector('#delete-member');
const delete_member_page = document.querySelector('#delete-member-page');
const delete_member_form = document.querySelector('#delete-member-form');

const NewChatButton = document.querySelector('#NewChatButton');



const add_selected_members=document.querySelector('#add-selected-members')
const group_member_list= document.querySelector('#group-member-list');
const member_list = document.querySelector('#member-list');
const quit_members_button = document.querySelector('#quit-members');
const users_list_page = document.querySelector('#users-list-page');
// const users_to_add= document.querySelector('#users-list-page');
let checkedUssers = [];

let stompClient = null;
let email = null;
let fullName = null;
let selectedUserId = null;
let notifiedUser = null;
let password=null;

function connect(event) {
    email = document.querySelector('#email').value.trim();
    password = document.querySelector('#password').value.trim();

    if (email && password) {
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        //test if exists
        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}


async function onConnected() {
    stompClient.subscribe(`/user/${email}/queue/messages`, onMessageReceived);
    stompClient.subscribe(`/user/public`, onMessageReceived);
    stompClient.subscribe('/user/publiceo', onMessageReceived);

    stompClient.send("/app/user.addUser",
        {},
        JSON.stringify({email: email, password: password, status: 'ONLINE'})
    );

    const response = await fetch(`/user/${email}`);
    var fullName = await response.json();
    fullName = fullName.fullName;



    document.querySelector('#connected-user-fullName').textContent = fullName;
    usernamePage.classList.add('hidden');
    chatPage.classList.remove('hidden');
    // findAndDisplayAllUsers().then();
    // findAndDisplayAllGroups().then();
    
}

async function onMessageReceived(payload) {

    await findAndDisplayAllConversations('AllUsers',conversationItemClick);
    await findAndDisplayAllGroups();
    const message = JSON.parse(payload.body);



    if (selectedUserId) {
        document.querySelector(`#_${selectedUserId}`).classList.add('active');
    } else {
        messageForm.classList.add('hidden');
        chatname.classList.add('hidden');
   }

    if (message.chatId){//group message
        if (selectedUserId && parseInt(selectedUserId) === parseInt(message.recipientId)) {
            displayMessage(message.senderId, message.content);
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }else{//normal chat message
        if (selectedUserId && selectedUserId === message.senderId) {
            displayMessage(message.senderId, message.content);
            chatArea.scrollTop = chatArea.scrollHeight;
        }

    }


    

    if (message.recipientId === email) {
    var notifiedUser = document.querySelector(`#_${message.senderId}`);}
    else{
        var notifiedUser = document.querySelector(`#_${message.recipientId}`);
    }
    if (notifiedUser && !notifiedUser.classList.contains('active')) {
        const nbrMsg = notifiedUser.querySelector('.nbr-msg');
        nbrMsg.classList.remove('hidden');
        nbrMsg.textContent = '';
    }
}



    
    async function findAndDisplayAllGroups() {
        const response = await fetch(`/user/${email}/groups`);
        const groups = await response.json();
        const groupList = document.getElementById('AllUsers');

        groups.forEach(group => {
            const listItem = document.createElement('li');
            listItem.classList.add('user-item');
            listItem.id = "_"+group.id;

            const groupnameSpan = document.createElement('span');
            groupnameSpan.textContent = group.name;

            const groupImage = document.createElement('img');
            groupImage.src = '../img/group_icon.jpg';
            groupImage.alt = group.name;

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
        chatnamedisplay.textContent=parseInt(event.currentTarget.id.substring(1));
        deletegroupbutton.classList.remove('hidden');
        group_members_button.classList.remove('hidden');
        add_members_button.classList.remove('hidden');
        delete_member_button.classList.remove('hidden');

        messageForm.setAttribute('id', 'group_message_form');


        const clickedUser = event.currentTarget;
        clickedUser.classList.add('active');

        selectedUserId = parseInt(clickedUser.getAttribute('id').substring(1));
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
    chatname.classList.add('hidden');

    const AllUsersResponse = await fetch('/users');
    let AllUsers = await AllUsersResponse.json();
    AllUsers = AllUsers.filter(user => user.email !== email);
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
    listItem.id = "_"+user.email;

    const onlinedot = document.createElement('H1');
    onlinedot.textContent = '•';
    onlinedot.style.fontSize = '1.5em';
    const LastSeenSpan = document.createElement('span');

    
    if (user.status === 'ONLINE') {
        onlinedot.style.color = 'lime';
    } else {
        onlinedot.style.color = 'red';
        LastSeenSpan.textContent = "last seen "+user.lastLogin;
    
    }

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
    listItem.appendChild(LastSeenSpan)

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
    add_members_button.classList.add('hidden');
    delete_member_button.classList.add('hidden');

    messageForm.setAttribute('id', 'user_message_form');

    const clickedUser = event.currentTarget;
    clickedUser.classList.add('active');

    selectedUserId = clickedUser.getAttribute('id').substring(1);
    fetchAndDisplayUserChat().then();

    const nbrMsg = clickedUser.querySelector('.nbr-msg');
    nbrMsg.classList.add('hidden');
    nbrMsg.textContent = '0';
}

function displayMessage(senderId, content) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    if (senderId === email) {
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
    const userChatResponse = await fetch(`/messages/${email}/${selectedUserId}`);
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
            senderId: email,
            recipientId: selectedUserId,
            content: messageInput.value.trim(),
            timestamp: new Date()
        };
        stompClient.send("/app/chat.sendgroupmessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    else{
        const chatMessage = {
            senderId: email,
            recipientId: selectedUserId,
            content: messageInput.value.trim(),
            timestamp: new Date()
        };
        stompClient.send("/app/chat.sendmessage", {}, JSON.stringify(chatMessage));
        displayMessage(email, messageInput.value.trim());
        messageInput.value = '';
    }
}
    chatArea.scrollTop = chatArea.scrollHeight;
    event.preventDefault();
}




function onLogout() {
    stompClient.send(`/app/user.disconnectUser`,
        {},
        JSON.stringify({email: email, fullName: fullName, status: 'OFFLINE'})
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

    const groupPayload = {name: email};
    fetch(`/groups/${groupid}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(groupPayload)
    })

            .then(() => {
                console.log("Group deleted");
                messageForm.classList.add('hidden');
                chatname.classList.add('hidden');  //to fix
            });
        ;
    event.preventDefault();
        const groupList = document.getElementById('AllUsers');
        groupList.innerHTML = '';
        await findAndDisplayAllUsers('AllUsers',userItemClick);
        await findAndDisplayAllGroups();

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
    event.preventDefault();};

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
        add_members_button.addEventListener('click',addMembers,true)
        async function addMembers(event){
            // let groupid=chatnamedisplay.innerHTML;
            users_list_page.classList.remove('hidden');
            chatPage.classList.add('hidden');
            await findAndDisplayAllUsers('user-list-to-add',userItemClickGroup);
            event.preventDefault();
        }

        add_selected_members.addEventListener('click',addSelectedMembers,true);
        
        async function addSelectedMembers(event){
                event.preventDefault();

        let groupid=chatnamedisplay.innerHTML;
        const groupPayload = {
            users: checkedUssers
        };


        // Send the group payload to the server
        fetch(`groups/${groupid}/members`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(groupPayload)
        })
            .then(() => {
                // Show the chat page and hide the new group page
                chatPage.classList.remove('hidden');
                users_list_page.classList.add('hidden');
            });
            const groupList = document.getElementById('user-list-to-add');
            groupList.innerHTML = '';
    }

// delete member
delete_member_button.addEventListener('click',deleteMember,true);
async function deleteMember(event){
    delete_member_page.classList.remove('hidden');
    chatPage.classList.add('hidden');
}
delete_member_form.addEventListener('submit',deleteSelectedMember,true);
async function deleteSelectedMember(event){
    
    const memberid = document.querySelector('#member-id').value.trim();  
    let groupid=chatnamedisplay.innerHTML;
    const groupPayload = {name: email};
    fetch(`/groups/${groupid}/members/${memberid}`,
     {method: 'DELETE',headers: {'Content-Type': 'application/json'},
     body: JSON.stringify(groupPayload)});


    
    event.preventDefault();
    chatPage.classList.remove('hidden');
    delete_member_page.classList.add('hidden');
}



function userItemClickGroup(event) {
    const clickedUser = event.currentTarget;
    selectedUserId = clickedUser.getAttribute('id').substring(1);

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
    checkedUssers.push(email);
    // Create a payload object with the group name and selected user IDs
    
    const groupPayload = {
        name: groupName,
        creator:`${email}`,
        users: checkedUssers
    };
    // Send the group payload to the server

    //for Rest anotations
    fetch(`groups/`, {method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify(groupPayload) })
    
    //for realtime
    // stompClient.send("/app/groups", {}, JSON.stringify(groupPayload));

        // Clear the group name input and checked users list
        document.querySelector('#groupName').value = '';
        checkedUssers = [];
        document.querySelector('#NewGroupList').innerHTML = '';
        
        
        // Show the chat page and hide the new group page
        chatPage.classList.remove('hidden');
        newGroupPage.classList.add('hidden');
    } 


//new chat 
NewChatButton.addEventListener('click', newChat, true);
async function newChat(event) {
    chatPage.classList.remove('hidden');
    let AllUsersList = document.getElementById('AllUsers');
    AllUsersList.innerHTML = '';
    await findAndDisplayAllUsers('AllUsers',userItemClick);
    event.preventDefault();
}

async function findAndDisplayAllConversations(listid,functionName) {
    chatname.classList.add('hidden');


    const AllConversationsResponse = await fetch(`/user/${email}/conversations`);
    let AllConversations = await AllConversationsResponse.json();
    const AllConversationsList = document.getElementById(listid);
    if(listid == 'AllUsers'){
        AllConversationsList.innerHTML = '';
    }

    AllConversations.forEach(Conversation => {
        appendConversationElement(Conversation, AllConversationsList, functionName);
        if (AllConversations.indexOf(Conversation) < AllConversations.length - 1) {
            const separator = document.createElement('li');
            separator.classList.add('separator');
            AllConversationsList.appendChild(separator);
        }
    });
}
function appendConversationElement(Conversation, AllConversationsList, functionName) {

    const listItem = document.createElement('li');
    listItem.classList.add('user-item');
    listItem.id = "_"+Conversation.email;

    const onlinedot = document.createElement('H1');
    onlinedot.textContent = '•';
    onlinedot.style.fontSize = '1.5em';
    const LastSeenSpan = document.createElement('span');

    
    if (Conversation.status === 'ONLINE') {
        onlinedot.style.color = 'lime';
    } else {
        onlinedot.style.color = 'red';
        LastSeenSpan.textContent = "last seen "+Conversation.lastLogin;
    
    }

    const ConversationImage = document.createElement('img');
    ConversationImage.src = '../img/User_icon.png';
    ConversationImage.alt = Conversation.fullName;

    const ConversationnameSpan = document.createElement('span');
    ConversationnameSpan.textContent = Conversation.fullName;

    



    const receivedMsgs = document.createElement('span');
    receivedMsgs.textContent = '0';
    receivedMsgs.classList.add('nbr-msg', 'hidden');

    listItem.appendChild(ConversationImage);
    listItem.appendChild(ConversationnameSpan);
    listItem.appendChild(receivedMsgs);
    listItem.appendChild(onlinedot);
    listItem.appendChild(LastSeenSpan)

    listItem.addEventListener('click', functionName);
    AllConversationsList.appendChild(listItem);
}

function conversationItemClick(event) {
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
    add_members_button.classList.add('hidden');
    delete_member_button.classList.add('hidden');

    messageForm.setAttribute('id', 'user_message_form');

    const clickedUser = event.currentTarget;
    clickedUser.classList.add('active');

    selectedUserId = clickedUser.getAttribute('id').substring(1);

    const first = email < selectedUserId ? email : selectedUserId;
    const second = email < selectedUserId ? selectedUserId : email;
    const chatId = `${first}_${second}`;
    

    
    fetchAndDisplayConversationChat(chatId).then();

    const nbrMsg = clickedUser.querySelector('.nbr-msg');
    nbrMsg.classList.add('hidden');
    nbrMsg.textContent = '0';
}

async function fetchAndDisplayConversationChat(ConversationId) {
    const userChatResponse = await fetch(`/conversation/${ConversationId}/messages`);
    const userChat = await userChatResponse.json();
    chatArea.innerHTML = '';
    userChat.forEach(chat => {
        displayMessage(chat.senderId, chat.content);
    });
    chatArea.scrollTop = chatArea.scrollHeight;
}



usernameForm.addEventListener('submit', connect, true); // step 1
messageForm.addEventListener('submit', sendMessage, true);
logout.addEventListener('click', onLogout, true);
window.onbeforeunload = () => onLogout();

