import React, { useState, useContext, useCallback, createContext } from 'react';

export const ingestionContext = createContext({ draftObj: {}, setDraftObjfn: (item: any) => { }, ingestionTasklList: [],
 setIngestionListfn:(item: any) => {
  }});

export const AppProvider = ({ children }) => {
<<<<<<< HEAD
  const [draftObj, setDraftObj] = useState({});
=======
  const [draftObj, setDraftObj] = useState({ ki: 'li' });
>>>>>>> a36f5a0934fc8a50c970830f0daae204acbf26d4
  const setDraftObjfn = (item) => {
    setDraftObj(item);
  };
  const [ingestionTasklList,setIngetionTaskList]=useState([]);

  const setIngestionListfn=(item:any)=>{
    setIngetionTaskList(item);
  }


  const provider = { draftObj, setDraftObjfn: useCallback(setDraftObjfn, []),ingestionTasklList,setIngestionListfn };

  return <ingestionContext.Provider value={provider}>{children}</ingestionContext.Provider>;
};
