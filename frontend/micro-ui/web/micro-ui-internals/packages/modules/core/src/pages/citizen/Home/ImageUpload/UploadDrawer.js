import React, { useState, useEffect } from "react";
import { GalleryIcon, RemoveIcon, UploadFile } from "@egovernments/digit-ui-react-components";

function UploadDrawer({ setProfilePic, closeDrawer, userType }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [file, setFile] = useState("");
  const [error, setError] = useState(null);

  const selectfile = (e) => setFile(e.target.files[0]);
  const removeimg = () => setUploadedFile(null);
  const onOverlayBodyClick = () => closeDrawer(false);

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 2000000) {
          setError(t("PT_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else {
          try {
            const response = await Digit.UploadServices.Filestorage(`${userType}-profile`, file, Digit.ULBService.getStateId());
            if (response?.data?.files?.length > 0) {
              const fileStoreId = response?.data?.files[0]?.fileStoreId;
              setUploadedFile(fileStoreId);
              setProfilePic(fileStoreId);
            } else {
              setError(t("FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
            console.error("Modal -> err ", err);
            // setError(t("PT_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);

  return (
    <React.Fragment>
      <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,.5)',
        }} onClick={onOverlayBodyClick}
      ></div>
      <div
        style={{
          width: '100%',
          justifyContent: 'center',
          backgroundColor: 'white',
          alignItems: 'center',
          position: 'fixed',
          height: '20%',
          bottom: userType === 'citizen' ? '2.5rem' : '0',
          zindex: "2",
        }}
      >
        <div style={{ width:  "50%", float: "left",marginLeft:userType === 'citizen' ? "60px":"350px",marginTop:"40px"}}>
        <label for="file"> <GalleryIcon/></label>
        <input type="file" id="file" 
        accept="image/*, .png, .jpeg, .jpg"
        onChange={selectfile}
        style={{display: "none"}}/>
        </div>
  
        <div style={{ width: "20%", float: "right",padding:"30px",marginRight:"50px",marginTop:"15px"}}>
          <button onClick={removeimg}><RemoveIcon /></button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default UploadDrawer;