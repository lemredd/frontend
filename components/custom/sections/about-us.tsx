import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, ThumbsUp, Users } from 'lucide-react'
import Link from 'next/link'

const AboutUs = () => {
  return (
    <div
      className="w-full py-10 md:py-20 bg-background text-foreground px-4 xl:px-0"
      id="about"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10 gradient-text">
          About Task Grabber
        </h2>
        <p className="text-sm mb-4">
          Welcome to Task Grabber, where we revolutionize how tasks are managed
          and completed. Our platform seamlessly connects those who need help
          with skilled individuals eager to assist. Whether you’re looking to
          get a project off your plate or searching for the perfect opportunity
          to showcase your talents, you’re in the right place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <Card className="p-6 bg-muted text-muted-foreground">
            <CheckCircle className="w-12 h-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold mt-4">Streamlined Process</h3>
            <p className="mt-2">
              Our intuitive interface ensures that both seekers and providers
              can easily navigate and connect without hassle.
            </p>
          </Card>

          <Card className="p-6 bg-muted text-muted-foreground">
            <Users className="w-12 h-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold mt-4">Community Focused</h3>
            <p className="mt-2">
              Join a thriving community of task seekers and providers where
              collaboration leads to success.
            </p>
          </Card>

          <Card className="p-6 bg-muted text-muted-foreground">
            <ThumbsUp className="w-12 h-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold mt-4">Quality Connections</h3>
            <p className="mt-2">
              We prioritize quality by matching tasks with the right talents,
              ensuring efficient and effective results.
            </p>
          </Card>
        </div>

        <p className="mt-10 text-lg mb-4">
          At Task Grabber, we’re driven by the belief that every task is an
          opportunity for growth and collaboration. Our user-friendly interface
          ensures that both task seekers and providers can navigate with ease,
          allowing you to focus on what truly matters—getting the job done.
        </p>

        <p className="mb-8">
          Join our thriving community today and experience a new era of task
          management. Together, let’s transform challenges into achievements and
          make every task a stepping stone towards success!
        </p>

        <Button
          asChild
          size="lg"
        >
          <Link
            href="/auth/join"
            className="inline-block bg-primary text-white py-3 px-6 rounded-md shadow-lg transition-transform transform hover:scale-105 !text-lg"
          >
            Join Task Grabber
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default AboutUs
