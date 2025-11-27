// src/pages/GroupsPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Groups from "../features/groups/Groups";

export default function GroupsPage() {
  const navigate = useNavigate();
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const handleShowGroupCalendar = (groupId) => {
    setSelectedGroupId(groupId);
    navigate(`/calendar?groupId=${groupId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Groups onShowGroupCalendar={handleShowGroupCalendar} />
    </div>
  );
}

