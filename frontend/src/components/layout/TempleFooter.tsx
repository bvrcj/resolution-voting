import Link from "next/link";

export default function TempleFooter() {
  return (
    <footer className="temple-footer">
      <div className="mx-auto grid h-full max-w-6xl items-center gap-4 px-6 py-3 text-[11px] text-white/90 md:grid-cols-3">
        <div>
          <div className="h-12 w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2">
            <p className="text-xs uppercase tracking-[0.3em] text-white/80">Hindu Community</p>
            <p className="mt-1 text-sm">Read more...</p>
          </div>
          <p className="mt-2 text-white/80">Serving the Hindu community since 1977.</p>
        </div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-white">Stay Connected</p>
          <div className="mt-2 flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5">
            <input
              className="w-full bg-transparent text-[11px] text-white placeholder:text-white/60 focus:outline-none"
              placeholder="Enter mail"
            />
            <button className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-orange-800">
              Subscribe
            </button>
          </div>
          <div className="mt-2 flex items-center justify-center gap-3">
            <a
              className="social-pill"
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                <path
                  fill="currentColor"
                  d="M22 12.07C22 6.49 17.52 2 11.95 2S1.9 6.49 1.9 12.07c0 4.9 3.58 8.97 8.26 9.74v-6.9H7.58v-2.84h2.58V9.92c0-2.55 1.52-3.96 3.84-3.96 1.12 0 2.3.2 2.3.2v2.51h-1.3c-1.29 0-1.7.8-1.7 1.62v1.95h2.9l-.46 2.84h-2.44v6.9c4.68-.77 8.26-4.84 8.26-9.74z"
                />
              </svg>
            </a>
            <a
              className="social-pill"
              href="https://www.x.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                <path
                  fill="currentColor"
                  d="M18.9 2H22l-7.2 8.23L23 22h-6.4l-5.01-6.8L5.6 22H2.5l7.73-8.85L1 2h6.55l4.52 6.2L18.9 2zm-1.12 18h1.77L7.6 3.8H5.7L17.78 20z"
                />
              </svg>
            </a>
            <a
              className="social-pill"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                <path
                  fill="currentColor"
                  d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm5.9-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zm3.1 1.1c-.07-1.49-.42-2.8-1.5-3.87-1.07-1.07-2.38-1.43-3.87-1.5-1.53-.09-6.13-.09-7.66 0-1.49.07-2.8.42-3.87 1.5-1.07 1.07-1.43 2.38-1.5 3.87-.09 1.53-.09 6.13 0 7.66.07 1.49.42 2.8 1.5 3.87 1.07 1.07 2.38 1.43 3.87 1.5 1.53.09 6.13.09 7.66 0 1.49-.07 2.8-.42 3.87-1.5 1.07-1.07 1.43-2.38 1.5-3.87.09-1.53.09-6.13 0-7.66zM19 19.3a3.3 3.3 0 0 1-1.86 1.86c-1.29.51-4.35.39-5.14.39-.78 0-3.85.12-5.14-.39A3.3 3.3 0 0 1 5 19.3c-.51-1.29-.39-4.35-.39-5.14 0-.78-.12-3.85.39-5.14A3.3 3.3 0 0 1 6.86 7.1c1.29-.51 4.35-.39 5.14-.39.78 0 3.85-.12 5.14.39A3.3 3.3 0 0 1 19 8.96c.51 1.29.39 4.35.39 5.14 0 .79.12 3.85-.39 5.14z"
                />
              </svg>
            </a>
            <a
              className="social-pill"
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                <path
                  fill="currentColor"
                  d="M23 7.5a2.9 2.9 0 0 0-2.06-2.06C19.1 5 12 5 12 5s-7.1 0-8.94.44A2.9 2.9 0 0 0 1 7.5 30.2 30.2 0 0 0 .5 12c0 1.55.2 3.1.5 4.5a2.9 2.9 0 0 0 2.06 2.06C4.9 19 12 19 12 19s7.1 0 8.94-.44A2.9 2.9 0 0 0 23 16.5c.3-1.4.5-2.95.5-4.5s-.2-3.1-.5-4.5zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"
                />
              </svg>
            </a>
            <a className="text-[11px] underline" href="https://livermoretemple.org/" target="_blank" rel="noreferrer">
              Site Map
            </a>
          </div>
          <p className="mt-2 text-[11px]">Â© 2026 Hindu Community and Cultural Center</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">Hindu Community and Cultural Center</p>
          <p className="text-white/80">Shiva-Vishnu Temple, Livermore, California</p>
          <p className="text-white/80">A Non-Profit Organization since 1977</p>
          <p className="text-white/80">Phone: +1 (925) 449 6255</p>
          <p className="mt-1 font-semibold text-white">Email: info@livermoretemple.org</p>
        </div>
      </div>
    </footer>
  );
}
