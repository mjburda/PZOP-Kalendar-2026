import { Link } from "react-router";

/**
 * Komponenta pro zobrazení jedné události v seznamu.
 * @param {Object} props.event - Objekt s daty události z tabulky pzop_event.
 * @returns {JSX.Element}
 */
export function Event({ event }) {
  return (
    <Link to={`/events/${event.id}`} className="relative flex items-center bg-white p-4 rounded-xl shadow-sm mb-3 border border-gray-100 hover:shadow-md transition group">
      {/* Červený pruh pro testy - v DB máš is_test jako 1/0 */}
      {event.is_test == 1 && <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-red-500 rounded-r-lg" />}
      
      <div className="flex flex-col items-center w-14 mr-4 text-center border-r pr-4">
        {/* OPRAVA CHYBY: numeric místo M/d */}
        <span className="text-sm font-bold text-gray-500">
          {new Date(event.event_date).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' })}
        </span>
        {/* Ikona - v DB máš "monitor", "camera" atd. */}
        <div className="text-blue-600 my-1 font-bold">
           {/* Tady by ideálně byla ikona, pro teď tam necháme text zkratky */}
           {event.subject_shortcut} 
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-gray-800 text-lg leading-tight">{event.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-1">{event.description}</p>
      </div>
    </Link>
  );
}