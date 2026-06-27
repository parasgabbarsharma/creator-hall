import { Metadata } from "next";
import { CONTACT_INFO } from "@/lib/config";
import { PhoneIcon, WhatsAppIcon, YouTubeIcon, InstagramIcon, FacebookIcon } from "@/components/ui/icons";
import { Meteors, ShinyButton, HoverTiltCard, TextReveal } from "@/components/ui/premium-ui";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Paras Gabbar Sharma for business inquiries, collaborations, and more.",
};

export default function ContactPage() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden py-24 px-4">
      {/* Background elements */}
      <div className="absolute inset-0 w-full h-full bg-background z-[-2]" />
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-accent/5 to-transparent z-[-1]" />
      <div className="absolute -top-[300px] -right-[200px] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px] z-[-1]" />
      
      <div className="max-w-4xl w-full mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <TextReveal text="Let's Talk" className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight justify-center" />
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed mt-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Whether it&apos;s for business inquiries, brand collaborations, or just dropping a message, feel free to reach out directly.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          
          {/* WhatsApp Card */}
          <HoverTiltCard>
            <div className="relative h-full flex flex-col items-center justify-center text-center p-10 rounded-3xl bg-surface border border-border/60 shadow-xl overflow-hidden group">
              <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-20 h-20 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-500">
                <WhatsAppIcon size={40} />
              </div>
              
              <h3 className="text-2xl font-heading font-bold mb-2">Chat on WhatsApp</h3>
              <p className="text-muted mb-8">The fastest way to get a reply. Message us directly on WhatsApp.</p>
              
              <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full py-6 text-lg shadow-lg shadow-green-500/20 font-semibold transition-all group-hover:shadow-green-500/40">
                  <WhatsAppIcon size={20} className="mr-2" />
                  Send a Message
                </Button>
              </a>
            </div>
          </HoverTiltCard>

          {/* Direct Call Card */}
          <HoverTiltCard>
            <div className="relative h-full flex flex-col items-center justify-center text-center p-10 rounded-3xl bg-surface border border-border/60 shadow-xl overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-20 h-20 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                <PhoneIcon size={36} />
              </div>
              
              <h3 className="text-2xl font-heading font-bold mb-2">Direct Call</h3>
              <p className="text-muted mb-8">Prefer speaking directly? Call the number for urgent business inquiries.</p>
              
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} className="w-full">
                <Button variant="secondary" className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-full py-6 text-lg font-semibold transition-all shadow-sm">
                  <PhoneIcon size={18} className="mr-2" />
                  {CONTACT_INFO.phone}
                </Button>
              </a>
            </div>
          </HoverTiltCard>
        </div>

        {/* Email & Socials Premium Block */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0f172a] text-background p-10 md:p-14 text-center mt-8 shadow-2xl">
          <Meteors number={20} />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-pink-600/10 pointer-events-none" />
          
          <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 relative z-10 text-white">Other Ways To Connect</h3>
          <p className="text-[#a3a3a3] mb-10 max-w-lg mx-auto relative z-10 text-base md:text-lg">
            For official emails or to follow the journey across other platforms.
          </p>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6">
            <a href={`mailto:${CONTACT_INFO.email}`}>
              <ShinyButton 
                text={CONTACT_INFO.email}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-8 py-4 text-base"
              />
            </a>
            
            <div className="flex items-center gap-4">
              <a href="https://www.youtube.com/@parassharmagabbar" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-accent hover:border-accent hover:scale-110 transition-all duration-300">
                <YouTubeIcon size={20} />
              </a>
              <a href="https://www.instagram.com/paras_sharma_gabbar?igsh=MXh3NWkyaGN4enhy" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-pink-600 hover:border-pink-600 hover:scale-110 transition-all duration-300">
                <InstagramIcon size={20} />
              </a>
              <a href="https://www.facebook.com/share/18d4ZP7mQi/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:scale-110 transition-all duration-300">
                <FacebookIcon size={20} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
