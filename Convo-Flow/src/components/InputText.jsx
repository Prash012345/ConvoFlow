import React, { useState } from 'react';
import { PictureOutlined } from '@ant-design/icons'; // Ant Design Icons

const styles = {
  button: {
    width: '10%',
    height: 50,
    fontWeight: 'bold',
    borderRadius: 10,
    fontSize: 18,
    backgroundColor: '#34b7f1',
    borderWidth: 0,
    color: '#fff',
    cursor: 'pointer'
  },
  textarea: {
    width: 'calc(100% - 80px)', // Adjust width to take whole area minus button width
    height: 50,
    borderRadius: 10,
    borderWidth: 0,
    padding: 10,
    fontSize: 20,
    resize: 'none'
  },
  textContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%' // Ensure full width
  },
  iconButton: {
    marginRight: 10,
    fontSize: '18px',
    color: '#34b7f1',
    cursor: 'pointer'
  }
};

export default function InputText({ addMessage }) {
  const [message, setMessage] = useState('');

  function addAMessage() {
    addMessage({ message });
    setMessage('');
  }

  return (
    <div style={styles.textContainer}>
      <PictureOutlined style={styles.iconButton} />
      <textarea
        style={styles.textarea}
        rows={6}
        placeholder="Enter message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button
        onClick={addAMessage}
        style={styles.button}
      >
        SEND
      </button>
    </div>
  );
}
