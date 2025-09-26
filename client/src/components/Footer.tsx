import { Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-card py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div data-testid="footer-brand">
            <h3 className="text-2xl font-bold masked-text mb-4">LOVGOL</h3>
            <p className="text-muted-foreground">
              Transforming ideas into digital reality with cutting-edge technology and creative design.
            </p>
          </div>
          
          <div data-testid="footer-services">
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-link-web-dev"
                >
                  Website Development
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-link-app-dev"
                >
                  App Development
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-link-automation"
                >
                  Automation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-link-consulting"
                >
                  Consulting
                </button>
              </li>
            </ul>
          </div>

          <div data-testid="footer-company">
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-link-about"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('clients')} 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-link-clients"
                >
                  Clients
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-link-contact"
                >
                  Contact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="hover:text-primary transition-colors"
                  data-testid="footer-link-careers"
                >
                  Careers
                </button>
              </li>
            </ul>
          </div>

          <div data-testid="footer-connect">
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <button 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="footer-social-twitter"
              >
                <a href="https://x.com/v4_edits" target="_blank">
                <Twitter className="h-5 w-5" />
                </a>
              </button>
              <button 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="footer-social-linkedin"
              >
                <a
                      href="https://www.linkedin.com/in/kola-shankar-315301306"
                      target="_blank"
                    >
                <Linkedin className="h-5 w-5" />
                </a>
              </button>
              <button 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="footer-social-github"
              >
                <a
                      href="https://www.github.com/kolashankar"
                      target="_blank"
                    >
                <Github className="h-5 w-5" />
                </a>
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground" data-testid="footer-copyright">
          <p>&copy; 2024 LOVGOL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
