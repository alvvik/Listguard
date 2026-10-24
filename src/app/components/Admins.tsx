import Image from "next/image";
import { config, Admin } from "../../../config";
const avatarCache = new Map<string, string | null>();
async function getDiscordAvatar(discordId: string) {
  if (avatarCache.has(discordId)) return avatarCache.get(discordId)!;
  try {
    const res = await fetch(`https://discord.com/api/v10/users/${discordId}`, {
      headers: { Authorization: `Bot ${process.env.TOKEN}` },
      next: { revalidate: 60 * 60 * 24 },
      cache: "force-cache",
    });

    if (!res.ok) return null;
    const data = await res.json();

    return data.avatar
      ? `https://cdn.discordapp.com/avatars/${discordId}/${data.avatar}.png?size=256`
      : null;
  } catch {
    return null;
  }
}
async function AdminCard({ admin }: { admin: Admin }) {
  const fallbackAvatar = `https://cdn.discordapp.com/embed/avatars/${Number(admin.discordId) % 5}.png`;
  const avatarUrl = (await getDiscordAvatar(admin.discordId)) || fallbackAvatar;

  return (
    <article className="card bg-base-200/60 backdrop-blur-md border border-base-content/10 p-5 hover:border-primary/50 transition-all duration-300 flex flex-row items-center gap-4 rounded-box">
      <div className="avatar shrink-0">
        <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <Image
            src={avatarUrl}
            alt={`Avatar ${admin.name}`}
            width={64}
            height={64}
            loading="lazy"
            className="rounded-full object-cover"
          />
        </div>
      </div>
      <div className="space-y-1 text-left overflow-hidden">
        <h3 className="font-bold text-lg truncate">{admin.name}</h3>
        <span className="badge badge-primary badge-sm font-medium">
          {admin.rank}
        </span>
      </div>
    </article>
  );
}

export default function Admins() {
  return (
    <section className="flex flex-col items-center justify-center py-8 px-4 max-w-5xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">
          Nasza administracja
        </h2>
        <p className="text-base-content/70 text-sm max-w-md mx-auto">
          Osoby dbające o porządek i rozwój naszego serwera.
        </p>
      </div>
      <div className="grid w-full gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {config.adminsConfig.map((admin) => (
          <AdminCard key={admin.discordId} admin={admin} />
        ))}
      </div>
    </section>
  );
}
