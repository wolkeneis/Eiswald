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

export { wrapPromise };

