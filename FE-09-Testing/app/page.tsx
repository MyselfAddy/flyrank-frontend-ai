import Chat from '@/components/Chat';

export default function HomePage() {
  return (
    <main className="h-screen w-full bg-slate-900/5 sm:bg-slate-900/10 flex flex-col justify-center overflow-hidden">
      <Chat />
    </main>
  );
}
