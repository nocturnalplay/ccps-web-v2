import Link from "next/link";

export default function Home() {
  return (
    <div className="home">
      <header>
        <h1>
          welcome to <span>ccps</span>
        </h1>
        <h1>cyber crime police station</h1>
        <h2>salem city</h2>
        <p>
          Here is the place where we maintaine our case details and further
          recode and belonging
        </p>
        <p>start maintain your recode with high level security</p>
        <button>
          <Link href="/auth/signin">Dashboard</Link>
        </button>
      </header>
    </div>
  );
}
