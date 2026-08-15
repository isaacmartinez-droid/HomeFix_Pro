import React from 'react';

const TopBar = ({ userName = 'Usuario', userAvatar = null }) => {
  return (
    <header className="bg-surface-container-lowest text-primary w-full top-0 sticky shadow-sm z-40">
      <div className="flex justify-between items-center px-lg py-sm max-w-container-max mx-auto">
        <div className="flex-1"></div>
        <div className="flex items-center space-x-md">
          <button className="text-on-surface-variant hover:bg-surface-container-low transition-all duration-200 p-2 rounded-full cursor-pointer">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-surface-container-low transition-all duration-200 p-1 rounded-lg pr-3">
            {userAvatar ? (
              <img alt="User Avatar" className="w-8 h-8 rounded-full object-cover border border-outline-variant" src={userAvatar} />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-container text-primary font-bold flex items-center justify-center">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-label-md text-label-md text-on-surface">{userName}</span>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">arrow_drop_down</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
