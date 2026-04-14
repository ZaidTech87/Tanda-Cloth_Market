import React, { useRef, useState } from 'react';

const ProfileHeader = ({ user }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleLogoClick = (e) => {
    // Ye line bahut zaroori hai
    e.preventDefault();
    e.stopPropagation();

    console.log("CLICKED: Explorer khulna chahiye!");

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Backend URL check karein
      const response = await fetch(`http://localhost:8080/api/users/${user?.id || 1}/upload-photo`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) alert("Photo Updated!");
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', zIndex: 10 }}>
      {/* Banner */}
      <div style={{ height: '160px', backgroundColor: '#4f46e5', width: '100%' }}></div>

      {/* Profile Circle Section */}
      <div
        onClick={handleLogoClick}
        style={{
          position: 'absolute',
          bottom: '-50px',
          left: '40px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '5px solid white',
          backgroundColor: '#ef4444', // Maine RED color kar diya hai test ke liye
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 99999, // Bahut high value
          pointerEvents: 'auto' // Force click enable
        }}
      >
        {preview ? (
          <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="profile" />
        ) : (
          <span style={{ fontSize: '40px', color: 'white', fontWeight: 'bold', pointerEvents: 'none' }}>
            {user?.name?.charAt(0) || 'M'}
          </span>
        )}
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*"
      />
    </div>
  );
};

export default ProfileHeader;