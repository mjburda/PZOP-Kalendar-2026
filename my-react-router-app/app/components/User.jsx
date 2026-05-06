/**
 * Komponenta zobrazující jméno a avatar uživatele.
 * @returns {JSX.Element}
 */
export function User() {
  return (
    <div className="flex items-center gap-3">
      <img 
        src="https://avatar.iran.liara.run/public/7" 
        alt="Avatar" 
        className="w-10 h-10 rounded-full border border-gray-200"
      />
      <span className="font-semibold text-gray-700">Eliška Nováková</span>
    </div>
  );
}