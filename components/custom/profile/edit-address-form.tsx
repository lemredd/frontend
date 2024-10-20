"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { MapPin, Pencil } from "lucide-react"
import { AddressForm as NewAddressForm } from "@/components/custom/address-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { editAddress } from '@/actions/address'
import { AsyncStrictCombobox } from '@/components/custom/combobox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import usePSGCAddressFields from '@/hooks/usePSGCAddressFields'
import { EditAddressSchema } from '@/lib/schema'
import { useAuthStore } from "@/store/AuthStore"

interface Props {
  address?: Record<string, string>
}

function AddressForm({ address }: Props) {
  const { user } = useAuthStore()
  const [isPending, startTransition] = useTransition()
  const [mustReset, setMustReset] = useState(true)
  const form = useForm<z.infer<typeof EditAddressSchema>>({
    resolver: zodResolver(EditAddressSchema),
    defaultValues: {
      province: '',
      city_muni: '',
      barangay: '',
      address_1: '',
      address_2: '',
      postal_code: '',
    },
  })

  function onSubmit() {
    startTransition(() => {
      editAddress(
        form.getValues(),
        user!.user_metadata.role_code.toLocaleLowerCase()
      ).then(data => {
        if (data?.error) return console.error(data?.error)
        location.reload()
      })
    })
  }

  const {
    provinces,
    cityMunicipalities,
    barangays,
    getProvinces,
    getCityMunicipalities,
    getBarangays,
  } = usePSGCAddressFields()

  useEffect(() => {
    if (provinces.length) return
    getProvinces()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const subscription = form.watch(() => {
      getCityMunicipalities(form.watch('province', undefined))
      getBarangays(form.watch('city_muni', undefined))
    })

    return () => subscription?.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch])

  useEffect(() => {
    if (!address) return undefined
    if (Object.values(form.getValues()).every(Boolean) || !mustReset) return undefined

    form.reset({
      province: provinces.find(province => province.label === address.province)?.value,
      city_muni: cityMunicipalities.find(cityMuni => cityMuni.label === address.city_muni)?.value,
      barangay: barangays.find(barangay => barangay.label === address.barangay)?.value,
      address_1: address.address_1,
      address_2: address.address_2,
      postal_code: address.postal_code,
      id: address.id
    })

    setMustReset(!(Object.values(form.getValues()).every(Boolean)))
  }, [address, form, provinces, cityMunicipalities, barangays, mustReset])

  function setProvince(value: string) {
    form.setValue('province', value)
    form.setValue('city_muni', '')
    form.setValue('barangay', '')
  }

  return (
    <Form {...form}>
      <form className="space-y-6" id="edit-address-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                    onValueChange={(value) => form.setValue('city_muni', value)}
                    disabled={!form.watch('province')}
                  />
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
                <FormLabel className="block">Barangay</FormLabel>
                <FormControl>
                  <AsyncStrictCombobox
                    items={barangays}
                    placeholder="Select barangay"
                    value={field.value}
                    onValueChange={(value) => form.setValue('barangay', value)}
                    disabled={!form.watch('city_muni')}
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
                  <Input
                    placeholder="Postal Code"
                    inputMode="numeric"
                    {...field}
                  />
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
                <Input
                  placeholder="Building No., Street, Subdivision, etc."
                  {...field}
                />
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
                <Input
                  placeholder="Building No., Street, Subdivision, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isPending} form="edit-address-form">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export function EditAddressForm({ address }: Props) {
  // TODO: add form
  const content = address
    ? [address?.barangay, address?.city_muni, address?.province].join(", ")
    : "No address yet"
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-max flex gap-x-2 [&:hover_>.pencil]:block [&:hover_>.map-pin]:hidden">
          <MapPin size={16} className="map-pin" />
          <Pencil size={16} className="pencil hidden" />
          <span>{content}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
          <DialogDescription>
            Edit your address
          </DialogDescription>
        </DialogHeader>
        {address ? <AddressForm address={address} /> : <NewAddressForm redirectTo="/pdr/profile" />}

      </DialogContent>
    </Dialog>
  )
}
