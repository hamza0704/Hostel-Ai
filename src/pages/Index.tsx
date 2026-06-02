import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, User, Shield, Sparkles, BarChart3, Bell, Clock, CheckCircle,
  MessageSquare, ArrowRight, Star, Users, Zap, HeartHandshake, FileText
} from 'lucide-react';

export default function Index() {
  const stats = [
    { value: '98%', label: 'Satisfaction Rate', icon: Star },
    { value: '24h', label: 'Avg. Resolution', icon: Clock },
    { value: '10k+', label: 'Complaints Resolved', icon: CheckCircle },
    { value: '500+', label: 'Happy Residents', icon: Users },
  ];

  const howItWorks = [
    { step: '1', title: 'Submit Your Complaint', description: 'Describe your issue with optional photos. Our AI automatically categorizes and prioritizes it.', icon: MessageSquare },
    { step: '2', title: 'Track in Real-Time', description: 'Get instant updates as your complaint moves through the resolution process.', icon: Clock },
    { step: '3', title: 'Quick Resolution', description: 'Our team addresses your issue promptly with full transparency.', icon: CheckCircle },
  ];

  const testimonials = [
    { name: 'Priya Sharma', role: 'Student, Room 204', quote: 'The water issue in my room was fixed within hours of reporting. Amazing service!', rating: 5 },
    { name: 'Rahul Verma', role: 'Resident, Room 112', quote: 'Finally a system that actually works! I can track my complaints and get real updates.', rating: 5 },
    { name: 'Anita Patel', role: 'Student, Room 305', quote: 'The AI categorization is so smart. My electrical complaint was prioritized immediately.', rating: 5 },
  ];

  const features = [
    { icon: Sparkles, title: 'AI Classification', description: 'Smart categorization and priority detection using advanced NLP', color: 'bg-primary/10 text-primary' },
    { icon: Clock, title: 'Real-time Tracking', description: 'Track complaint status from submission to resolution', color: 'bg-amber-500/10 text-amber-600' },
    { icon: BarChart3, title: 'Analytics Dashboard', description: 'Visual insights into trends and common issues', color: 'bg-emerald-500/10 text-emerald-600' },
    { icon: Bell, title: 'Smart Notifications', description: 'Get alerted for high-priority issues and updates', color: 'bg-blue-500/10 text-blue-600' },
    { icon: FileText, title: 'Easy Reporting', description: 'Simple forms with image upload support', color: 'bg-purple-500/10 text-purple-600' },
    { icon: HeartHandshake, title: 'Dedicated Support', description: 'Responsive admin team ready to help', color: 'bg-rose-500/10 text-rose-600' },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Complaint Management</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up leading-tight">
              Your Voice Matters,
              <span className="block text-primary">We Listen & Act</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-slide-up">
              Experience hassle-free hostel living with our smart complaint management system. 
              Submit, track, and resolve issues faster than ever before.
            </p>

            {/* Role Selection Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto animate-slide-up">
              <Link to="/student/auth" className="group">
                <Card className="h-full cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-2 hover:border-primary/50 bg-card">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">I'm a Tenant</CardTitle>
                    <CardDescription>
                      Submit and track your complaints easily
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full group-hover:bg-primary/90">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/admin/auth" className="group">
                <Card className="h-full cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-2 hover:border-secondary/50 bg-card">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="w-8 h-8 text-secondary-foreground" />
                    </div>
                    <CardTitle className="text-xl">I'm an Admin</CardTitle>
                    <CardDescription>
                      Manage complaints and view analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Admin Portal
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to make hostel management effortless for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4" />
              How It Works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple as 1-2-3</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting your issues resolved has never been easier. Here's how it works.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative text-center animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] border-t-2 border-dashed border-primary/30" />
                )}
                <div className="relative">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                    <item.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center shadow-md">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <HeartHandshake className="w-4 h-4" />
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Residents</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our residents have to say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card border-2 hover:border-primary/30 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground italic">"{testimonial.quote}"</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience Better Living?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of satisfied residents who have transformed their hostel experience with HostelAI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/student/auth">
                <Button size="lg" className="px-8">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/admin/auth">
                <Button size="lg" variant="outline" className="px-8">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-xl">HostelAI</span>
              </div>
              <p className="text-muted-foreground max-w-sm">
                Smart hostel management powered by AI. Making residential life easier, one complaint at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Portals</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/student/auth" className="hover:text-foreground transition-colors">Student Login</Link></li>
                <li><Link to="/admin/auth" className="hover:text-foreground transition-colors">Admin Login</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>© 2026 HostelAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
