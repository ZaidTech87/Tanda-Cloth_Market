import React, { useRef, useState } from 'react';

const ProfileHeader = ({ user }) => {
  // 1. Hidden input ko trigger karne ke liye Ref
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Doosre layers ko click lene se rokne ke liye
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Turant preview dikhane ke liye
    setPreview(URL.createObjectURL(file));

    // Backend par upload karne ka logic
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.id}/upload-photo`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("Profile photo updated successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="profile-container">
      {/* Banner Area */}
      <div className="h-40 bg-purple-600 w-full relative"></div>

      {/* Profile Photo Area */}
      <div className="relative -mt-16 ml-8 inline-block" style={{ zIndex: 100 }}>
        {/* 'M' Logo Circle */}
        <div
          onClick={handleIconClick}
          className="w-32 h-32 rounded-full border-4 border-white bg-blue-500 flex items-center justify-center text-white text-4xl font-bold cursor-pointer overflow-hidden relative group"
        >
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" alt="Profile" />
          ) : (
            <span>{user?.name?.charAt(0) || 'M'}</span>
          )}

          {/* Facebook-style Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
          </div>
        </div>

        {/* 2. Hidden Input - Bilkul isi tarah likhein */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }} // Hidden input
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default ProfileHeader;