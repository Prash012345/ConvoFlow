# ConvoFlow-Real-time-chat-application
This is our first MERN STACK Project.

- User Registration and Authentication
POST /api/register

Description: Registers a new user.
Request Body:
json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
Response:
json
{
  "message": "User registered successfully",
  "userId": "string"
}

POST /api/login
Description: Authenticates a user.
Request Body:
json
{
  "email": "string",
  "password": "string"
}
Response:
json
{
  "token": "string",
  "userId": "string"
}

GET /api/user/
Description: Gets user details by ID.
Response:
json
{
  "userId": "string",
  "username": "string",
  "email": "string"
}
- Chat Management

GET /api/chats
Description: Retrieves a list of all chats for the authenticated user.
Response:
json
{
  "chats": [
    {
      "chatId": "string",
      "participants": ["userId1", "userId2"],
      "lastMessage": "string",
      "lastMessageTime": "timestamp"
    }
  ]
}

POST /api/chats
Description: Creates a new chat between users.
Request Body:
json
{
  "participants": ["userId1", "userId2"]
}
Response:
json
{
  "message": "Chat created",
  "chatId": "string"
}

- Message Management

GET /api/chats/messages
Description: Retrieves messages for a specific chat.
Response:
json
{
  "messages": [
    {
      "messageId": "string",
      "sender": "userId",
      "content": "string",
      "timestamp": "timestamp"
    }
  ]
}

POST /api/chats/messages
Description: Sends a message in a specific chat.
Request Body:
json
{
  "sender": "userId",
  "content": "string"
}
Response:
json
{
  "messageId": "string",
  "timestamp": "timestamp"
}

- Socket.io Events

join
Description: Join a specific chat room.
Data:
json
{
  "chatId": "string",
  "userId": "string"
}
message

Description: Send a message to a chat room.
Data:
json
{
  "chatId": "string",
  "sender": "userId",
  "content": "string"
}

receiveMessage
Description: Receive a message in a chat room.
Data:
json
{
  "chatId": "string",
  "sender": "userId",
  "content": "string",
  "timestamp": "timestamp"
}
