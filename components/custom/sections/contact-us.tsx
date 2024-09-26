import { FormError } from '@/components/custom/form-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ContactUsSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const ContactUs = () => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>('')

  const form = useForm<z.infer<typeof ContactUsSchema>>({
    resolver: zodResolver(ContactUsSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = (values: z.infer<typeof ContactUsSchema>) => {
    startTransition(() => {
      setError('')
      console.log(values)
    })
  }
  return (
    <div
      className="w-full py-20 text-background bg-primary px-6 2xl:px-0"
      id="contact-us"
    >
      <Card className="max-w-xl mx-auto text-center p-1 md:p2 lg:p-4">
        <CardHeader>
          <CardTitle className="text-4xl font-bold mb-4 gradient-text">
            Contact Us
          </CardTitle>
          <p className="mb-4">Have questions or feedback? Reach out to us!</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 max-w-xl mx-auto text-left"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="email"
                        placeholder="juan.delacruz@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="email"
                        placeholder="juan.delacruz@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        placeholder="Your Message"
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormError message={error} />
              <Button
                type="submit"
                disabled={isPending}
                className="w-full"
              >
                Send Message
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ContactUs
