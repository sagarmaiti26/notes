import React from "react";
import { getInitials } from "../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  let firstName;

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 bg-slate-100 font-medium ">
        {getInitials(userInfo?.fullName)}
      </div>
      <div className="">
        <p className="text-m font-medium">{userInfo?.fullName.split(" ")[0]}</p>
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>
          Log out
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
