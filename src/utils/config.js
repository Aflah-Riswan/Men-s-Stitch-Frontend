 const getConfig = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
};
export default getConfig