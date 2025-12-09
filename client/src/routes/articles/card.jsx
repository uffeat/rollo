import "@/use.js";

export const Card = ({ path, meta  }) => {

  const { abstract, image, title } = meta;

  console.log('image:', image)

  /* Issue
  - React complains that 'image' is undefined eventhough the data set does contain 'image' (a src reference)
  */


  return (
    <div className="card">
      <img
        className="card-img-top"
        src={image.startsWith(`/`) ? `${use.meta.base}${image}` : image}
        alt={`Illustration of ${title.toLowerCase()}`}
      ></img>
      <div className="card-body.nav.d-flex.flex-column">
        <a className="nav-link">
          <h1 className="card-title" title={title}>
            {title}
          </h1>
        </a>
        <p className="card-text">{abstract}</p>
      </div>
      <footer className="card-footer"></footer>
    </div>
  );
};
