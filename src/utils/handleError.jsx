const handleError = (responseBody) => {
      console.error(responseBody);
      const [ firstError ] = responseBody.errorMessages;
      let errorMessage = firstError ? firstError : '';
      if(responseBody.errors) {
        const errorText = Object.values(responseBody.errors).join(".");
        if(errorText) {
          errorMessage = errorMessage ? `${errorMessage}.${errorText}` : errorText;
        }
      };
      return errorMessage;
};

export default handleError;