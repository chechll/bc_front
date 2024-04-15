import { useEffect } from "react";

const NoPage = ({onLoginChange, operatingData}) => {
    useEffect(() => {
        onLoginChange(operatingData.idUser,operatingData.rights, operatingData.token);
    });
    return <></>;
  };
  
  export default NoPage;