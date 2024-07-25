'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Address } from '@/@types/Address'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'

const searchAddressFormSchema = z.object({
  address: z.string(),
})

type SearchAddressFormValues = z.infer<typeof searchAddressFormSchema>

interface SearchAddressFormProps {
  onCreateAddressFormSubmit: (addressData: { address: Address }) => void
}

export function SearchAddressForm({
  onCreateAddressFormSubmit,
}: SearchAddressFormProps) {
  const { register, handleSubmit, reset } = useForm<SearchAddressFormValues>({
    resolver: zodResolver(searchAddressFormSchema),
    defaultValues: {
      address: '',
    },
  })

  async function onSearchAddressFormSubmit({
    address,
  }: SearchAddressFormValues) {
    reset()

    if (
      (address.includes('-') && address.length === 9) ||
      !address.includes('/')
    ) {
      const zipCode = address.replace('-', '')

      const { data: addressInfos } = await axios.get(
        `https://viacep.com.br/ws/${zipCode}/json/`,
      )

      if (addressInfos.erro === 'true') {
        return toast.error('Invalid postal code')
      }

      const formattedAddress = {
        street: addressInfos.logradouro,
        neighborhood: addressInfos.bairro,
        city: addressInfos.localidade,
        state: addressInfos.uf,
        zip: addressInfos.cep,
      }

      try {
        const { data: savedAddress } = await axios.post(
          'http://localhost:3333/address',
          formattedAddress,
        )

        toast.success('Address saved successfully!')

        return onCreateAddressFormSubmit(savedAddress)
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 409) {
            return toast.error('This address is already saved!')
          }
        }

        return toast.error('An error occurred while saving the address')
      }
    }

    if (address.includes('/')) {
      const [street, city, state] = address.split('/')

      const { data: addressInfos } = await axios.get(
        `https://viacep.com.br/ws/${state}/${city}/${street}/json/`,
      )

      if (addressInfos.erro === 'true') {
        return toast.error('Invalid postal code')
      }

      const formattedAddress = {
        street: addressInfos[0].logradouro
          ? addressInfos[0].logradouro
          : street,
        neighborhood: addressInfos[0].bairro,
        city: addressInfos[0].localidade,
        state: addressInfos[0].uf,
        zip: addressInfos[0].cep,
      }

      try {
        const { data: savedAddress } = await axios.post(
          'http://localhost:3333/address',
          formattedAddress,
        )

        toast.success('Address saved successfully!')

        return onCreateAddressFormSubmit(savedAddress)
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 409) {
            return toast.error('This address is already saved!')
          }
        }

        return toast.error('An error occurred while saving the address')
      }
    }
  }

  return (
    <form
      className="flex items-center justify-center gap-4"
      onSubmit={handleSubmit(onSearchAddressFormSubmit)}
    >
      <input
        type="text"
        placeholder="Enter a postal code or address"
        className="w-full px-3 py-2 border border-card-foreground/20 rounded-md text-card-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        {...register('address')}
      />

      <button className="h-10 bg-primary text-sm rounded-md text-primary-foreground hover:bg-primary/90 px-4 py-2">
        Search
      </button>
    </form>
  )
}
