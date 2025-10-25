/* 
blog.js
*/

export default async ({ layout, Blog }) => {
  layout.clear(":not([slot])");
  const blog = Blog({ parent: layout });
};
