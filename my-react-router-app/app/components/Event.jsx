import { Link } from "react-router";

/**
 * Komponenta pro zobrazení karty jedné události.
 * @param {Object} props.event - Data události z DB.
 * @returns {JSX.Element}
 */
export function Event({ event }) {
  // Formátování data do podoby "30. 4."
  const d = new Date(event.event_date);
  const datum = d.getDate() + ". " + (d.getMonth() + 1) + ".";

  return (
    <Link to={`/events/${event.id}`} className="block transition-transform hover:scale-[1.01]">
      <article className="relative flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 min-h-[90px]">
        
        {/* Červený proužek na boku pokud je to test */}
        {event.is_test == 1 && (
          <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-red-500 rounded-r-md" />
        )}
        
        <div className="flex flex-col items-center w-14 mr-4 text-center border-r pr-4 border-gray-50 text-gray-400">
          <span className="text-[10px] font-bold">{datum}</span>
          {/* Ikona se načítá z databáze přes JOIN v loaderu */}
          <img 
      src={event.icon_url} 
  alt="" 
  className="w-8 h-8 object-contain my-1" 
  onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/128/864/864685.png'; }}
/>
          <span className="text-[9px] font-black uppercase">{event.subject_shortcut}</span>
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-gray-800 leading-tight">{event.title}</h3>
          <p className="text-gray-500 text-xs line-clamp-2 mt-1">{event.description}</p>
        </div>
      </article>
    </Link>
  );
}