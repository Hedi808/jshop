import Link from "next/link";
import { Boxes, LayoutDashboard, PackageCheck, Store } from "lucide-react";
import { Logo } from "@/components/layout/logo";

const links = [{ label: "Overview", href: "/admin", icon: LayoutDashboard }, { label: "Products", href: "/admin/products", icon: Boxes }, { label: "Orders", href: "/admin/orders", icon: PackageCheck }];

export function AdminNav() {
  return <aside className="bg-[#0a0a0a] text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64"><div className="flex items-center justify-between px-5 py-5 lg:block lg:p-7"><Logo light /><p className="hidden text-[9px] font-black uppercase tracking-[.16em] text-neutral-500 lg:mt-2 lg:block">Internal operations</p><Link href="/" className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white lg:hidden"><Store className="size-4" /> Store</Link></div><nav className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-4 lg:mt-8 lg:block lg:space-y-2 lg:px-4">{links.map(({ label, href, icon: Icon }) => <Link key={href} href={href} className="flex shrink-0 items-center gap-3 rounded-md px-4 py-3 text-xs font-black uppercase tracking-[.08em] text-neutral-400 transition hover:bg-white/10 hover:text-white"><Icon className="size-4" />{label}</Link>)}</nav><div className="absolute bottom-6 left-6 hidden lg:block"><Link href="/" className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-white"><Store className="size-4" /> Back to storefront</Link></div></aside>;
}
