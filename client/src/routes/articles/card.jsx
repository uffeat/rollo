//import "@/use.js";

export const Card = ({ path, data  }) => {

  //console.log("root:", root);////

  const { abstract, image, title } = data;

  
  return (
    <div className="card">
      <img
        className="card-img-top"
        src={image.startsWith(`/`) ? `${use.meta.base}${image}` : image}
        alt={`Illustration of ${title.toLowerCase()}`}
      ></img>
      <div className="card-body nav d-flex flex-column">
        <a className="nav-link cursor-pointer" path={path}>
          <h1 className="card-title" title={title}>
            {title}
          </h1>
        </a>
        <p className="card-text">{abstract}</p>
      </div>
      <footer className="card-footer min-h-8"></footer>
    </div>
  );
};
