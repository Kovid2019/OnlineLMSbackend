export const generateRandomOTP = (length = 4) => {
  let str = "";
  for (let i = 0; i < length; i++) {
    str += Math.floor(Math.random() * 10); // 0-9
  }
  return str;
};
