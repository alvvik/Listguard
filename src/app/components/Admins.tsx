import Image from "next/image";
import { config, Admin } from "../../../config";

async function getDiscordAvatar(discordId: string) {
  try {
    const res = await fetch(`https://discord.com/api/v10/users/${discordId}`, {
      headers: { Authorization: `Bot ${process.env.TOKEN}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const data = await res.json();

    return data.avatar
      ? `https://cdn.discordapp.com/avatars/${discordId}/${data.avatar}.png?size=128`
      : null;
  } catch {
    return null;
  }
}

async function AdminCard({ admin }: { admin: Admin }) {
  const fallbackAvatar = `https://cdn.discordapp.com/embed/avatars/${Number(admin.discordId) % 5}.png`;
  const avatarUrl = (await getDiscordAvatar(admin.discordId)) || fallbackAvatar;

  return (
    <article className="card card-side items-center gap-4 bg-base-300 p-4 shadow">
      <Image
        src={avatarUrl}
        alt={`Avatar ${admin.name}`}
        width={64}
        height={64}
        loading="eager"
        className="rounded-full ring-offset-1 ring-accent-content ring-2"
      />
      <div className="space-y-1">
        <h3 className="card-title text-lg">{admin.name}</h3>
        <p className="text-sm text-base-content/70">{admin.rank}</p>
      </div>
    </article>
  );
}

export default function Admins() {
  return (
    <section className="flex flex-col items-center justify-center">
      <h2 className="mb-2 text-2xl font-bold">Nasza administracja</h2>
      <div className="grid w-2/3 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {config.adminsConfig.map((admin) => (
          <AdminCard key={admin.discordId} admin={admin} />
        ))}
      </div>
    </section>
  );
}
