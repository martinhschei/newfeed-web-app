    import { createContext } from 'react';
    
    export const UserContext = createContext({
        id: '',
        name: '',
        phone_number: '',
    })