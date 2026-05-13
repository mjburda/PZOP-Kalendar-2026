/**
 * Komponenta uživatele zobrazující avatar a jméno.
 * @returns {JSX.Element}
 */
export function User() {
  return (
    <div className="flex items-center gap-2">
      <img 
        src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png" 
        alt="Avatar" 
        className="w-10 h-10 rounded-full border border-gray-200"
      />
      <span className="font-bold text-gray-700">Eliška Nováková</span>
    </div>
  );
}