"use client"

import { makeAddress } from "@/actions/skr/address";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AddressSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormError } from "./form-error";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function AddressForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string>()
  const form = useForm<z.infer<typeof AddressSchema>>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      province: "",
      city_muni: "",
      barangay: "",
      address_1: "",
      address_2: "",
      postal_code: "",
    }
  })

  function onSubmit() {
    startTransition(() => {
      makeAddress(form.getValues()).then((data) => {
        if (data?.error) setError(data?.error)
      })
    })
  }
  return (
    <Form {...form}>
      <form>
        <div className="flex justify-between [&>*]:basis-1/3 gap-x-6">
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Input placeholder="Province" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city_muni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City/Municipality</FormLabel>
                <FormControl>
                  <Input placeholder="City/Municipality" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="barangay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barangay</FormLabel>
                <FormControl>
                  <Input placeholder="barangay" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error} />
        <Button type="submit" disabled={isPending} onClick={onSubmit}>Save</Button>
      </form>
    </Form>
  )
}
