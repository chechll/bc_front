import { useEffect } from "react";

const NoPage = ({onLoginChange, operatingData}) => {
    useEffect(() => {
        onLoginChange(operatingData.idUser,operatingData.rights);
    });
    return <></>;
  };
  
  export default NoPage;