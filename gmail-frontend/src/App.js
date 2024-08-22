import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';

const App = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch('http://localhost:3001/emails');
        if (response.ok) {
          const data = await response.json();
          setEmails(data);
        }
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 mt-16 overflow-hidden">
        {/* Email List */}
        <div className="w-1/3 bg-gray-100 overflow-auto border-r border-gray-300">
          <EmailList emails={emails} onSelectEmail={setSelectedEmail} />
        </div>

        {/* Email Detail */}
        <div className="flex-1 bg-white overflow-auto p-4">
          <EmailDetail email={selectedEmail} />
        </div>
      </div>
    </div>
  );
};

export default App;
