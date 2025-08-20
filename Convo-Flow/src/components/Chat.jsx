// src/components/Chat.js
//socket testing are
// backend msgs rendering is left
import React, { useEffect, useState } from "react";
import socket from "../socketService";
import { useParams } from "react-router-dom";
import axios from "axios";
// import '../signup.css';




const Chat = () => {
  const { chatId } = useParams();
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirect to the desired URL if token is missing
    window.location.href = 'http://localhost:3000/login'; // Replace with your desired URL
    return; // Stop further execution
  }
  
  const id = localStorage.getItem('id');
  const name = localStorage.getItem('username')
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  useEffect(() => {

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/chats/${chatId}/messages`);
        console.log(response.data);
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();



    // Join the chat room when the component mounts
    socket.emit("joinRoom", chatId);

    // Listen for incoming messages
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.off("message");
    };
  }, [chatId]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Send a new message
      socket.emit("newMessage", { chatId, content: newMessage, id });
      setNewMessage("");
    }
  };

  return (
    <div className="chat-container" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '90vh',
      width: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        textAlign: 'center',
        padding: '15px',
        margin: '0',
        backgroundColor: '#007bff',
        color: 'white',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px'
      }}>Chat Room</h2>

      <div style={{
        flex: '1',
        padding: '15px',
        overflowY: 'auto',
        // backgroundColor: 'white',
        borderBottom: '1px solid #ddd',
        borderRadius: '0 0 10px 10px'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            padding: '8px',
            marginLeft: msg.sender._id === id ? '30%' : '',
            marginRight: msg.sender._id === id ? '' : '30%',
            marginBottom: '20px',
            backgroundColor: msg.sender._id === id ? '#d1e7dd' : '#f1f1f1', // Conditional background color
            borderRadius: '8px',
            textAlign: msg.sender._id === id ? 'right' : 'left' // Conditional text alignment
          }}>
            <strong><a style={{
              textDecoration:"none",
              color:'#007bff'
            }} href={msg.sender._id === id ? '/UserProfile' : ''}>{msg.sender.name}</a>:</strong> {msg.content}
          </div>
        ))}
      </div>



      <div style={{
        display: 'flex',
        padding: '10px',
        backgroundColor: '#f0f2f5',
        borderTop: '1px solid #ddd',
        borderRadius: '0 0 10px 10px'
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          style={{
            flex: '3',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginRight: '10px',
            marginTop: '10px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '0px 0px',
            marginBottom: '15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            flex: '1',
            boxSizing: 'border-box'
          }}
        >
          Send
        </button>
      </div>
    </div>

  );



};




export default Chat;
