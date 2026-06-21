import { Users, Target, Award, Heart } from "lucide-react";

export function About() {
  return (
    <div className="min-h-screen">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About UniServ</h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Empowering students to share their skills and support each other through 
            a trusted university marketplace.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-foreground/70">
              To create a safe, trusted platform where university students can monetize 
              their skills, gain real-world experience, and help their peers succeed 
              academically and professionally.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Values</h2>
            <p className="text-foreground/70">
              Trust, community, and student empowerment are at the core of everything 
              we do. We believe in fostering a supportive environment where students 
              can thrive together.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-12 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-foreground/70 max-w-3xl mx-auto">
            UniServ was founded by students, for students. We noticed that talented 
            peers were looking for ways to earn money while studying, and other students 
            needed help with various tasks. We created this platform to connect these 
            two groups in a safe, university-verified environment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-2">10,000+</h3>
            <p className="text-foreground/70">Active Students</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-2">50,000+</h3>
            <p className="text-foreground/70">Services Completed</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-2">4.8/5</h3>
            <p className="text-foreground/70">Average Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}