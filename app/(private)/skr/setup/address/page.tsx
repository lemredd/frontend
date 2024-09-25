import { AddressForm } from "@/components/custom/address-form"

export default function Address() {
  return (
    <section className="mx-auto container lg:max-w-5xl flex h-full flex-col justify-center">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Where do you live?</h1>
        <p>Fill out the necessary location information. This will also help you find tasks near you.</p>
      </header>

      <AddressForm />
    </section>
  );
}
