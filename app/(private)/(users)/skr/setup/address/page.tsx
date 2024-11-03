import { AddressForm } from '@/components/custom/address-form'
import SetupWrapper from '@/components/custom/setup-wrapper'

export default function Address() {
  return (
    <SetupWrapper
      title="Where do you live?"
      description="Fill out the necessary location information. This will also help you find tasks near you."
    >
      <AddressForm />
    </SetupWrapper>
  )
}
