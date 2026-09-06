export function MacIllustration({ desktop = false }: { desktop?: boolean }) {
  return (
    <svg
      className="vault-mac"
      viewBox="0 0 100 76"
      fill="none"
      aria-hidden="true"
    >
      <rect x="13" y="9" width="74" height="48" rx="4" />
      <path className="vault-screen" d="M18 14h64v37H18z" />
      {desktop ? (
        <path d="M43 57v9m14-9v9M35 67h30" />
      ) : (
        <path d="M13 57 5 63v2c0 2 2 3 4 3h82c2 0 4-1 4-3v-2l-8-6M40 61h20" />
      )}
      <path className="vault-screen-chain" d="M35 34h30" />
      {[32, 50, 68].map((x) => (
        <circle key={x} cx={x} cy="34" r="4" />
      ))}
    </svg>
  )
}
