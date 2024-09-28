import Link from 'next/link'

const Hero = () => {
  return (
    <div
      className="relative w-full h-screen flex items-center justify-center bg-[url('/images/hero.png')] bg-cover bg-center bg-no-repeat text-foreground bg-fixed"
      id="#"
    >
      <div className="bg-background/60 dark:bg-background/50 absolute inset-0"></div>
      <div className="relative z-10 text-center max-w-2xl container p-6">
        <h1 className="text-6xl font-extrabold leading-tight tracking-tight mb-4 gradient-text">
          Unlock Your Potential with Task Grabber
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Connect with opportunities and skills, making task management
          effortless and efficient.
        </p>
        <p className="text-md md:text-lg mb-8">
          Whether you need help or want to offer your expertise, our platform is
          designed for you.
        </p>
        <Link
          href="/auth/join"
          className="inline-block bg-primary text-white py-3 px-6 rounded-md shadow-lg transition-transform transform hover:scale-105"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}

export default Hero
