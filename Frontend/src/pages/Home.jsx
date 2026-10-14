import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  ArrowRight,
  UserRound,
  UserPlus,
  Zap,
  ShieldCheck,
  UsersRound,
  Image as ImageIcon,
} from "lucide-react";
import "./Home.css";

const features = [
  { icon: Zap, title: "Real-Time Chat", copy: "Instant messaging with zero delay.", tone: "blue" },
  { icon: ShieldCheck, title: "Secure & Private", copy: "Your conversations are always safe.", tone: "purple" },
  { icon: UsersRound, title: "Connect Easily", copy: "Find and chat with your friends.", tone: "pink" },
  { icon: ImageIcon, title: "Share Everything", copy: "Send photos, files and more.", tone: "cyan" },
];

export default function Home() {
  const navigate = useNavigate();
  const goLogin = () => navigate("/login");
  const goRegister = () => navigate("/register");

  return (
    <main className="home-landing">
      <div className="home-stars" aria-hidden="true" />
      <header className="home-nav">
        <button className="home-brand" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="ChatApp home">
          <span className="home-brand-icon"><MessageCircle size={26} /><i /><i /><i /></span>
          <span>̷V̷̷I̷̷b̷̷e̷̷M̷a̷̷t̷̷c̷̷h̷</span>
        </button>
        <nav className="home-nav-links" aria-label="Main navigation">
          <a href="#features">Connect</a><span>•</span><a href="#features">Chat</a><span>•</span><a href="#features">Share</a><span>•</span><a href="#join">Anytime</a>
        </nav>
        <div className="home-nav-actions">
          <button type="button" className="home-nav-login" onClick={goLogin}>Login</button>
          <button type="button" className="home-nav-register" onClick={goRegister}>Register <ArrowRight size={16} /></button>
        </div>
      </header>

      <section className="home-hero">
        <div className="home-hero-copy">
          <div className="home-eyebrow"><span /> REAL-TIME MESSAGING</div>
          <h1>Stay Connected<br /><span>Anywhere</span></h1>
          <p>Chat,VideoCall, share moments, and be closer with the people who matter.<br className="desktop-break" /> Fast. Secure. Real-time.</p>
          <div className="home-hero-actions">
            <button className="home-cta home-cta-login" type="button" onClick={goLogin}><UserRound size={24} /> <span>Login</span><ArrowRight size={22} /></button>
            <button className="home-cta home-cta-register" type="button" onClick={goRegister}><UserPlus size={24} /> <span>Register</span><ArrowRight size={22} /></button>
          </div>
          <div className="home-trust-line"><span><i /> Private by design</span><span><i /> Live messaging</span><span><i /> Live VideoCalling</span></div>
        </div>
        <div className="home-hero-visual" aria-hidden="true">
          <div className="home-visual-halo" />
          <div className="home-orbit home-orbit-one"><span className="home-orbit-light light-cyan" /></div>
          <div className="home-orbit home-orbit-two"><span className="home-orbit-light light-purple" /></div>
          <div className="home-orbit home-orbit-three"><span className="home-orbit-light light-blue" /></div>
          <div className="home-orbit home-orbit-four"><span className="home-orbit-light light-pink" /></div>
          <div className="home-visual-center" />
          <span className="home-star-point point-one" />
          <span className="home-star-point point-two" />
          <span className="home-star-point point-three" />
          <span className="home-star-point point-four" />
          <span className="home-star-point point-five" />
          <span className="home-star-point point-six" />
        </div>
      </section>

      <section className="home-features" id="features">
        <div className="home-section-heading"><span>BUILT FOR EVERYDAY CONNECTION</span><h2>Why Choose V̷̷I̷̷b̷̷e̷̷M̷a̷̷t̷̷c̷̷h̷</h2><p>A modern and secure chat experience with everything you need.</p></div>
        <div className="home-feature-grid">
          {features.map(({ icon: Icon, title, copy, tone }) => (
            <article className={`home-feature-card ${tone}`} key={title}>
              <div className="home-feature-icon"><Icon size={27} /></div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-join" id="join">
        <div className="home-planet-glow" aria-hidden="true" />
        <div className="home-section-heading"><span>YOUR NEXT CONVERSATION STARTS HERE</span><h2>Join the Conversation</h2><p>Create your account or log in to start chatting now.</p></div>
        <div className="home-join-actions">
          <button className="home-cta home-cta-login" type="button" onClick={goLogin}><UserRound size={23} /><span>Login</span><ArrowRight size={21} /></button>
          <button className="home-cta home-cta-register" type="button" onClick={goRegister}><UserPlus size={23} /><span>Register</span><ArrowRight size={21} /></button>
        </div>
      </section>

      <footer className="home-footer"><span className="home-footer-brand"><MessageCircle size={17} />̷V̷̷I̷̷b̷̷e̷̷M̷a̷̷t̷̷c̷̷h̷</span><span>Made for the conversations that matter.</span><button type="button" onClick={goLogin}>Get started <ArrowRight size={14} /></button></footer>
    </main>
  );
}
