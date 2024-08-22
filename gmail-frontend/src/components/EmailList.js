import React from 'react';

const EmailList = ({ emails, onSelectEmail }) => {
  return (
    <div className="h-full overflow-auto p-4">
      <ul className="divide-y divide-gray-200">
        {emails.map((email) => (
          <li
            key={email.id}
            className="p-4 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelectEmail(email)}
          >
            <div className="font-semibold">
              {email.payload.headers.find(header => header.name === 'From')?.value}
            </div>
            <div className="text-gray-600">
              {email.payload.headers.find(header => header.name === 'Subject')?.value}
            </div>
            <div className="text-gray-500">
              {email.snippet}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailList;
