import Link from "next/link";
import Image from "next/image";
import { ChevronRight, GraduationCap } from "lucide-react";
import { BackgroundPaths } from "./components/hero";
import { LoginDialog } from "./components/LoginPopup";
import { HeroScrollVideo } from "./components/VideoP";

export default function LandingPage() {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ boxSizing: "border-box" }}
    >
      <header className="sticky p-2 top-0 z-50 w-full flex justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <span className="text-xl font-bold">EduFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="#features"
              className="text-[18px] transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-[18px] transition-colors hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              href="#benefits"
              className="text-[18px] transition-colors hover:text-primary"
            >
              Benefits
            </Link>
            <Link
              href="#faq"
              className="text-[18px] transition-colors hover:text-primary"
            >
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <LoginDialog buttonLabel="Log in" buttonClassName="text-[15px]" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <BackgroundPaths />
        <div className="w-full p-[10px] mt-[10px] mb-[20px] flex flex-col items-center">
          <h1
            className="text-transparent bg-clip-text 
                    bg-gradient-to-r from-neutral-900 to-neutral-700/80 
                    dark:from-white dark:to-white/80 text-4xl sm:text-5xl md:text-7xl font-bold mb-8 tracking-[5px] "
            style={{ textAlign: "center" }}
          >
            EDUFLOW
          </h1>
          <HeroScrollVideo />
        </div>
        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="w-full  bg-muted py-7 flex justify-center"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  How It Works
                </div>
                <h2 className="text-3 xl font-bold tracking-[2px] sm:text-5xl ">
                  Simple Process, Powerful Results
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed to be intuitive and easy to use,
                  while providing comprehensive tracking.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="relative flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Create Your Profile</h3>
                <p className="text-center text-muted-foreground tracking-[2px]">
                  Sign up and set up your student profile with basic
                  information.
                </p>
              </div>
              <div className="relative flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Add Your Activities</h3>
                <p className="text-center text-muted-foreground">
                  Record academic achievements, extracurricular activities, and
                  upload supporting documents.
                </p>
              </div>
              <div className="relative flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Generate Reports</h3>
                <p className="text-center text-muted-foreground">
                  Create comprehensive reports and portfolios for applications,
                  interviews, or personal tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          id="benefits"
          className="w-full py-12 md:py-24 lg:py-32 bg-background flex justify-center"
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex items-center justify-center">
                <Image
                  src="/dashboard-image.jpg"
                  alt="Students using the platform"
                  width={750}
                  height={750}
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                    Benefits
                  </div>
                  <h2
                    className="text-3xl font-bold tracking-tighter sm:text-4xl tracking-[2px]"
                    style={{ letterSpacing: 2 }}
                  >
                    Why Choose EduFlow?
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                    Our platform offers numerous advantages for students,
                    faculty, and institutions.
                  </p>
                </div>
                <ul className="grid gap-6">
                  <li className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-1">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">Comprehensive Tracking</h3>
                      <p className="text-muted-foreground">
                        Keep all your academic and extracurricular achievements
                        in one place.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-1">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">Easy Documentation</h3>
                      <p className="text-muted-foreground">
                        Upload and store proof of participation and certificates
                        securely.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-1">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">
                        Integrated with College Systems
                      </h3>
                      <p className="text-muted-foreground">
                        Connect with existing college portals for seamless
                        information flow.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-1">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">
                        Professional Portfolio Creation
                      </h3>
                      <p className="text-muted-foreground">
                        Generate impressive reports and portfolios for job
                        applications and interviews.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Students of GNDEC
                </div>
                <h2
                  className="text-3xl font-bold tracking-tighter sm:text-5xl tracking-[2px]"
                  style={{ letterSpacing: 2 }}
                >
                  What Students Say
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from students who have transformed their academic
                  tracking with our platform.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              <div className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-4">
                  <p className="text-muted-foreground text-2xl">
                    "ਇਹ ਪਲੇਟਫਾਰਮ ਮੇਰੇ ਕਾਲਜ ਦੀਆਂ ਸਰਗਰਮੀਆਂ ਨੂੰ ਟ੍ਰੈਕ ਕਰਨ ਦੇ ਤਰੀਕੇ
                    ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬਦਲ ਚੁੱਕਾ ਹੈ। ਹਰ ਚੀਜ਼ ਇੱਕ ਥਾਂ ਤੇ ਹੋਣ ਕਾਰਨ
                    ਮੇਰਾ ਰੈਜ਼ਿਊਮੇ ਬਣਾਉਣਾ ਬਹੁਤ ਆਸਾਨ ਹੋ ਗਿਆ!"
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div>
                    <p className="font-medium">Taranvir Kaur</p>
                    <p className="text-sm text-muted-foreground">
                      Computer Science, Senior
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-4">
                  <p className="text-muted-foreground text-2xl">
                    "ਮੈਂ ਪਹਿਲਾਂ ਆਪਣੀਆਂ ਐਕਸਟਰਾ ਸਰਗਰਮੀਆਂ ਦੇ ਸਰਟੀਫਿਕੇਟ ਗੁਆ ਲੈਂਦਾ
                    ਸੀ। ਹੁਣ ਮੈਂ ਉਹਨਾਂ ਨੂੰ ਤੁਰੰਤ ਅਪਲੋਡ ਕਰ ਸਕਦਾ ਹਾਂ ਅਤੇ ਜਦੋਂ
                    ਚਾਹੀਦਾ ਹੋਵੇ ਤਦ ਐਕਸੈੱਸ ਕਰ ਸਕਦਾ ਹਾਂ।"
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div>
                    <p className="font-medium">Ravjot Singh</p>
                    <p className="text-sm text-muted-foreground">
                      Business Administration, Junior
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="w-full py-12 md:py-24 lg:py-32 bg-background flex justify-center"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  FAQ
                </div>
                <h2
                  className="text-3xl font-bold tracking-tighter sm:text-5xl"
                  style={{ letterSpacing: 2 }}
                >
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about our platform.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold">
                  How secure is my information?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  We use industry-standard encryption and security practices to
                  ensure your data is protected. Only you and authorized faculty
                  can access your information.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold">Can I export my data?</h3>
                <p className="mt-2 text-muted-foreground">
                  Yes, you can export your data in various formats including
                  PDF, Word, and Excel. You can also generate custom reports for
                  specific purposes.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold">
                  How does the integration with college systems work?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Our platform connects securely with your college's existing
                  systems to pull in academic records automatically. You only
                  need to add extracurricular activities manually.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold">
                  What happens to my data after I graduate?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  You'll maintain access to your account and data even after
                  graduation. You can continue to use it for job applications
                  and professional development.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-background py-6 md:py-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <span className="text-lg font-bold">EduFlow</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} EduFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
