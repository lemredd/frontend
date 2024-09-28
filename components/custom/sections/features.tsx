import { Card } from '@/components/ui/card' // Assuming you have a Card component in shadcn
import { Edit, Save, Search } from 'lucide-react'

const Features = () => {
  const features = [
    {
      title: 'Create Account',
      description:
        'Sign up in minutes and start posting tasks or grabbing opportunities effortlessly.',
      icon: <Edit className="w-12 h-12 mx-auto text-primary" />,
    },
    {
      title: 'Search Work',
      description:
        'Easily find tasks that match your skills with our intuitive search and filtering options.',
      icon: <Search className="w-12 h-12 mx-auto text-primary" />,
    },
    {
      title: 'Save and Apply',
      description:
        'Bookmark tasks for later or apply instantly, ensuring you never miss a great opportunity.',
      icon: <Save className="w-12 h-12 mx-auto text-primary" />,
    },
  ]

  return (
    <div
      className="w-full py-10 md:py-20 px-4 xl:px-0 text-foreground"
      id="features"
    >
      <Card className="p-6 flex flex-wrap justify-evenly items-center  max-w-5xl mx-auto text-center">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="p-6 border-0 shadow-none w-full sm:w-1/3 flex flex-col items-center"
          >
            {feature.icon}
            <h3 className="text-2xl font-semibold mt-4">{feature.title}</h3>
            <p className="mt-2">{feature.description}</p>
          </Card>
        ))}
      </Card>
    </div>
  )
}

export default Features
