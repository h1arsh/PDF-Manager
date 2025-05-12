export const scrollToTop = (options = { behavior: 'smooth' }) => {
  window.scrollTo({
    top: 0,
    ...options
  });
};

export const saveScrollPosition = () => {
  sessionStorage.setItem('scrollPosition', window.scrollY);
};

export const restoreScrollPosition = () => {
  const scrollPosition = sessionStorage.getItem('scrollPosition');
  if (scrollPosition) {
    window.scrollTo({
      top: parseInt(scrollPosition),
      behavior: 'auto'
    });
    sessionStorage.removeItem('scrollPosition');
  }
};