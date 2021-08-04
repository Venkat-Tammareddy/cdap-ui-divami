import React, { useState, useContext, useCallback, createContext } from 'react';

export const ingestionContext = createContext({
  draftObj: {},
  setDraftObjfn: (item: any) => {},
  ingestionTasklList: [],
  setIngestionListfn: (item: any) => {},
});

export const AppProvider = ({ children }) => {
  const [draftObj, setDraftObj] = useState({ ki: 'li' });
  const setDraftObjfn = (item) => {
    setDraftObj(item);
  };
  const [ingestionTasklList, setIngetionTaskList] = useState([]);

  const setIngestionListfn = (item: any) => {
    setIngetionTaskList(item);
  };

  const provider = {
    draftObj,
    setDraftObjfn: useCallback(setDraftObjfn, []),
    ingestionTasklList,
    setIngestionListfn,
  };

  return <ingestionContext.Provider value={provider}>{children}</ingestionContext.Provider>;
};
