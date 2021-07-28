import React, { useState, useContext, useCallback, createContext } from 'react';

export const ingestionContext = createContext({ draftObj: {}, setDraftObjfn: (item: any) => {} });

export const AppProvider = ({ children }) => {
  // const appContext = useContext(ingestionContext);
  const [draftObj, setDraftObj] = useState({ ki: 'li' });
  const setDraftObjfn = (item) => {
    setDraftObj(item);
  };
  const provider = { draftObj, setDraftObjfn: useCallback(setDraftObjfn, []) };

  return <ingestionContext.Provider value={provider}>{children}</ingestionContext.Provider>;
};
