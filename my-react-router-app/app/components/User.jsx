import { Link, useRouteLoaderData } from "react-router";

export function User() {
  const rootData = useRouteLoaderData("root");
  const uzivatel = rootData?.activeUser || {
    name: "Eliška Nováková",
    avatar_url: ""
  };

  return (
    <Link 
      to="/profile" 
      className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity select-none"
    >
      {uzivatel.avatar_url ? (
        <img 
          src={uzivatel.avatar_url} 
          alt="" 
          className="w-8 h-8 rounded-full object-cover bg-gray-100"
        />
      ) : (
        <span className="material-icons text-gray-800 text-3xl">account_circle</span>
      )}
      <span className="font-semibold text-gray-800 text-sm">
        {uzivatel.name}
      </span>
    </Link>
  );
}