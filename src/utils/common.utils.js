export function generatePassword(length = 8) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const specialChars = '!@#$%^&*()_+[]{}<>?';
  
  const allChars = uppercase + lowercase + digits + specialChars;
  let password = '';

  // Ensure at least one character from each set
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  
  // Generate remaining characters
  for (let i = 3; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars[randomIndex];
  }

  // Shuffle the password to ensure random distribution
  password = password.split('').sort(() => 0.5 - Math.random()).join('');

  return password;
}