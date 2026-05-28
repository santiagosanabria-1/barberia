export const registerValidator = (body) => {
  if (!body.name || body.name.length < 2) return 'Name is required';
  if (!/^\S+@\S+\.\S+$/.test(body.email || '')) return 'Valid email is required';
  if (!body.password || body.password.length < 8) return 'Password must be at least 8 characters';
  if (body.role && !['admin', 'barbero', 'cliente'].includes(body.role)) return 'Invalid role';
  return true;
};

export const loginValidator = (body) => {
  if (!/^\S+@\S+\.\S+$/.test(body.email || '')) return 'Valid email is required';
  if (!body.password) return 'Password is required';
  return true;
};
