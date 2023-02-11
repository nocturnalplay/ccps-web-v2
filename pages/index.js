import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home">
        <div className="part-1-left">
          <img
            src="/character/display-bg.png"
            alt="display"
            className="display-image"
          />
          <h1>
            welcome to <span>ccps</span>
          </h1>
          <h2>cyber crime police station</h2>
          <h3>salem city</h3>
          <p>
            Here is the place where we maintaine our case details and further
            record and belonging start maintain your recode with high level
            security !!user Auth loading....user Auth loading....
          </p>
          <button>
            <Link href="/auth/signin">Dashboard</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
