export default function FormField({ label, type = "text", id, value, onChange, required = false, placeholder = "", maxLength, options = null }) {
  return (
    <div className="mb-6">
      <label className="block text-amber-400 font-semibold mb-2">
        {label} {required && <span className="text-pink-500">*</span>}
      </label>
      {type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          className="w-full p-4 rounded-xl bg-white/10 text-white border border-white/20 focus:border-amber-400 focus:outline-none transition"
          required={required}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows="4"
          maxLength={maxLength}
          className="w-full p-4 rounded-xl bg-white/10 text-white border border-white/20 focus:border-amber-400 focus:outline-none transition resize-none"
          required={required}
        />
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          className="w-full p-4 rounded-xl bg-white/10 text-white border border-white/20 focus:border-amber-400 focus:outline-none transition"
        />
      )}
    </div>
  )
}


