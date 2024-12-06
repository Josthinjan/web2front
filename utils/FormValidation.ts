export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export const validatePassword = (password: string): boolean => {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  return re.test(password);
}

export const isEmpty = (value: string): boolean => {
  return value === '';
}

export const validateName = (name: string): boolean => {
  const re = /^[a-zA-Z\s]*$/;
  return re.test(name);
} 

export const validateNumber = (number: string): boolean => {
  const re = /^[0-9]*$/;
  return re.test(number);
}

export const validateIdentity = (identity: string): boolean => {
  const re = /^[0-9]{10}$/;
  return re.test(identity);
}