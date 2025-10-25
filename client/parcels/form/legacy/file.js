/* Returns file as JSON: {"content": <dataUrl>, "name": <file.name>, "type": <file.type>} */
export const serialize = (file) => {
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  return new Promise((resolve, reject) => {
    fileReader.addEventListener("load", (event) => {
      resolve(
        JSON.stringify({
          content: fileReader.result,
          name: file.name,
          type: file.type,
        })
      );
    });
    fileReader.addEventListener("error", (event) => {
      reject(new Error(`Could not serialize file: ${file.name}`));
    });
  });
};
