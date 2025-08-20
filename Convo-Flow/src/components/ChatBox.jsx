import React from 'react';
import { Avatar } from 'antd';

export const ChatBoxReceiver = ({ avatar, user, message }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', marginBottom: 10 }}>
      <Avatar
        size={50}
        src={avatar}
        style={{ objectFit: 'cover' }}
      />
      <p style={{ padding: 10, backgroundColor: 'white', borderRadius: 10, maxWidth: "60%", marginLeft: 10 }}>
        <strong style={{ fontSize: 13 }}>
          {user}
        </strong><br />
        {message}
      </p>
    </div>
  );
};

export const ChatBoxSender = ({ avatar, user, message }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <p style={{ padding: 10, backgroundColor: '#8470F8', borderRadius: 10, maxWidth: "60%", marginLeft: 10 }}>
          <strong style={{ fontSize: 13 }}>
            {user}
          </strong><br />
          {message}
        </p>
        <Avatar
          size={50}
          src={avatar}
          style={{ objectFit: 'cover', marginLeft: 10 }}
        />
      </div>
    </div>
  );
};
