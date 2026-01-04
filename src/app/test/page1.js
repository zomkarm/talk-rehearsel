"use client"; // if you’re on Next.js App Router

import { useRef } from "react";

export default function HighlightDemo() {
  const containerRef = useRef(null);

  const templateHtml = `
      <!-- HEADER -->
  <header>
    <h1>🌟 Your Name</h1>
    <p><em>Frontend Developer • Clarity-first Builder</em></p>
    <nav>
      <a href="#about">About</a> |
      <a href="#projects">Projects</a> |
      <a href="#skills">Skills</a> |
      <a href="#media">Media</a> |
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <hr />

  <!-- HERO -->
  <section id="hero">
    <h2>Welcome</h2>
    <p>Hello! I build <strong>production-grade</strong> web experiences.</p>
    <figure>
      <img src="/media/hero.jpg" alt="Portrait" width="200" />
      <figcaption>Hero image with caption</figcaption>
    </figure>
    <p><a href="/resume.pdf" download>📄 Download Resume</a></p>
  </section>

  <hr />

  <!-- ABOUT -->
  <section id="about">
    <h2>About Me</h2>
    <article>
      <h3>Bio</h3>
      <p>I value <abbr title="Accessibility">a11y</abbr>, performance, and clarity.</p>
      <blockquote>
        <p>“Clarity is the foundation of speed.”</p>
        <cite>— Someone wise</cite>
      </blockquote>
      <details>
        <summary>More about my approach</summary>
        <p>I prefer semantic HTML and progressive enhancement.</p>
      </details>
    </article>
    <aside>
      <h4>Quick Facts</h4>
      <ul>
        <li>📍 Pune, India</li>
        <li>👨‍💻 Since <time datetime="2020">2020</time></li>
        <li>📧 <a href="mailto:hello@example.com">hello@example.com</a></li>
      </ul>
    </aside>
  </section>

  <hr />

  <!-- SKILLS -->
  <section id="skills">
    <h2>Skills</h2>
    <ul>
      <li>HTML5</li>
      <li>CSS3</li>
      <li>Tailwind</li>
    </ul>
    <p>Learning progress:</p>
    <progress value="70" max="100">70%</progress>
    <br />
    <p>System usage:</p>
    <meter value="0.6">60%</meter>
  </section>

  <hr />

  <!-- PROJECTS -->
  <section id="projects">
    <h2>Projects</h2>

    <article>
      <h3>Project One</h3>
      <figure>
        <img src="/media/project1.png" alt="Screenshot Project One" width="300" />
        <figcaption>Accessible components</figcaption>
      </figure>
      <p><a href="#">🔗 Live Demo</a></p>
    </article>

    <br />

    <article>
      <h3>Project Two</h3>
      <figure>
        <img src="/media/project2.png" alt="Screenshot Project Two" width="300" />
        <figcaption>Performance layouts</figcaption>
      </figure>
      <p><a href="#">🔗 GitHub Repo</a></p>
    </article>

    <br />

    <table border="1">
      <caption>📊 Project Stats</caption>
      <thead>
        <tr><th>Project</th><th>Issues</th><th>Stars</th></tr>
      </thead>
      <tbody>
        <tr><td>One</td><td>12</td><td>134</td></tr>
        <tr><td>Two</td><td>7</td><td>98</td></tr>
      </tbody>
    </table>
  </section>

  <hr />

  <!-- MEDIA -->
  <section id="media">
    <h2>Media</h2>
    <h3>Audio</h3>
    <audio controls>
      <source src="/media/intro.mp3" type="audio/mpeg" />
    </audio>
    <br /><br />

    <h3>Video</h3>
    <video controls width="320">
      <source src="/media/demo.mp4" type="video/mp4" />
    </video>
    <br /><br />

    <h3>SVG</h3>
    <svg width="100" height="100">
      <circle cx="50" cy="50" r="40"></circle>
    </svg>
    <br /><br />

    <h3>Canvas</h3>
    <canvas width="200" height="100">Canvas fallback text</canvas>
  </section>

  <hr />

  <!-- CONTACT -->
  <section id="contact">
    <h2>Contact</h2>
    <address>
      Your Name<br />
      Pune, India<br />
      <a href="mailto:hello@example.com">hello@example.com</a>
    </address>

    <form>
      <fieldset>
        <legend>Get in touch</legend>
        <label>Name: <input type="text" required /></label><br />
        <label>Email: <input type="email" required /></label><br />
        <label>Message:<br /><textarea rows="4"></textarea></label><br />
        <button type="submit">Send</button>
      </fieldset>
    </form>
  </section>

  <hr />

  <!-- FOOTER -->
  <footer>
    <p>&copy; <time datetime="2025">2025</time> Your Name</p>
    <p><small>Built with pure HTML5</small></p>
  </footer>
  `;

  const clearHighlights = () => {
    if (!containerRef.current) return;
    containerRef.current
      .querySelectorAll(".highlighted")
      .forEach((el) => el.classList.remove("highlighted"));
  };

  const highlightTag = (tag) => {
    if (!containerRef.current) return;
    clearHighlights();
    containerRef.current.querySelectorAll(tag).forEach((el) => {
      el.classList.add("highlighted");
    });
  };

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "1rem" }}>
      {/* Controls */}
      <div>
        <h2>Controls</h2>
        <button onClick={() => highlightTag("div")}>Highlight &lt;div&gt;</button>
        <br />
        <button onClick={() => highlightTag("header")}>Highlight &lt;header&gt;</button>
        <br />
        <button onClick={() => highlightTag("footer")}>Highlight &lt;footer&gt;</button>
        <br />
        <button onClick={() => highlightTag("button")}>Highlight &lt;button&gt;</button>
        <br />
        <button onClick={clearHighlights}>Clear</button>
      </div>

      {/* Template */}
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: templateHtml }}
        style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
        }}
      />

      {/* Global styles so they apply inside injected HTML */}
      <style jsx global>{`
        .highlighted {
          outline: 2px solid #3b82f6;
          background-color: rgba(59, 130, 246, 0.15);
          transition: background-color 0.3s ease;
        }
        button {
          margin: 0.25rem 0;
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: #f3f4f6;
          cursor: pointer;
        }
        button:hover {
          background: #e5e7eb;
        }
      `}</style>
    </div>
  );
}
