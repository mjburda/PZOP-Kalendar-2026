import { useState } from "react";
import { Link } from "react-router";
import { User } from "../components/User";
import { Event } from "../components/Event";

export default function Home() {
  const [filter, setFilter] = useState("Vše");
  const [limit, setLimit] = useState(4); // Zadání: při načtení jen 4 události

  // Tady si představ, že máš data z DB
  const [events] = useState([
    { id: 1, title: "MO 17 - CSS", description: "Jazyk CSS, selektory...", event_date: "2026-04-30", subject_abbr: "WAP", is_test: true, icon_url: "..." },
    // ... další data
  ]);

  const filtered = filter === "Vše" ? events : events.filter(e => e.subject_abbr === filter);

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <User />
        <Link to="/events/new" className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-2xl">+</Link>
      </header>

      {/* Výběr předmětu */}
      <div className="flex gap-2 overflow-x-auto pb-4">
        {["Vše", "WAP", "CJL", "MUL", "MAT"].map(subj => (
          <button 
            key={subj}
            onClick={() => setFilter(subj)}
            className={`px-4 py-1 rounded-full border text-sm transition ${filter === subj ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* Seznam událostí */}
      <div>
        {filtered.slice(0, limit).map(e => <Event key={e.id} event={e} />)}
        
        {filtered.length > limit && (
          <button onClick={() => setLimit(999)} className="w-full py-3 text-blue-600 font-bold">
            Více
          </button>
        )}
      </div>
    </div>
  );
}