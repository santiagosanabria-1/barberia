import { createContext, useContext } from 'react';

export const AppContext = createContext({ brand: 'Black Crown Barber' });
export const useAppContext = () => useContext(AppContext);
