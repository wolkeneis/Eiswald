function wrapPromise(promise) {
  let status = 1;
  let result;
  let suspender = promise.then(
    (response) => {
      status = 0;
      result = response;
    },
    (error) => {
      status = 2;
      result = error;
    }
  );
  return {
    read() {
      if (status === 1) {
        throw suspender;
      } else if (status === 2) {
        throw result;
      } else if (status === 0) {
        return result;
      }
    }
  };
}

const isElementInViewport = (element) => {
  var rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function isTouchDevice() {
  return (('ontouchstart' in window) ||
    (navigator.msMaxTouchPoints > 0));
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export { wrapPromise, isElementInViewport, isTouchDevice, clamp };

