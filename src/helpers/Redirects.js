export const redirectPrevious = (navigate) => {
  const previousDomain = document.referrer;
  const currentDomain = window.location.origin;

  if (previousDomain.startsWith(currentDomain)) {
    navigate(-1);
  } else {
    navigate('/');
  }
};
