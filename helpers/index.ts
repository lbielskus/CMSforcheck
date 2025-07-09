import { LoginUserParams } from '../types';
import { InputErros } from '../types/error';

export const getErrorMsg = (key: string, errors: InputErros[]) => {
  if (errors.find((err) => err.hasOwnProperty(key) !== undefined)) {
    const errorObj = errors.find((err) => err.hasOwnProperty(key));
    return errorObj && errorObj[key];
  }
};

// Remove loginUser function that uses next-auth
// If you need a Firebase login helper, implement it using Firebase Auth SDK
