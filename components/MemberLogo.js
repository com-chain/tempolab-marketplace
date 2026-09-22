function getInitials(name) {
  const words = name.replace(/[()]/g, "").trim().split(/\s+/);
  const first = words[0]?.[0] || "";
  const second = words.length > 1 ? words[1][0] : "";
  return (first + second).toUpperCase();
}

export default function MemberLogo({ member, className = "h-12 w-12" }) {
  if (member.logo) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-lg border border-gray-200 p-1.5 ${
          member.logoOnDark ? "bg-gray-900" : "bg-white"
        } ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.logo}
          alt={member.name}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white ${className}`}
    >
      {getInitials(member.name)}
    </div>
  );
}
