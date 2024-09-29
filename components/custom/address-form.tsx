"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { AddressSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { makeAddress } from "@/actions/skr/address";
import { FormError } from "@/components/custom/form-error";
import { AsyncStrictCombobox } from "@/components/custom/combobox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import usePSGCAddressFields from "@/hooks/usePSGCAddressFields";

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

  const {
    provinces,
    cityMunicipalities,
    barangays,
    getProvinces,
    getCityMunicipalities,
    getBarangays
  } = usePSGCAddressFields()

  useEffect(() => {
    getProvinces()

    const subscription = form.watch(() => {
      getCityMunicipalities(form.watch("province", undefined))
      getBarangays(form.watch("city_muni", undefined))
    })

    return () => subscription?.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch])

  function setProvince(value: string) {
    form.setValue("province", value)
    form.setValue("city_muni", "")
    form.setValue("barangay", "")
  }

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="flex justify-between flex-wrap gap-6 [&>*]:basis-[calc(50%-1.5rem)] items-center">
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block">Province</FormLabel>
                <FormControl>
                  <AsyncStrictCombobox
                    items={provinces}
                    placeholder="Select province"
                    value={field.value}
                    onValueChange={setProvince}
                  />
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
                <FormLabel className="block">City/Municipality</FormLabel>
                <FormControl>
                  <AsyncStrictCombobox
                    items={cityMunicipalities}
                    placeholder="Select city/municipality"
                    value={field.value}
                    onValueChange={value => form.setValue("city_muni", value)}
                    disabled={!form.watch("province")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /><FormField
            control={form.control}
            name="barangay"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block">Barangay</FormLabel>
                <FormControl>
                  <AsyncStrictCombobox
                    items={barangays}
                    placeholder="Select barangay"
                    value={field.value}
                    onValueChange={value => form.setValue("barangay", value)}
                    disabled={!form.watch("city_muni")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Postal Code" inputMode="numeric" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address_1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address 1</FormLabel>
              <FormControl>
                <Input placeholder="Building No., Street, Subdivision, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address_2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address 2</FormLabel>
              <FormControl>
                <Input placeholder="Building No., Street, Subdivision, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormError message={error} />
        <Button type="submit" disabled={isPending} onClick={onSubmit}>Save</Button>
      </form>
    </Form>
  )
}