import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import NoteCard from "../../components/NoteCard";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/Toast";
import EmptyCard from "../../components/EmptyCard";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });
  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message: "",
      type,
    });
  };
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      // Check if error.response is defined and if it contains the status code
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        // Handle other errors or log them
        console.error("An error occurred:", error.message || error);
      }
    }
  };

  //Get All Notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An Unexpecteed Error Occurred");
    }
  };

  //Delete Notes
  const deleteNotes = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete/" + noteId);
      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", "delete");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An Unexpecteed Error Occurred");
      }
    }
  };

  //search Node
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: { query },
      });
      if (response.data && !response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updatePinned = async (noteData)=>{
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/pinned/" + noteId, {
     "isPinned":!noteId.isPinned
      });
      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully")
        getAllNotes();
     
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };
  useEffect(() => {
    getAllNotes();
    getUserInfo();

    return () => {};
  }, []);
  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allNotes.map((item, index) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => {
                  handleEdit(item);
                }}
                onDelete={() => deleteNotes(item)}
                onPinNote={() => {updatePinned(item)}}
              />
            ))}
          </div>
        ) : (
          <EmptyCard />
        )}
      </div>
      <button
        className="w-16 h-16 items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
        aria-label="Add Note"
      >
        <MdAdd className="text-[32px] m-auto text-white" />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 "
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
