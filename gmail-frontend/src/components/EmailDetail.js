import React from 'react';

const EmailDetail = ({ email }) => {
  if (!email) return <div>Select an email to view details</div>;

  const from = email.payload.headers.find(header => header.name === 'From')?.value;
  const subject = email.payload.headers.find(header => header.name === 'Subject')?.value;
  const date = email.payload.headers.find(header => header.name === 'Date')?.value;

  const decodeBase64 = (str) => {
    try {
      return atob(str.replace(/_/g, '/').replace(/-/g, '+'));
    } catch (e) {
      console.error('Error decoding Base64:', e);
      return 'Error decoding content.';
    }
  };

  const getEmailBody = () => {
    // Prefer HTML content, fallback to plain text if HTML is not available
    const part = email.payload.parts?.find(part => part.mimeType === 'text/html') ||
                 email.payload.parts?.find(part => part.mimeType === 'text/plain');
    if (part && part.body && part.body.data) {
      return decodeBase64(part.body.data);
    }
    return 'No content available.';
  };

  const getAttachments = () => {
    const attachments = [];
    email.payload.parts?.forEach(part => {
      if (part.filename && part.body && part.body.data) {
        attachments.push({
          filename: part.filename,
          data: decodeBase64(part.body.data),
        });
      }
    });
    return attachments;
  };

  const getEmbeddedImages = () => {
    const images = [];
    email.payload.parts?.forEach(part => {
      if (part.mimeType.startsWith('image/') && part.body?.data) {
        images.push({
          mimeType: part.mimeType,
          data: decodeBase64(part.body.data),
        });
      }
    });
    return images;
  };

  return (
    <div className="h-full overflow-auto p-4">
      <h1 className="text-2xl font-bold">{subject}</h1>
      <p className="text-gray-600">From: {from}</p>
      <p className="text-gray-500">Date: {new Date(date).toLocaleString()}</p>
      
      <div className="mt-4">
        {/* Render email body */}
        <div dangerouslySetInnerHTML={{ __html: getEmailBody() }} />
      </div>

      <div className="mt-4">
        {/* Render attachments */}
        {getAttachments().map((attachment, index) => (
          <a
            key={index}
            href={`data:application/octet-stream;base64,${attachment.data}`}
            download={attachment.filename}
            className="block text-blue-600"
          >
            {attachment.filename}
          </a>
        ))}
      </div>

      <div className="mt-4">
        {/* Render embedded images */}
        {getEmbeddedImages().map((image, index) => (
            <img
            key={image.id || index}  // Use image.id if available, otherwise fall back to index
            src={`data:${image.mimeType};base64,${image.data}`}
            alt={`Embedded image ${index}`}
            className="max-w-full h-auto"
            />
        ))}
    </div>

    </div>
  );
};

export default EmailDetail;
